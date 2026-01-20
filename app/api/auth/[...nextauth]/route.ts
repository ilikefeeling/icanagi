import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                // User 정보에서 role 가져오기
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { role: true, id: true },
                })

                session.user.id = user.id
                session.user.role = dbUser?.role || UserRole.USER
            }
            return session
        },
        async signIn({ user, account }) {
            // 첫 로그인인지 확인
            if (account && user.email) {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                })

                // 관리자 이메일 목록
                const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []

                // 새 사용자이고 관리자 이메일이면 ADMIN으로 설정
                if (!existingUser && adminEmails.includes(user.email)) {
                    await prisma.user.update({
                        where: { email: user.email },
                        data: { role: UserRole.ADMIN },
                    })
                }
            }
            return true
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    session: {
        strategy: 'database',
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

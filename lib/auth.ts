import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { UserRole } from '@prisma/client'

/**
 * 현재 로그인한 사용자 정보 가져오기 (서버 컴포넌트용)
 */
export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user
}

/**
 * 관리자 권한 확인
 */
export async function requireAdmin() {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('로그인이 필요합니다')
    }

    if (user.role !== UserRole.ADMIN) {
        throw new Error('관리자 권한이 필요합니다')
    }

    return user
}

/**
 * 로그인 확인
 */
export async function requireAuth() {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('로그인이 필요합니다')
    }

    return user
}

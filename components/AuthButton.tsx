'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { LogIn, LogOut, User } from 'lucide-react'

export function AuthButton() {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-slate-700" />
                <div className="w-20 h-4 bg-slate-700 rounded" />
            </div>
        )
    }

    if (session?.user) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                    {session.user.image ? (
                        <Image
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    ) : (
                        <User className="w-5 h-5 text-electric-400" />
                    )}
                    <span className="text-sm text-slate-300">{session.user.name}</span>
                    {session.user.role === 'ADMIN' && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-electric-500/20 text-electric-400">
                            ADMIN
                        </span>
                    )}
                </div>

                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">로그아웃</span>
                </button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => signIn('google')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-800 transition-all shadow-lg hover:shadow-xl"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                <span className="text-sm font-medium">Google 로그인</span>
            </button>

            <button
                onClick={() => signIn('kakao')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FEE500] hover:bg-[#FDD835] text-gray-900 transition-all shadow-lg hover:shadow-xl"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-5.5 0-10 3.58-10 8 0 2.89 1.86 5.43 4.64 6.88-.2.75-.76 2.84-.87 3.3-.13.54.2.53.42.38.18-.11 2.92-1.97 3.8-2.56.73.1 1.48.16 2.26.16 5.5 0 10-3.58 10-8s-4.5-8-10-8z" />
                </svg>
                <span className="text-sm font-medium">카카오 로그인</span>
            </button>
        </div>
    )
}

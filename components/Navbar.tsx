'use client'

import Link from 'next/link'
import { AuthButton } from './AuthButton'
import { useSession } from 'next-auth/react'
import { LayoutDashboard, Home } from 'lucide-react'

export function Navbar() {
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === 'ADMIN'

    return (
        <nav className="sticky top-0 z-50 bg-hero-blue shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* 로고 */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-xl font-bold text-hero-blue">i</span>
                        </div>
                        <span className="text-xl font-bold text-white">
                            icanagi
                        </span>
                    </Link>

                    {/* 네비게이션 링크 */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                        >
                            <span className="text-sm font-medium">AI Tools</span>
                        </Link>

                        <Link
                            href="/business"
                            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                        >
                            <span className="text-sm font-medium">AI for Business</span>
                        </Link>

                        <Link
                            href="/courses"
                            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                        >
                            <span className="text-sm font-medium">AI Courses</span>
                            <span className="px-1.5 py-0.5 text-xs font-bold bg-white/20 rounded text-white">NEW</span>
                        </Link>

                        <Link
                            href="/newsletter"
                            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                        >
                            <span className="text-sm font-medium">Newsletter</span>
                        </Link>

                        <Link
                            href="/resources"
                            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                        >
                            <span className="text-sm font-medium">Resources ▼</span>
                        </Link>

                        {isAdmin && (
                            <Link
                                href="/admin/products"
                                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="text-sm font-medium">관리자</span>
                            </Link>
                        )}
                    </div>

                    {/* 우측 버튼 영역 */}
                    <div className="flex items-center gap-3">
                        {/* 검색 버튼 */}
                        <button className="p-2 text-white/90 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* 인증 버튼 */}
                        <AuthButton />
                    </div>
                </div>
            </div>
        </nav>
    )
}

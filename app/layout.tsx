import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'icanagi - AI 서비스 마켓플레이스',
    description: '혁신적인 AI, AGI, Agent 솔루션을 한곳에서 만나보세요',
    keywords: ['AI', 'AGI', 'Agent', 'SaaS', 'AI 마켓플레이스'],
    authors: [{ name: 'icanagi' }],
    openGraph: {
        title: 'icanagi - AI 서비스 마켓플레이스',
        description: '혁신적인 AI, AGI, Agent 솔루션을 한곳에서 만나보세요',
        type: 'website',
        locale: 'ko_KR',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
            <body className={inter.className}>
                <Providers>
                    <Navbar />
                    <main className="min-h-screen">{children}</main>
                </Providers>
            </body>
        </html>
    )
}

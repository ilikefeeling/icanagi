import { getProductBySlug, incrementClickCount } from '@/lib/actions/product.actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, ExternalLink, Eye, MousePointerClick, Calendar } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { getCurrentUser } from '@/lib/auth'
import { formatNumber, formatRelativeTime } from '@/lib/utils'
import type { Metadata } from 'next'

interface ProductPageProps {
    params: {
        slug: string
    }
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const result = await getProductBySlug(params.slug)

    if (!result.success || !result.product) {
        return {
            title: '상품을 찾을 수 없습니다',
        }
    }

    const { product } = result

    return {
        title: product.metaTitle || `${product.name} - icanagi`,
        description: product.metaDescription || product.description.substring(0, 160),
        openGraph: {
            title: product.metaTitle || product.name,
            description: product.metaDescription || product.description.substring(0, 160),
            images: product.thumbnailUrl ? [product.thumbnailUrl] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.metaTitle || product.name,
            description: product.metaDescription || product.description.substring(0, 160),
            images: product.thumbnailUrl ? [product.thumbnailUrl] : [],
        },
    }
}

const categoryColors = {
    APP: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    SAAS: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    AI_AGENT: 'bg-electric-500/20 text-electric-400 border-electric-500/30',
    TOOL: 'bg-green-500/20 text-green-400 border-green-500/30',
}

export default async function ProductPage({ params }: ProductPageProps) {
    const [result, user] = await Promise.all([
        getProductBySlug(params.slug),
        getCurrentUser(),
    ])

    if (!result.success || !result.product) {
        notFound()
    }

    const { product, relatedProducts } = result
    const isAdmin = user?.role === 'ADMIN'

    // CTA 클릭 핸들러 (클라이언트 컴포넌트에서 처리)
    const handleCTAClick = async () => {
        'use server'
        await incrementClickCount(product.id)
    }

    return (
        <div className="min-h-screen bg-navy-950 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 뒤로 가기 */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>홈으로 돌아가기</span>
                </Link>

                {/* 메인 컨텐츠 */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
                    {/* 좌측: 이미지 */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24">
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                                {product.thumbnailUrl ? (
                                    <Image
                                        src={product.thumbnailUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-8xl opacity-20">🤖</div>
                                    </div>
                                )}
                            </div>

                            {/* 통계 */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Eye className="w-4 h-4" />
                                        <span className="text-sm">조회수</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {formatNumber(product.viewCount)}
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <MousePointerClick className="w-4 h-4" />
                                        <span className="text-sm">클릭수</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {formatNumber(product.clickCount)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 우측: 정보 */}
                    <div className="lg:col-span-3">
                        {/* 카테고리 */}
                        <div className="mb-4">
                            <span
                                className={`inline-block px-3 py-1 text-sm font-bold rounded-full border ${categoryColors[product.category]
                                    }`}
                            >
                                {product.category.replace('_', ' ')}
                            </span>
                        </div>

                        {/* 제목 */}
                        <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>

                        {/* 메타 정보 */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatRelativeTime(new Date(product.createdAt))}</span>
                            </div>
                            {product.createdBy.name && (
                                <div>
                                    <span>작성자: {product.createdBy.name}</span>
                                </div>
                            )}
                        </div>

                        {/* 태그 */}
                        {product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {product.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-3 py-1 text-sm rounded-lg bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-electric-500/50 transition-colors"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* 간단한 소개 */}
                        <div className="prose prose-invert prose-sm max-w-none mb-6">
                            <p className="text-lg text-gray-300 leading-relaxed">
                                {product.description.substring(0, 200)}
                                {product.description.length > 200 ? '...' : ''}
                            </p>
                        </div>

                        {/* CTA 버튼 */}
                        <form action={handleCTAClick}>
                            <a
                                href={product.serviceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-electric-500 to-blue-600 hover:from-electric-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-electric-500/50 hover:shadow-xl hover:shadow-electric-500/60 transition-all"
                            >
                                <span>서비스 시작하기</span>
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </form>

                        {/* 관리자 버튼 */}
                        {isAdmin && (
                            <div className="mt-4 flex gap-3">
                                <Link
                                    href={`/admin/products/edit/${product.id}`}
                                    className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition-all"
                                >
                                    수정
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* 상세 설명 (Markdown) */}
                <div className="mb-12">
                    <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
                        <h2 className="text-2xl font-bold text-white mb-6">상세 설명</h2>
                        <div className="prose prose-invert prose-lg max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {product.description}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* 관련 상품 */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">관련 상품</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    href={`/products/${relatedProduct.slug}`}
                                    className="group"
                                >
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-700 group-hover:border-electric-500/50 transition-all">
                                        {relatedProduct.thumbnailUrl ? (
                                            <Image
                                                src={relatedProduct.thumbnailUrl}
                                                alt={relatedProduct.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-4xl opacity-20">🤖</div>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="mt-3 font-semibold text-white group-hover:text-electric-400 transition-colors line-clamp-1">
                                        {relatedProduct.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {relatedProduct.category.replace('_', ' ')}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

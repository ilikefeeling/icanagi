'use client'

import Image from 'next/image'
import { Eye, MousePointerClick, Trash2, DollarSign, Zap } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProduct } from '@/lib/actions/product.actions'
import { formatNumber } from '@/lib/utils'
import { QuickPreviewModal } from './QuickPreviewModal'
import type { Product, ProductTag, User } from '@prisma/client'

interface ProductCardProps {
    product: Product & {
        tags: ProductTag[]
        createdBy: Pick<User, 'name' | 'email'>
    }
    isAdmin?: boolean
}

const categoryColors = {
    APP: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    SAAS: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    AI_AGENT: 'bg-electric-500/20 text-electric-400 border-electric-500/30',
    TOOL: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const pricingIcons = {
    FREE: '🆓',
    FREEMIUM: '💎',
    PAID: '💰',
    ENTERPRISE: '🏢',
}

export function ProductCard({ product, isAdmin }: ProductCardProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm(`"${product.name}" 상품을 정말 삭제하시겠습니까?`)) {
            return
        }

        setIsDeleting(true)
        const result = await deleteProduct(product.id)

        if (!result.success) {
            alert(result.error || '삭제에 실패했습니다')
            setIsDeleting(false)
        }
    }

    const handleCardClick = (e: React.MouseEvent) => {
        // 삭제 버튼 클릭한 경우는 무시
        if ((e.target as HTMLElement).closest('button')) {
            return
        }
        setShowPreview(true)
    }

    const handleNavigate = () => {
        setShowPreview(false)
        router.push(`/products/${product.slug}`)
    }

    return (
        <>
            <div
                onClick={handleCardClick}
                className={`group relative rounded-xl overflow-hidden bg-white border border-light-border hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer ${isDeleting ? 'opacity-50' : ''
                    }`}
            >
                <div className="flex items-center gap-4 p-4">
                    {/* 아이콘/썸네일 - 좌측 */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                        {product.thumbnailUrl ? (
                            <Image
                                src={product.thumbnailUrl}
                                alt={product.name}
                                fill
                                className="rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                <span className="text-2xl">🤖</span>
                            </div>
                        )}

                        {/* 가격 배지 - 아이콘 위 작은 표시 */}
                        <div className="absolute -top-1 -right-1">
                            <span className="text-xs">
                                {pricingIcons[product.pricingTier as keyof typeof pricingIcons]}
                            </span>
                        </div>
                    </div>

                    {/* 콘텐츠 - 중앙 */}
                    <div className="flex-1 min-w-0">
                        {/* 제목 \u0026 카테고리 */}
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors[product.category]}`}>
                                {product.category.replace('_', ' ')}
                            </span>
                        </div>

                        {/* 설명 */}
                        <p className="text-light-text-secondary text-sm line-clamp-1 mb-2">
                            {product.description.substring(0, 100)}
                            {product.description.length > 100 ? '...' : ''}
                        </p>

                        {/* 태그 - 캡슐형 */}
                        {product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {product.tags.slice(0, 4).map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-2.5 py-0.5 text-xs rounded-full bg-dark-bg/50 text-dark-text-secondary border border-dark-border"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 통계 \u0026 액션 - 우측 */}
                    <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex items-center gap-3 text-xs text-light-text-secondary">
                            <div className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                <span>{formatNumber(product.viewCount)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MousePointerClick className="w-3.5 h-3.5" />
                                <span>{formatNumber(product.clickCount)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-primary text-sm font-medium">
                            <Zap className="w-4 h-4" />
                            <span>View</span>
                        </div>
                    </div>

                    {/* 삭제 버튼 (관리자만) - 우측 상단 */}
                    {isAdmin && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-danger/80 hover:bg-danger backdrop-blur-sm transition-all disabled:opacity-50 z-10"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                    )}
                </div>
            </div>

            {/* 퀵 프리뷰 모달 */}
            <QuickPreviewModal
                product={product}
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                onNavigate={handleNavigate}
            />
        </>
    )
}

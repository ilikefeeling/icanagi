'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ExternalLink, DollarSign, Code, Video } from 'lucide-react'
import type { Product, ProductTag, User } from '@prisma/client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface QuickPreviewModalProps {
    product: Product & {
        tags: ProductTag[]
        createdBy: Pick<User, 'name' | 'email'>
    }
    isOpen: boolean
    onClose: () => void
    onNavigate: () => void
}

const pricingLabels = {
    FREE: '무료',
    FREEMIUM: '프리미엄',
    PAID: '유료',
    ENTERPRISE: '기업용',
}

const pricingColors = {
    FREE: 'bg-green-500/20 text-green-400 border-green-500/30',
    FREEMIUM: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    PAID: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    ENTERPRISE: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
}

export function QuickPreviewModal({ product, isOpen, onClose, onNavigate }: QuickPreviewModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* 상단 이미지 */}
                <div className="relative h-64 bg-slate-800">
                    {product.thumbnailUrl ? (
                        <Image
                            src={product.thumbnailUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-6xl opacity-20">🤖</div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>

                {/* 컨텐츠 */}
                <div className="p-8">
                    {/* 제목 & 가격 */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
                            {product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="px-2 py-1 text-xs rounded-md bg-slate-800 text-slate-400 border border-slate-700"
                                        >
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold ${pricingColors[product.pricingTier as keyof typeof pricingColors]
                                }`}
                        >
                            <DollarSign className="w-4 h-4" />
                            <span>{pricingLabels[product.pricingTier as keyof typeof pricingLabels]}</span>
                            {product.price && product.pricingTier !== 'FREE' && (
                                <span className="ml-1">${product.price.toString()}</span>
                            )}
                        </div>
                    </div>

                    {/* 간단한 설명 */}
                    <div className="prose prose-invert prose-sm max-w-none mb-6">
                        <p className="text-gray-300 leading-relaxed">
                            {product.description.substring(0, 300)}
                            {product.description.length > 300 ? '...' : ''}
                        </p>
                    </div>

                    {/* 기술 스택 */}
                    {product.techStack && product.techStack.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-3">
                                <Code className="w-4 h-4" />
                                <span>기술 스택</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.techStack.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 rounded-full bg-electric-500/20 text-electric-400 text-sm border border-electric-500/30"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 데모/비디오 링크 */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        {product.demoUrl && (
                            <a
                                href={product.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>데모 보기</span>
                            </a>
                        )}
                        {product.videoUrl && (
                            <a
                                href={product.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
                            >
                                <Video className="w-4 h-4" />
                                <span>영상 보기</span>
                            </a>
                        )}
                    </div>

                    {/* CTA 버튼 */}
                    <div className="flex gap-3">
                        <button
                            onClick={onNavigate}
                            className="flex-1 px-6 py-3 rounded-lg bg-electric-500 hover:bg-electric-600 text-white font-semibold shadow-lg shadow-electric-500/50 transition-all"
                        >
                            상세 정보 보기
                        </button>
                        <a
                            href={product.serviceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-center transition-all"
                        >
                            바로 시작하기
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

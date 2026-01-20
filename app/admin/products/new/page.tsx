'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '@/components/ImageUpload'
import dynamic from 'next/dynamic'
import { ArrowLeft, Save, DollarSign, ExternalLink, Code } from 'lucide-react'
import Link from 'next/link'
import { createProduct } from '@/lib/actions/product.actions'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const formSchema = z.object({
    name: z.string().min(2, '상품명은 최소 2자 이상이어야 합니다'),
    category: z.enum(['APP', 'SAAS', 'AI_AGENT', 'TOOL']),
    serviceUrl: z.string().url('올바른 URL을 입력해주세요'),
    description: z.string().min(10, '설명은 최소 10자 이상이어야 합니다'),

    // 미디어
    thumbnailUrl: z.string().optional(),
    demoUrl: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
    videoUrl: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),

    // 가격
    pricingTier: z.enum(['FREE', 'FREEMIUM', 'PAID', 'ENTERPRISE']),
    price: z.string().optional(),

    // 기술
    techStack: z.string().optional(),
    apiEndpoint: z.string().optional(),

    // SEO & 기타
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    tags: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']),
})

type FormData = z.infer<typeof formSchema>

export default function NewProductPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [description, setDescription] = useState('')

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: 'DRAFT',
            pricingTier: 'FREE',
        },
    })

    const thumbnailUrl = watch('thumbnailUrl')
    const pricingTier = watch('pricingTier')

    const onSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true)

            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, value.toString())
                }
            })

            const result = await createProduct(formData)

            if (result.success) {
                alert('상품이 성공적으로 등록되었습니다!')
                router.push('/admin/products')
            } else {
                alert(result.error || '상품 등록에 실패했습니다')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('오류가 발생했습니다')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-navy-950 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>뒤로 가기</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">새 상품 등록</h1>
                    <p className="text-gray-400">AI 서비스 정보를 입력해주세요</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* 기본 정보 */}
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-4">기본 정보</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                상품명 <span className="text-red-400">*</span>
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white placeholder-gray-500 transition-all"
                                placeholder="예: AI 챗봇 서비스"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    카테고리 <span className="text-red-400">*</span>
                                </label>
                                <select
                                    {...register('category')}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white transition-all"
                                >
                                    <option value="APP">앱 (APP)</option>
                                    <option value="SAAS">SaaS</option>
                                    <option value="AI_AGENT">AI 에이전트</option>
                                    <option value="TOOL">도구/유틸리티</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    서비스 URL <span className="text-red-400">*</span>
                                </label>
                                <input
                                    {...register('serviceUrl')}
                                    type="url"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white placeholder-gray-500 transition-all"
                                    placeholder="https://example.com"
                                />
                                {errors.serviceUrl && (
                                    <p className="mt-1 text-sm text-red-400">{errors.serviceUrl.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 가격 정책 */}
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-5 h-5 text-electric-400" />
                            <h2 className="text-xl font-bold text-white">가격 정책</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            {['FREE', 'FREEMIUM', 'PAID', 'ENTERPRISE'].map((tier) => (
                                <label key={tier} className="relative cursor-pointer">
                                    <input
                                        {...register('pricingTier')}
                                        type="radio"
                                        value={tier}
                                        className="peer sr-only"
                                    />
                                    <div className="px-4 py-3 rounded-lg border-2 border-slate-700 peer-checked:border-electric-500 peer-checked:bg-electric-500/10 transition-all text-center">
                                        <div className="font-semibold text-white text-sm">
                                            {tier === 'FREE' && '🆓 무료'}
                                            {tier === 'FREEMIUM' && '💎 프리미엄'}
                                            {tier === 'PAID' && '💰 유료'}
                                            {tier === 'ENTERPRISE' && '🏢 기업용'}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {(pricingTier === 'PAID' || pricingTier === 'FREEMIUM') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    가격 (USD)
                                </label>
                                <input
                                    {...register('price')}
                                    type="number"
                                    step="0.01"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white placeholder-gray-500 transition-all"
                                    placeholder="예: 29.99"
                                />
                            </div>
                        )}
                    </div>

                    {/* 미디어 & 링크 */}
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <ExternalLink className="w-5 h-5 text-electric-400" />
                            <h2 className="text-xl font-bold text-white">미디어 & 데모</h2>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                썸네일 이미지
                            </label>
                            <ImageUpload
                                value={thumbnailUrl}
                                onChange={(url) => setValue('thumbnailUrl', url)}
                                onRemove={() => setValue('thumbnailUrl', undefined)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    데모 페이지 URL
                                </label>
                                <input
                                    {...register('demoUrl')}
                                    type="url"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white placeholder-gray-500 transition-all"
                                    placeholder="https://demo.example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    데모 영상 URL
                                </label>
                                <input
                                    {...register('videoUrl')}
                                    type="url"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white placeholder-gray-500 transition-all"
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* 기술 명세 */}
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <Code className="w-5 h-5 text-electric-400" />
                            <h2 className="text-xl font-bold text-white">기술 명세</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    기술 스택 (쉼표로 구분)
                                </label>
                                <input
                                    {...register('techStack')}
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white placeholder-gray-500 transition-all"
                                    placeholder="GPT-4, Next.js, PostgreSQL"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    사용된 주요 기술, AI 모델, 프레임워크 등
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    API 엔드포인트
                                </label>
                                <input
                                    {...register('apiEndpoint')}
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white placeholder-gray-500 transition-all"
                                    placeholder="https://api.example.com/v1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 상세 설명 */}
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-4">
                            상세 설명 <span className="text-red-400">*</span>
                        </h2>
                        <div data-color-mode="dark">
                            <MDEditor
                                value={description}
                                onChange={(val) => {
                                    setDescription(val || '')
                                    setValue('description', val || '')
                                }}
                                preview="edit"
                                height={400}
                                className="!bg-slate-800 !border-slate-700"
                            />
                        </div>
                        {errors.description && (
                            <p className="mt-2 text-sm text-red-400">{errors.description.message}</p>
                        )}
                    </div>

                    {/* SEO 정보 */}
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-4">SEO 메타데이터 (선택)</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    메타 제목
                                </label>
                                <input
                                    {...register('metaTitle')}
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white placeholder-gray-500 transition-all"
                                    placeholder="검색 결과에 표시될 제목"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    메타 설명
                                </label>
                                <textarea
                                    {...register('metaDescription')}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white placeholder-gray-500 transition-all resize-none"
                                    placeholder="검색 결과에 표시될 설명 (최대 160자 권장)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    태그 (쉼표로 구분)
                                </label>
                                <input
                                    {...register('tags')}
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white placeholder-gray-500 transition-all"
                                    placeholder="AI, 챗봇, 자동화"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 게시 상태 */}
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-4">게시 상태</h2>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    {...register('status')}
                                    type="radio"
                                    value="DRAFT"
                                    className="w-5 h-5 text-electric-500"
                                />
                                <div>
                                    <div className="font-medium text-white">임시저장</div>
                                    <div className="text-sm text-gray-400">나중에 공개할 수 있습니다</div>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    {...register('status')}
                                    type="radio"
                                    value="PUBLISHED"
                                    className="w-5 h-5 text-electric-500"
                                />
                                <div>
                                    <div className="font-medium text-white">바로 공개</div>
                                    <div className="text-sm text-gray-400">메인 페이지에 즉시 표시됩니다</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition-all"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-electric-500 hover:bg-electric-600 text-white font-semibold shadow-lg shadow-electric-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>등록 중...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>상품 등록</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

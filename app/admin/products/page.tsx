import { getProducts } from '@/lib/actions/product.actions'
import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { ProductStatus } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function AdminProductsPage() {
    try {
        // 관리자 권한 확인
        await requireAdmin()
    } catch {
        redirect('/')
    }

    // 모든 상품 조회 (DRAFT 포함)
    const [publishedResult, draftResult] = await Promise.all([
        getProducts({ status: ProductStatus.PUBLISHED, limit: 50 }),
        getProducts({ status: ProductStatus.DRAFT, limit: 50 }),
    ])

    const publishedProducts = publishedResult.success ? publishedResult.products : []
    const draftProducts = draftResult.success ? draftResult.products : []

    return (
        <div className="min-h-screen bg-navy-950 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">상품 관리</h1>
                        <p className="text-gray-400">등록된 모든 상품을 관리할 수 있습니다</p>
                    </div>

                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-electric-500 hover:bg-electric-600 text-white font-semibold shadow-lg shadow-electric-500/50 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span>새 상품 등록</span>
                    </Link>
                </div>

                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-electric-500/10 to-blue-500/10 rounded-xl p-6 border border-electric-500/20">
                        <div className="text-sm text-electric-400 font-semibold mb-2">공개된 상품</div>
                        <div className="text-3xl font-bold text-white">{publishedProducts.length}</div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
                        <div className="text-sm text-yellow-400 font-semibold mb-2">임시저장</div>
                        <div className="text-3xl font-bold text-white">{draftProducts.length}</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                        <div className="text-sm text-purple-400 font-semibold mb-2">전체</div>
                        <div className="text-3xl font-bold text-white">
                            {publishedProducts.length + draftProducts.length}
                        </div>
                    </div>
                </div>

                {/* 임시저장 상품 */}
                {draftProducts.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6">임시저장 상품</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {draftProducts.map((product) => (
                                <ProductCard key={product.id} product={product} isAdmin={true} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 공개된 상품 */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">공개된 상품</h2>
                    {publishedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {publishedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} isAdmin={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-slate-900/30 rounded-xl border border-slate-800">
                            <div className="text-6xl mb-6 opacity-20">📦</div>
                            <h3 className="text-2xl font-bold text-gray-400 mb-2">
                                공개된 상품이 없습니다
                            </h3>
                            <p className="text-gray-500 mb-8">첫 번째 상품을 등록해보세요</p>
                            <Link
                                href="/admin/products/new"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-electric-500 hover:bg-electric-600 text-white font-semibold transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                <span>상품 등록하기</span>
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

import { getProducts } from '@/lib/actions/product.actions'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters } from '@/components/ProductFilters'
import { CategorySidebar } from '@/components/CategorySidebar'
import { getCurrentUser } from '@/lib/auth'
import { Sparkles } from 'lucide-react'
import { ProductCategory, ProductStatus } from '@prisma/client'

interface HomePageProps {
    searchParams: {
        category?: string
        search?: string
        sort?: 'latest' | 'popular' | 'views'
    }
}

export default async function HomePage({ searchParams }: HomePageProps) {
    const category = searchParams.category as ProductCategory | undefined
    const search = searchParams.search
    const sortBy = searchParams.sort || 'latest'

    const [productsResult, user] = await Promise.all([
        getProducts({
            category,
            search,
            sortBy,
            status: ProductStatus.PUBLISHED,
            limit: 12
        }),
        getCurrentUser(),
    ])

    const isAdmin = user?.role === 'ADMIN'

    return (
        <div className="min-h-screen bg-light-bg">
            {/* Hero Section - 파란색 */}
            <section className="relative overflow-hidden bg-hero-blue">
                <div className="absolute inset-0 bg-gradient-to-br from-hero-blue via-hero-blue to-hero-blue-dark opacity-90" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 lg:py-48">
                    <div className="text-center">
                        {/* 상단 배지 - Join 350,000+ */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
                            <Sparkles className="w-4 h-4 text-white" />
                            <span className="text-sm font-semibold text-white">Join 350,000+ AI Adopters</span>
                        </div>

                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight">
                            Everything your business needs to master AI, all in one place.
                        </h1>

                        <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
                            Explore top AI tools and learn how to use them effectively.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="#products"
                                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-white hover:bg-gray-50 text-hero-blue font-semibold shadow-lg transition-all"
                            >
                                Join For Free
                            </a>

                            <a
                                href="#products"
                                className="w-full sm:w-auto px-8 py-4 rounded-lg border-2 border-white/30 hover:border-white/50 text-white font-semibold backdrop-blur-sm transition-all"
                            >
                                Explore AI Courses
                            </a>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-light-bg to-transparent" />
            </section>

            {/* Products Section - 2열 레이아웃 */}
            <section id="products" className="py-16 sm:py-24">
                <div className="flex max-w-7xl mx-auto">
                    {/* 좌측 카테고리 사이드바 */}
                    <CategorySidebar currentCategory={category} />

                    {/* 메인 컨텐츠 영역 */}
                    <main className="flex-1 px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                {search ? '검색 결과' : category ? `${category.replace('_', ' ')} 상품` : '전체 상품'}
                            </h2>
                            <p className="text-gray-500 text-lg">
                                {productsResult.success && productsResult.pagination ?
                                    `총 ${productsResult.pagination.total}개의 상품` :
                                    '상품을 찾고 있습니다...'
                                }
                            </p>
                        </div>

                        {/* 검색바 */}
                        <div className="mb-8">
                            <ProductFilters />
                        </div>

                        {/* 상품 그리드 */}
                        {productsResult.success && productsResult.products.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {productsResult.products.map((product) => (
                                    <ProductCard key={product.id} product={product} isAdmin={isAdmin} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24">
                                <div className="text-6xl mb-6 opacity-20">🔍</div>
                                <h3 className="text-2xl font-bold text-gray-400 mb-2">
                                    {search || category ? '검색 결과가 없습니다' : '등록된 상품이 없습니다'}
                                </h3>
                                <p className="text-gray-500 mb-8">
                                    {search || category ?
                                        '다른 검색어나 카테고리를 시도해보세요' :
                                        isAdmin ? '첫 번째 상품을 등록해보세요!' : '곧 멋진 AI 서비스가 공개될 예정입니다'
                                    }
                                </p>
                                {isAdmin && !search && !category && (
                                    <a
                                        href="/admin/products/new"
                                        className="inline-block px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold transition-all"
                                    >
                                        상품 등록하기
                                    </a>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-light-border mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center text-gray-500 text-sm">
                        <p>© 2026 icanagi. All rights reserved.</p>
                        <p className="mt-2">AI 서비스 마켓플레이스</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { ProductCategory } from '@prisma/client'

const categories = [
    { value: '', label: '전체' },
    { value: 'APP', label: '앱' },
    { value: 'SAAS', label: 'SaaS' },
    { value: 'AI_AGENT', label: 'AI 에이전트' },
    { value: 'TOOL', label: '도구' },
]

const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'views', label: '조회순' },
]

export function ProductFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
    const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'latest')

    const updateFilters = (newParams: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        })

        router.push(`/?${params.toString()}`)
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        updateFilters({ category, sort: selectedSort, search: searchTerm })
    }

    const handleSortChange = (sort: string) => {
        setSelectedSort(sort)
        updateFilters({ category: selectedCategory, sort, search: searchTerm })
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        updateFilters({ category: selectedCategory, sort: selectedSort, search: searchTerm })
    }

    const clearSearch = () => {
        setSearchTerm('')
        updateFilters({ category: selectedCategory, sort: selectedSort, search: '' })
    }

    const hasActiveFilters = selectedCategory || searchTerm

    const clearAllFilters = () => {
        setSearchTerm('')
        setSelectedCategory('')
        setSelectedSort('latest')
        router.push('/')
    }

    return (
        <div className="space-y-6">
            {/* 검색 바 */}
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="상품 검색..."
                    className="w-full pl-12 pr-12 py-3 rounded-lg bg-slate-900/50 border border-slate-800 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-white placeholder-gray-500 transition-all"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                )}
            </form>

            {/* 필터 & 정렬 */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* 카테고리 탭 */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => handleCategoryChange(category.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category.value
                                    ? 'bg-electric-500 text-white shadow-lg shadow-electric-500/50'
                                    : 'bg-slate-900/50 text-gray-400 hover:text-white border border-slate-800 hover:border-slate-700'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* 정렬 */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">정렬:</span>
                    <select
                        value={selectedSort}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-800 text-white text-sm focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 transition-all"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 활성 필터 표시 & 초기화 */}
            {hasActiveFilters && (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">활성 필터:</span>
                    {selectedCategory && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/20 text-electric-400 text-sm border border-electric-500/30">
                            {categories.find((c) => c.value === selectedCategory)?.label}
                            <button
                                onClick={() => handleCategoryChange('')}
                                className="hover:bg-electric-500/30 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {searchTerm && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/20 text-electric-400 text-sm border border-electric-500/30">
                            검색: "{searchTerm}"
                            <button
                                onClick={clearSearch}
                                className="hover:bg-electric-500/30 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-gray-500 hover:text-white transition-colors underline"
                    >
                        모두 지우기
                    </button>
                </div>
            )}
        </div>
    )
}

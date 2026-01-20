'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'
import { generateSlug, extractCloudinaryPublicId } from '@/lib/utils'
import { deleteCloudinaryImage, isCloudinaryUrl } from '@/lib/cloudinary'
import { ProductCategory, ProductStatus, PricingTier, Prisma } from '@prisma/client'

// ============================================
// Validation Schemas
// ============================================

const productSchema = z.object({
    name: z.string().min(2, '상품명은 최소 2자 이상이어야 합니다'),
    description: z.string().min(10, '설명은 최소 10자 이상이어야 합니다'),
    category: z.nativeEnum(ProductCategory),
    serviceUrl: z.string().url('올바른 URL을 입력해주세요'),

    // 미디어
    thumbnailUrl: z.string().optional(),
    demoUrl: z.string().url().optional().or(z.literal('')),
    videoUrl: z.string().url().optional().or(z.literal('')),

    // 가격
    pricingTier: z.nativeEnum(PricingTier).default(PricingTier.FREE),
    price: z.string().optional(),

    // 기술
    techStack: z.array(z.string()).optional(),
    apiEndpoint: z.string().optional(),

    // SEO & 기타
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
    tags: z.array(z.string()).optional(),
})

// ============================================
// Create Product
// ============================================

export async function createProduct(formData: FormData) {
    try {
        // 1. 관리자 권한 확인
        const user = await requireAdmin()

        // 2. FormData에서 데이터 추출
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as ProductCategory,
            serviceUrl: formData.get('serviceUrl') as string,

            // 미디어
            thumbnailUrl: formData.get('thumbnailUrl') as string | undefined,
            demoUrl: formData.get('demoUrl') as string | undefined,
            videoUrl: formData.get('videoUrl') as string | undefined,

            // 가격
            pricingTier: (formData.get('pricingTier') as PricingTier) || PricingTier.FREE,
            price: formData.get('price') as string | undefined,

            // 기술
            techStack: formData.get('techStack') ? (formData.get('techStack') as string).split(',').map(t => t.trim()) : [],
            apiEndpoint: formData.get('apiEndpoint') as string | undefined,

            // SEO & 기타
            metaTitle: formData.get('metaTitle') as string | undefined,
            metaDescription: formData.get('metaDescription') as string | undefined,
            status: (formData.get('status') as ProductStatus) || ProductStatus.DRAFT,
            tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : [],
        }

        // 3. 입력 검증
        const validatedData = productSchema.parse(data)

        // 4. Slug 생성 (중복 체크)
        let slug = generateSlug(validatedData.name)
        let slugExists = await prisma.product.findUnique({ where: { slug } })

        // Slug 중복 시 숫자 추가
        let counter = 1
        while (slugExists) {
            slug = `${generateSlug(validatedData.name)}-${counter}`
            slugExists = await prisma.product.findUnique({ where: { slug } })
            counter++
        }

        // 5. 태그 처리 (기존 태그 찾기 또는 생성)
        const tagConnections = validatedData.tags && validatedData.tags.length > 0
            ? await Promise.all(
                validatedData.tags.map(async (tagName) => {
                    const tagSlug = generateSlug(tagName)
                    let tag = await prisma.productTag.findUnique({ where: { slug: tagSlug } })

                    if (!tag) {
                        tag = await prisma.productTag.create({
                            data: { name: tagName, slug: tagSlug },
                        })
                    }

                    return { id: tag.id }
                })
            )
            : []

        // 6. DB에 상품 저장
        const product = await prisma.product.create({
            data: {
                name: validatedData.name,
                description: validatedData.description,
                category: validatedData.category,
                serviceUrl: validatedData.serviceUrl,

                // 미디어
                thumbnailUrl: validatedData.thumbnailUrl || null,
                demoUrl: validatedData.demoUrl || null,
                videoUrl: validatedData.videoUrl || null,

                // 가격
                pricingTier: validatedData.pricingTier,
                price: validatedData.price ? parseFloat(validatedData.price) : null,

                // 기술
                techStack: validatedData.techStack || [],
                apiEndpoint: validatedData.apiEndpoint || null,

                // SEO & 기타
                metaTitle: validatedData.metaTitle || null,
                metaDescription: validatedData.metaDescription || null,
                slug,
                status: validatedData.status,
                createdById: user.id,
                tags: tagConnections.length > 0 ? {
                    connect: tagConnections,
                } : undefined,
            },
            include: {
                tags: true,
                createdBy: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        })

        // 7. 페이지 갱신
        revalidatePath('/admin/products')
        revalidatePath('/')
        revalidatePath(`/products/${slug}`)

        return { success: true, product }
    } catch (error) {
        console.error('상품 생성 실패:', error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : '상품 생성에 실패했습니다',
        }
    }
}

// ============================================
// Get Products (with filters)
// ============================================

interface GetProductsOptions {
    category?: ProductCategory
    status?: ProductStatus
    search?: string
    page?: number
    limit?: number
    sortBy?: 'latest' | 'popular' | 'views'
}

export async function getProducts(options: GetProductsOptions = {}) {
    try {
        const {
            category,
            status = ProductStatus.PUBLISHED,
            search,
            page = 1,
            limit = 12,
            sortBy = 'latest',
        } = options

        // Where 조건 구성
        const where: Prisma.ProductWhereInput = {
            status,
            ...(category && { category }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
        }

        // 정렬 조건
        const orderBy: Prisma.ProductOrderByWithRelationInput =
            sortBy === 'popular' ? { clickCount: 'desc' } :
                sortBy === 'views' ? { viewCount: 'desc' } :
                    { createdAt: 'desc' }

        // 데이터 조회
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    tags: true,
                    createdBy: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.product.count({ where }),
        ])

        return {
            success: true,
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }
    } catch (error) {
        console.error('상품 조회 실패:', error)
        return {
            success: false,
            error: '상품 조회에 실패했습니다',
            products: [],
            pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
        }
    }
}

// ============================================
// Get Product by Slug
// ============================================

export async function getProductBySlug(slug: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                tags: true,
                createdBy: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        })

        if (!product) {
            return { success: false, error: '상품을 찾을 수 없습니다' }
        }

        // 조회수 증가 (비동기, 결과를 기다리지 않음)
        incrementViewCount(product.id).catch(console.error)

        // 같은 카테고리 관련 상품 추천 (최대 4개)
        const relatedProducts = await prisma.product.findMany({
            where: {
                category: product.category,
                status: ProductStatus.PUBLISHED,
                id: { not: product.id },
            },
            take: 4,
            orderBy: { viewCount: 'desc' },
            select: {
                id: true,
                name: true,
                slug: true,
                thumbnailUrl: true,
                category: true,
            },
        })

        return { success: true, product, relatedProducts }
    } catch (error) {
        console.error('상품 조회 실패:', error)
        return { success: false, error: '상품 조회에 실패했습니다' }
    }
}

// ============================================
// Update Product
// ============================================

export async function updateProduct(id: string, formData: FormData) {
    try {
        // 1. 관리자 권한 확인
        await requireAdmin()

        // 2. 기존 상품 조회
        const existingProduct = await prisma.product.findUnique({
            where: { id },
            include: { tags: true },
        })

        if (!existingProduct) {
            return { success: false, error: '상품을 찾을 수 없습니다' }
        }

        // 3. FormData에서 데이터 추출
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as ProductCategory,
            serviceUrl: formData.get('serviceUrl') as string,

            // 미디어
            thumbnailUrl: formData.get('thumbnailUrl') as string | undefined,
            demoUrl: formData.get('demoUrl') as string | undefined,
            videoUrl: formData.get('videoUrl') as string | undefined,

            // 가격
            pricingTier: (formData.get('pricingTier') as PricingTier) || PricingTier.FREE,
            price: formData.get('price') as string | undefined,

            // 기술
            techStack: formData.get('techStack') ? (formData.get('techStack') as string).split(',').map(t => t.trim()) : [],
            apiEndpoint: formData.get('apiEndpoint') as string | undefined,

            // SEO & 기타
            metaTitle: formData.get('metaTitle') as string | undefined,
            metaDescription: formData.get('metaDescription') as string | undefined,
            status: (formData.get('status') as ProductStatus) || ProductStatus.DRAFT,
            tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : [],
        }

        // 4. 입력 검증
        const validatedData = productSchema.parse(data)

        // 5. 태그 처리
        const tagConnections = validatedData.tags && validatedData.tags.length > 0
            ? await Promise.all(
                validatedData.tags.map(async (tagName) => {
                    const tagSlug = generateSlug(tagName)
                    let tag = await prisma.productTag.findUnique({ where: { slug: tagSlug } })

                    if (!tag) {
                        tag = await prisma.productTag.create({
                            data: { name: tagName, slug: tagSlug },
                        })
                    }

                    return { id: tag.id }
                })
            )
            : []

        // 6. 상품 업데이트
        const product = await prisma.product.update({
            where: { id },
            data: {
                name: validatedData.name,
                description: validatedData.description,
                category: validatedData.category,
                serviceUrl: validatedData.serviceUrl,

                // 미디어
                thumbnailUrl: validatedData.thumbnailUrl || null,
                demoUrl: validatedData.demoUrl || null,
                videoUrl: validatedData.videoUrl || null,

                // 가격
                pricingTier: validatedData.pricingTier,
                price: validatedData.price ? parseFloat(validatedData.price) : null,

                // 기술
                techStack: validatedData.techStack || [],
                apiEndpoint: validatedData.apiEndpoint || null,

                // SEO & 기타
                metaTitle: validatedData.metaTitle || null,
                metaDescription: validatedData.metaDescription || null,
                status: validatedData.status,
                tags: {
                    set: tagConnections,
                },
            },
            include: {
                tags: true,
            },
        })

        // 7. 페이지 갱신
        revalidatePath('/admin/products')
        revalidatePath('/')
        revalidatePath(`/products/${existingProduct.slug}`)

        return { success: true, product }
    } catch (error) {
        console.error('상품 수정 실패:', error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : '상품 수정에 실패했습니다',
        }
    }
}

// ============================================
// Delete Product
// ============================================

export async function deleteProduct(id: string) {
    try {
        // 1. 관리자 권한 확인
        await requireAdmin()

        // 2. 상품 조회
        const product = await prisma.product.findUnique({
            where: { id },
            select: {
                slug: true,
                thumbnailUrl: true,
            },
        })

        if (!product) {
            return { success: false, error: '상품을 찾을 수 없습니다' }
        }

        // 3. Cloudinary 이미지 삭제 (있을 경우)
        if (product.thumbnailUrl && isCloudinaryUrl(product.thumbnailUrl)) {
            const publicId = extractCloudinaryPublicId(product.thumbnailUrl)
            if (publicId) {
                await deleteCloudinaryImage(publicId)
            }
        }

        // 4. DB에서 상품 삭제 (cascade로 관련 데이터도 삭제됨)
        await prisma.product.delete({
            where: { id },
        })

        // 5. 페이지 갱신
        revalidatePath('/admin/products')
        revalidatePath('/')

        return { success: true }
    } catch (error) {
        console.error('상품 삭제 실패:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : '상품 삭제에 실패했습니다',
        }
    }
}

// ============================================
// Increment View Count
// ============================================

export async function incrementViewCount(id: string) {
    try {
        await prisma.product.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        })
        return { success: true }
    } catch (error) {
        console.error('조회수 증가 실패:', error)
        return { success: false }
    }
}

// ============================================
// Increment Click Count
// ============================================

export async function incrementClickCount(id: string) {
    try {
        await prisma.product.update({
            where: { id },
            data: {
                clickCount: {
                    increment: 1,
                },
            },
        })

        revalidatePath(`/products`)

        return { success: true }
    } catch (error) {
        console.error('클릭수 증가 실패:', error)
        return { success: false }
    }
}

// ============================================
// Get All Tags
// ============================================

export async function getAllTags() {
    try {
        const tags = await prisma.productTag.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        })

        return { success: true, tags }
    } catch (error) {
        console.error('태그 조회 실패:', error)
        return { success: false, tags: [] }
    }
}

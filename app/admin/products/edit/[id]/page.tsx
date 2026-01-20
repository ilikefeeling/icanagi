import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EditProductForm } from '@/components/EditProductForm'

interface EditProductPageProps {
    params: {
        id: string
    }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    try {
        await requireAdmin()
    } catch {
        redirect('/')
    }

    const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: {
            tags: true,
        },
    })

    if (!product) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-navy-950 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 헤더 */}
                <div className="mb-8">
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>뒤로 가기</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">상품 수정</h1>
                    <p className="text-gray-400">{product.name}</p>
                </div>

                {/* 폼 */}
                <EditProductForm product={product} />
            </div>
        </div>
    )
}

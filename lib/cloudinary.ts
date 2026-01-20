import { v2 as cloudinary } from 'cloudinary'

// Cloudinary 설정
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Cloudinary에서 이미지 삭제
 */
export async function deleteCloudinaryImage(publicId: string): Promise<boolean> {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return result.result === 'ok'
    } catch (error) {
        console.error('Cloudinary 이미지 삭제 실패:', error)
        return false
    }
}

/**
 * URL이 Cloudinary 도메인인지 확인
 */
export function isCloudinaryUrl(url: string): boolean {
    return url.includes('res.cloudinary.com')
}

export { cloudinary }

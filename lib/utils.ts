import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind 클래스명을 병합하는 유틸리티
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * 문자열을 URL 친화적인 slug로 변환
 */
export function generateSlug(text: string): string {
    const timestamp = Date.now().toString(36)

    // 한글을 영문으로 변환하는 간단한 로직 (실제로는 더 복잡한 변환 필요)
    const romanized = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // 특수문자 제거
        .replace(/\s+/g, '-') // 공백을 하이픈으로
        .replace(/-+/g, '-') // 연속 하이픈 제거
        .trim()

    // 빈 문자열이면 타임스탬프만 사용
    if (!romanized) {
        return `product-${timestamp}`
    }

    return `${romanized}-${timestamp}`
}

/**
 * Cloudinary URL에서 public_id 추출
 */
export function extractCloudinaryPublicId(url: string): string | null {
    try {
        const regex = /\/upload\/(?:v\d+\/)?([^/.]+)/
        const match = url.match(regex)
        return match ? match[1] : null
    } catch {
        return null
    }
}

/**
 * 숫자를 K, M 단위로 포맷
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
}

/**
 * 날짜를 상대적 시간으로 포맷
 */
export function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return '방금 전'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`
    return `${Math.floor(diffInSeconds / 31536000)}년 전`
}

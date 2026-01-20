'use client'

import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { useState } from 'react'

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)

    return (
        <div>
            {value ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-slate-700 group">
                    <Image
                        src={value}
                        alt="Upload"
                        fill
                        className="object-cover"
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-2 right-2 p-2 rounded-full bg-red-500/80 hover:bg-red-600 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>
            ) : (
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'icanagi_products'}
                    onSuccess={(result: any) => {
                        if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                            onChange(result.info.secure_url)
                            setIsUploading(false)
                        }
                    }}
                    onUpload={() => setIsUploading(true)}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            disabled={isUploading}
                            className="w-full h-64 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-slate-700 hover:border-electric-500 bg-slate-800/50 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-12 h-12 border-4 border-electric-500 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-gray-400 font-medium">업로드 중...</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-gray-500" />
                                    <div className="text-center">
                                        <p className="text-white font-medium mb-1">이미지 업로드</p>
                                        <p className="text-sm text-gray-500">클릭하여 파일 선택</p>
                                    </div>
                                </>
                            )}
                        </button>
                    )}
                </CldUploadWidget>
            )}
        </div>
    )
}

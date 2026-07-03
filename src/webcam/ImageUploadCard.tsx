/* eslint-disable @next/next/no-img-element */
"use client"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"
import { cn } from "../lib/cn"
import { AttachmentDto } from "../types"

export type ImageUploadCardProps = {
  attachment: AttachmentDto | null
  isUploading: boolean
  uploadProgress?: number
  onFileSelect: (file: File) => void
  onClear: () => void
  disabled?: boolean
  className?: string
}

export function ImageUploadCard({
  attachment,
  isUploading,
  uploadProgress = 0,
  onFileSelect,
  onClear,
  disabled = false,
  className = "",
}: ImageUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onFileSelect(file)
    e.target.value = ""
  }

  return (
    <>
      {/* Outer is a div with role=button so we can nest the Clear `<button>`
          inside without violating html-no-nested-interactive. */}
      {/* react-doctor-disable-next-line react-doctor/prefer-tag-over-role */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) fileInputRef.current?.click()
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        aria-disabled={disabled}
        className={cn(
          "relative group border border-dashed rounded-2xl bg-background/60 flex flex-col items-center justify-center text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "w-full h-48 xs:h-52 sm:w-56 sm:h-52 md:w-60",
          attachment && "border-none hover:border-none",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        {attachment ? (
          <>
            <Image
              src={attachment.link}
              alt={attachment.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 224px, 240px"
              className="object-cover rounded-2xl"
            />
            <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs transition">
              <Upload className="w-5 h-5 mb-1" /> Change Image
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
              disabled={disabled}
              className="absolute top-2 right-2 bg-background/70 rounded-full p-1 shadow hover:bg-background"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground px-4">
            <Upload className="w-8 h-8" />
            <span className="text-sm font-medium">Upload Image</span>
            <span className="text-[11px] leading-tight opacity-70">Click to choose a file</span>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 rounded-2xl bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-xs">
            <Loader2 className="w-5 h-5 animate-spin" />
            {uploadProgress}%
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        aria-label="Upload image"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </>
  )
}

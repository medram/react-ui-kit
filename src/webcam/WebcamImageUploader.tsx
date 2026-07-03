/* eslint-disable @next/next/no-img-element */
"use client"
import { Camera, Loader2 } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useCloudStorageOps } from "../cloud-storage/useCloudStorageOps"
import { cn } from "../lib/cn"
import { Button } from "../primitives/button"
import { AttachmentDto } from "../types"
import { ImageUploadCard } from "./ImageUploadCard"
import { WebcamCapture } from "./WebcamCapture"
import { cropToSquareDataUrl, dataURLtoFile } from "./utils/fileUpload"

export type WebcamImageUploaderProps = {
  onSave?: (attachment: AttachmentDto | null) => void
  initialAttachmentId?: string
  disabled?: boolean
  label?: string
  webcamType?: "landscape" | "portrait"
  className?: string
  webcamClassName?: string
  uploadClassName?: string
  contentClassName?: string
  saveButtonClassName?: string
}

export function WebcamImageUploader({
  onSave,
  initialAttachmentId,
  disabled = false,
  label = "Select a profile image",
  webcamType = "portrait",
  className = "",
  webcamClassName = "",
  uploadClassName = "",
  saveButtonClassName = "",
  contentClassName = "",
}: WebcamImageUploaderProps) {
  const [mode, setMode] = useState<"selection" | "webcam">("selection")
  const [clearedCount, setClearedCount] = useState(0)

  const { uploadFile, isUploading, uploadedFiles, attachmentPlaceholdersMetadata } =
    useCloudStorageOps({ attachmentIds: initialAttachmentId ? [initialAttachmentId] : [] })

  const activeUploads = uploadedFiles.slice(clearedCount)
  const finalAttachment = activeUploads[activeUploads.length - 1] ?? null

  const handleFileSelect = async (file: File) => {
    try {
      const attachment = await uploadFile({ file })
      if (attachment) {
        toast.success("Image uploaded")
      }
    } catch (e) {
      toast.error("Failed to upload selected image")
    }
  }

  const handleWebcamCapture = async (imageDataUrl: string) => {
    try {
      // Ensure final image is 626x626 (center crop)
      const croppedDataUrl = await cropToSquareDataUrl(imageDataUrl, 626, 626, 0.95)
      const file = dataURLtoFile(croppedDataUrl, `webcam-${Date.now()}.jpeg`)
      const attachment = await uploadFile({ file })
      if (attachment) {
        toast.success("Image captured and uploaded")
        setMode("selection")
      }
    } catch (e) {
      toast.error("Failed to process or upload captured image")
    }
  }

  // Clear selection
  const handleClear = () => {
    setClearedCount(uploadedFiles.length)
  }

  // Save and notify parent
  const handleSave = () => {
    if (!finalAttachment) {
      toast("Please upload or capture an image first")
      return
    }
    onSave?.(finalAttachment)
  }

  const busy = isUploading

  return (
    <div
      className={cn(
        "relative border rounded-md bg-muted/20 w-full flex flex-col gap-4 sm:gap-6",
        "max-w-full sm:max-w-3xl mx-auto",
        className,
        disabled && "opacity-60 pointer-events-none",
      )}
    >
      {label && <h3 className="text-center text-sm font-semibold tracking-wide">{label}</h3>}

      {/* Selection Screen */}
      <div>
        {mode === "selection" && (
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center",
              contentClassName,
            )}
          >
            <ImageUploadCard
              attachment={finalAttachment}
              isUploading={isUploading}
              uploadProgress={attachmentPlaceholdersMetadata[0]?.progress || 0}
              onFileSelect={handleFileSelect}
              onClear={handleClear}
              disabled={disabled}
              className={cn(
                "border rounded-2xl bg-background/60 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground hover:border-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
                uploadClassName,
              )}
            />

            <button
              type="button"
              onClick={() => setMode("webcam")}
              disabled={disabled}
              className={cn(
                "border border-dashed rounded-2xl bg-background/60 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground hover:border-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
                "w-full h-48 xs:h-52 sm:w-60 sm:h-52",
                mode === "selection" && finalAttachment?.link && "hidden",
                uploadClassName,
              )}
            >
              <Camera className="w-8 h-8" />
              <span className="text-sm font-medium">Access Web Cam</span>
              <span className="text-[11px] leading-tight opacity-70">Take a new picture</span>
            </button>
          </div>
        )}

        {/* Webcam Screen */}
        {mode === "webcam" && (
          <WebcamCapture
            onCapture={handleWebcamCapture}
            onBack={() => setMode("selection")}
            webcamType={webcamType}
            disabled={disabled}
            className={webcamClassName}
          />
        )}

        {/* Save Button (only on selection screen) */}
        {mode === "selection" && (
          <div className={cn("mt-2", saveButtonClassName)}>
            <Button
              type="button"
              onClick={handleSave}
              disabled={busy || !finalAttachment}
              className="w-full"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Select"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

import { useField } from "formik"
import { ImageUp, Loader, PencilLine } from "lucide-react"
import Image from "next/image"
import React from "react"
import { FileRejection } from "react-dropzone"
import toast from "react-hot-toast"
import { useCloudStorageOps } from "../cloud-storage/useCloudStorageOps"
import DropZone, { onUploadProps } from "../inputs/DropZone"
import { cn } from "../lib/cn"
import { Label } from "../primitives/label"
import { AttachmentDto, Prettify } from "../types"

const handleOnUploadError = (rejectedFiles: FileRejection[]) => {
  toast.error(rejectedFiles[0].errors[0].message)
}

type BasicImageUploaderFieldProps = {
  name: string
  className?: string
  dropZoneClassName?: string
  disabled?: boolean
  variant?: "rounded" | "flat"
  aspectRatio?: "16:9" | "1:1" | "9:16" | "21:9"
  label?: string
  required?: boolean
  parseValue?: (attachment: AttachmentDto) => string
  enableUploadIndicator?: boolean
  dropzoneOptions?: Prettify<
    Omit<React.ComponentProps<typeof DropZone>, "onUpload" | "onError" | "className">
  >
  imagePlaceholder?: string
  defaultPlaceholder?: string
}

export default function BasicImageUploaderField({
  name,
  className,
  dropZoneClassName,
  disabled,
  variant = "rounded",
  aspectRatio = "1:1",
  label,
  required,
  parseValue,
  enableUploadIndicator = false,
  dropzoneOptions,
  imagePlaceholder = "No Image",
  defaultPlaceholder,
}: BasicImageUploaderFieldProps) {
  const [showUploader, setShowUploader] = React.useState(false)
  const [field, _, helpers] = useField<string>(name)
  const { uploadFile, isUploading, attachmentPlaceholdersMetadata } = useCloudStorageOps()

  const handleMouseEnter = () => {
    setShowUploader(true)
  }

  const handleMouseLeave = () => {
    setShowUploader(false)
  }

  const handleOnUploadFinish = ({ files }: onUploadProps) => {
    // Enable Loading
    uploadFile({
      file: files[0],
    }).then((attachment) => {
      if (attachment) {
        const value = parseValue ? parseValue(attachment) : attachment.link
        helpers.setValue(value)
      }
    })
  }

  // Determine styles based on aspect ratio and variant
  const aspectRatioStyles = {
    "16:9": "w-[283px] h-[160px]",
    "21:9": "w-[373px] h-[160px]",
    "1:1": "w-[160px] h-[160px] ",
    "9:16": "h-[283px] w-[160px]",
  }[aspectRatio]

  const finalPlaceholder = React.useMemo(() => {
    if (defaultPlaceholder) return defaultPlaceholder

    switch (aspectRatio) {
      case "16:9":
        return `https://placehold.co/320x180?text=${imagePlaceholder}`
      case "21:9":
        return `https://placehold.co/420x180?text=${imagePlaceholder}`
      case "1:1":
        return `https://placehold.co/180x180?text=${imagePlaceholder}`
      case "9:16":
        return `https://placehold.co/180x320?text=${imagePlaceholder}`
      default:
        return `https://placehold.co/400x220?text=${imagePlaceholder}`
    }
  }, [aspectRatio, imagePlaceholder, defaultPlaceholder])
  return (
    <div className={cn(className)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div
        className={cn(
          "relative overflow-hidden",
          aspectRatioStyles,
          variant === "rounded" ? "rounded-full" : "rounded-lg",
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDragEnter={handleMouseEnter}
        style={{
          pointerEvents: disabled ? "none" : undefined,
        }}
      >
        <Image
          src={field.value || finalPlaceholder}
          alt="preview of the profile image"
          fill
          sizes={aspectRatio === "21:9" ? "373px" : aspectRatio === "16:9" ? "283px" : "160px"}
          className="object-cover"
        />
        {showUploader && !isUploading && (
          <DropZone
            className={cn(
              "bg-primary/10 backdrop-blur-sm absolute h-full w-full top-0 left-0 border-primary/50",
              variant === "rounded" ? "rounded-full" : "rounded-lg",
              dropZoneClassName,
              { ...dropzoneOptions },
            )}
            onUpload={handleOnUploadFinish}
            onError={handleOnUploadError}
          >
            <div className="flex text-primary/50 justify-center items-center h-full w-full flex-col">
              <ImageUp size={24} className="" />
              <span>upload new one</span>
            </div>
          </DropZone>
        )}
        {!showUploader && !isUploading && enableUploadIndicator && (
          <PencilLine
            className={`w-6 h-6 absolute bottom-2 ${variant === "rounded" ? "right-16" : "right-2"}`}
          />
        )}
        {isUploading && (
          <div
            className={cn(
              "bg-secondary/10 backdrop-blur-sm absolute h-full w-full top-0 left-0 flex justify-center items-center flex-col ",
              variant === "rounded" ? "rounded-full" : "rounded-none",
            )}
          >
            <Loader size={24} className="animate-spin" />
            <span className="transition-all">{attachmentPlaceholdersMetadata[0].progress}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

import imageCompression, { Options } from "browser-image-compression"
import { useCallback, useRef } from "react"
import { DropzoneOptions, FileRejection, useDropzone } from "react-dropzone"
import { cn } from "../lib/cn"
import { ALLOWED_ATTACHMENTS } from "./attachments"
const DEFAULT_MAX_SIZE = 1024 * 1024 // 1MB

export type onUploadProps = {
  files: File[]
}

export type DropZoneProps = {
  children?: React.ReactNode
  className?: string
  multiple?: boolean
  onUpload?: (props: onUploadProps) => void
  onError?: (rejectedFiles: FileRejection[]) => void
  dropzoneProps?: DropzoneOptions
  accept?: DropzoneOptions["accept"]
  maxSize?: number
  maxFiles?: number
  enableImageCompression?: boolean
  imageCompressionOptions?: Options
}

export default function DropZone({
  children,
  className = "",
  multiple = false,
  dropzoneProps,
  onUpload = () => {},
  onError = () => {},
  accept = ALLOWED_ATTACHMENTS.IMAGES,
  maxSize = DEFAULT_MAX_SIZE,
  maxFiles = 1,
  enableImageCompression = false,
  imageCompressionOptions,
}: DropZoneProps) {
  const onUploadRef = useRef(onUpload)
  onUploadRef.current = onUpload
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError

  // handle file upload
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle Upload
      if (acceptedFiles.length) {
        if (!enableImageCompression) {
          onUploadRef.current({ files: acceptedFiles })
        } else {
          // compress images then pass it to onUpload
          const compressImages = async () => {
            const compressedFiles = await Promise.all(
              acceptedFiles.map(async (file) => {
                try {
                  if (file.type.startsWith("image")) {
                    const compressedFile = await imageCompression(file, {
                      maxSizeMB: 0.5,
                      maxWidthOrHeight: 1920,
                      ...imageCompressionOptions,
                    })
                    return compressedFile
                  } else {
                    return file
                  }
                } catch (error) {
                  rejectedFiles.push({
                    file,
                    errors: [
                      {
                        message: `Failed to compress image: ${error}`,
                        code: "",
                      },
                    ],
                  })
                  return file
                }
              }),
            )
            onUploadRef.current({ files: compressedFiles })
          }
          compressImages()
        }
      }
      // Handle errors
      if (rejectedFiles.length) {
        onErrorRef.current(rejectedFiles)
      }
    },
    [enableImageCompression, imageCompressionOptions],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept, // Default is accepting images
    multiple,
    onDrop: onDrop,
    maxSize,
    maxFiles,
    ...dropzoneProps,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex justify-center items-center h-[100px] rounded-md  border-2 border-dashed cursor-pointer mb-2",
        isDragActive && "border-primary/50",
        className,
      )}
    >
      <input {...getInputProps()} />
      {children || <span>Drag and drop files, or click to select</span>}
    </div>
  )
}

import { Download, Paperclip, X } from "lucide-react"
import Link from "next/link"
import prettyBytes from "pretty-bytes"
import { useCallback, useEffect, useRef, useState } from "react"
import { FileRejection } from "react-dropzone"
import toast from "react-hot-toast"
import { useCloudStorageOps } from "../cloud-storage/useCloudStorageOps"
import { cn } from "../lib/cn"
import { AttachmentDto, Prettify } from "../types"
import DropZone, { DropZoneProps, onUploadProps } from "./DropZone"
import { ALLOWED_ATTACHMENTS } from "./attachments"

const DEFAULT_MAX_SIZE = 1024 * 1024 // 1MB

export type UploadInputProps = Prettify<
  {
    className?: string
    multiple?: boolean
    onUploadComplete?: (attachments: AttachmentDto[]) => void
    onError?: (rejectedFiles: FileRejection[], message: string) => void
    onDelete?: (attachment: AttachmentDto) => void
    maxFiles?: number
    minFiles?: number
    maxSize?: number
    dropzoneClassName?: string
    formatProgress?: (progress: number) => number
    defaultValue?: string[]
    value?: string[]
    disabled?: boolean
  } & Omit<DropZoneProps, "onUpload" | "onError">
>

const EMPTY_DEFAULT_VALUE: string[] = []

export default function UploadInput({
  className = "",
  multiple = false,
  onUploadComplete,
  onError,
  onDelete,
  maxFiles = 1,
  minFiles = 0,
  maxSize = DEFAULT_MAX_SIZE, // in bytes
  accept = ALLOWED_ATTACHMENTS.IMAGES,
  dropzoneClassName = "",
  formatProgress = (progress: number) => Math.round(progress),
  defaultValue = EMPTY_DEFAULT_VALUE,
  value,
  disabled,
  ...props
}: UploadInputProps) {
  const {
    uploadFile,
    isUploading,
    uploadedFiles,
    setUploadedFiles,
    attachmentPlaceholdersMetadata,
    deleteAttachment,
    handleError,
  } = useCloudStorageOps({
    attachmentIds: value || defaultValue,
  })

  // Use ref to track previous uploadedFiles to avoid infinite loops
  const prevUploadedFilesRef = useRef<AttachmentDto[]>([])
  const onUploadCompleteRef = useRef(onUploadComplete)

  // Update the ref with the latest onUploadComplete function
  useEffect(() => {
    onUploadCompleteRef.current = onUploadComplete
  }, [onUploadComplete])

  useEffect(() => {
    // Only call onUploadComplete when uploadedFiles actually changes
    const prevFiles = prevUploadedFilesRef.current
    const hasChanged =
      uploadedFiles.length !== prevFiles.length ||
      uploadedFiles.some((file, index) => file.id !== prevFiles[index]?.id)

    if (hasChanged && onUploadCompleteRef.current) {
      onUploadCompleteRef.current(uploadedFiles)
    }

    // Update the ref with current uploadedFiles
    prevUploadedFilesRef.current = uploadedFiles
  }, [uploadedFiles])

  const handleUpload = useCallback(
    async ({ files }: onUploadProps) => {
      if (disabled) return
      files.map((file: File) => {
        // Upload a single file
        uploadFile({ file }).catch((error) => {
          handleError(error)
        })
      })
    },
    [uploadFile, disabled, handleError],
  )

  const handleDropZoneError = useCallback(
    (rejectedFiles: FileRejection[]) => {
      if (disabled) return
      const parsedError = rejectedFiles.map((file: FileRejection) => {
        return file.file.name + "\n - " + file.errors.map((error) => error.message).join(", ")
      })
      if (onError) return onError(rejectedFiles, parsedError.join(", "))
      toast.error("Upload failed: " + parsedError.join(", "))
    },
    [onError, disabled],
  )

  const handleDelete = useCallback(
    async (attachment: AttachmentDto) => {
      if (disabled) return
      await deleteAttachment(attachment.id)
      onDelete?.(attachment)
    },
    [deleteAttachment, onDelete, disabled],
  )

  return (
    <div className={cn("mb-5", className, disabled && "opacity-50")}>
      {maxFiles > uploadedFiles.length + attachmentPlaceholdersMetadata.length && (
        <div className={disabled ? "pointer-events-none" : ""}>
          <DropZone
            onUpload={handleUpload}
            onError={handleDropZoneError}
            accept={accept}
            multiple={multiple}
            maxSize={maxSize}
            maxFiles={maxFiles - uploadedFiles.length}
            {...props}
            className={cn("bg-muted/50", dropzoneClassName)}
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        {uploadedFiles.map((attachment, i) => {
          return (
            <AttachmentContainer
              key={`${attachment.id}-${i}`}
              attachment={attachment}
              onDelete={handleDelete}
              readOnly={disabled}
            />
          )
        })}
        {isUploading &&
          attachmentPlaceholdersMetadata.map(({ index: placeholderId, progress }) => {
            return (
              <AttachmentPlaceholder
                key={`upload-${placeholderId}`}
                title="Uploading..."
                progress={progress}
              />
            )
          })}
      </div>
    </div>
  )
}

type AttachmentContainerProps = {
  attachment: AttachmentDto
  onDelete: (attachment: AttachmentDto) => void
  readOnly?: boolean
}

function AttachmentContainer({ attachment, onDelete, readOnly }: AttachmentContainerProps) {
  const [isDeleting, setDeleting] = useState(false)

  return (
    <div key={attachment.id} className="flex items-center gap-2 p-2 rounded bg-muted max-w-full">
      <div className="flex-1 flex gap-2 items-center">
        <Paperclip />{" "}
        <Link
          href={attachment.link}
          className="hover:underline !text-ellipsis"
          target="_blank"
          title={attachment.name}
        >
          {attachment.name}
        </Link>
        <span className="whitespace-nowrap font-bold">({prettyBytes(attachment.size)})</span>
      </div>
      {attachment.link && !isDeleting && (
        <Link href={attachment.link} download={attachment.name} target="_blank" className="block">
          <Download />
        </Link>
      )}
      {!readOnly && (
        <button
          type="button"
          onClick={() => {
            setDeleting(true)
            onDelete(attachment)
          }}
        >
          {!isDeleting ? <X className="" /> : "Deleting..."}
        </button>
      )}
    </div>
  )
}

type AttachmentPlaceholderProps = {
  title: string
  progress: number
}

function AttachmentPlaceholder({ title, progress = 0 }: AttachmentPlaceholderProps) {
  return (
    <div className={cn("flex items-center gap-2 relative p-2 rounded ")}>
      <Paperclip /> <span className="truncate max-w-xl">{title}</span> ({progress}%)
      {progress < 100 && (
        <div
          className={`block absolute left-0 bottom-0 h-[3px] rounded-lg transition-transform duration-300 transform z-0 bg-purple-300`}
          style={{ width: `${progress}%` }}
        ></div>
      )}
    </div>
  )
}

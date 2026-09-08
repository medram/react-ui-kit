import { Download, Loader2, Paperclip, X } from "lucide-react"
import prettyBytes from "pretty-bytes"
import { useCallback, useEffect, useRef, useState } from "react"
import { FileRejection } from "react-dropzone"
import toast from "react-hot-toast"
import { useCloudStorageOps } from "@medram/react-ui-kit/cloud-storage"
import { cn } from "@/lib/utils"
import type { AttachmentDto, Prettify } from "@medram/react-ui-kit/types"
import DropZone, { DropZoneProps, onUploadProps } from "@/components/ui/drop-zone"
import { ALLOWED_ATTACHMENTS } from "@/components/ui/attachment-inputs"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"

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
      <div className="flex flex-col gap-2">
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
                progress={formatProgress(progress)}
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
    <Attachment state={isDeleting ? "processing" : "done"} className="w-full">
      <AttachmentMedia>
        <Paperclip />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle title={attachment.name}>{attachment.name}</AttachmentTitle>
        <AttachmentDescription>
          {isDeleting ? "Removing attachment" : prettyBytes(attachment.size)}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        {attachment.link && !isDeleting && (
          <AttachmentAction asChild aria-label={`Download ${attachment.name}`}>
            <a
              href={attachment.link}
              download={attachment.name}
              target="_blank"
              rel="noreferrer"
            >
              <Download />
            </a>
          </AttachmentAction>
        )}
        {!readOnly && (
          <AttachmentAction
            type="button"
            aria-label={isDeleting ? `Removing ${attachment.name}` : `Remove ${attachment.name}`}
            disabled={isDeleting}
            onClick={() => {
              setDeleting(true)
              void onDelete(attachment)
            }}
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : <X />}
          </AttachmentAction>
        )}
      </AttachmentActions>
      {attachment.link && !isDeleting && (
        <AttachmentTrigger asChild>
          <a
            href={attachment.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${attachment.name}`}
          />
        </AttachmentTrigger>
      )}
    </Attachment>
  )
}

type AttachmentPlaceholderProps = {
  title: string
  progress: number
}

function AttachmentPlaceholder({ title, progress = 0 }: AttachmentPlaceholderProps) {
  return (
    <Attachment state="uploading" className="w-full">
      <AttachmentMedia>
        <Loader2 className="animate-spin" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{title}</AttachmentTitle>
        <AttachmentDescription>Uploading · {progress}%</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  )
}

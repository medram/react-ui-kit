import {
  Download,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  FolderArchive,
  Paperclip,
} from "lucide-react"
import Link from "next/link"
import prettyBytes from "pretty-bytes"
import { useCloudStorageOps } from "../cloud-storage/useCloudStorageOps"
import { cn } from "../lib/cn"

export type AttachmentsPreviewProps = {
  attachmentIds: string[]
  className?: string
}

export default function AttachmentsPreview({
  attachmentIds,
  className = "",
}: AttachmentsPreviewProps) {
  const { uploadedFiles } = useCloudStorageOps({ attachmentIds })

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {uploadedFiles.length > 0 ? (
        uploadedFiles.map((attachment) => (
          <AttachmentItem key={attachment.id} attachment={attachment} />
        ))
      ) : (
        <div className="text-gray-500">No attachments available.</div>
      )}
    </div>
  )
}

type AttachmentItemProps = {
  attachment: {
    id: string
    name: string
    size: number
    link: string
  }
}

function getIconByExtension(extension: string, className?: string) {
  const defaultClassName: string = "text-gray-500 h-4 text-lg!"
  switch (extension) {
    case "txt":
      return <FileText className={cn(defaultClassName, className)} />
    case "pdf":
    case "doc":
    case "docx":
    case "xls":
    case "xlsx":
    case "ppt":
    case "pptx":
      return <FileText className={cn(defaultClassName, className)} />
    case "zip":
    case "rar":
    case "7z":
      return <FolderArchive className={cn(defaultClassName, className)} />
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FileImage className={cn(defaultClassName, className)} />
    case "mp4":
    case "avi":
    case "mov":
      return <FileVideo className={cn(defaultClassName, className)} />
    case "mp3":
    case "wav":
      return <FileAudio className={cn(defaultClassName, className)} />
    default:
      return <Paperclip className={cn(defaultClassName, className)} />
  }
}

function AttachmentItem({ attachment }: AttachmentItemProps) {
  const extension = attachment.name.split(".").pop()?.toLowerCase() || ""

  return (
    <div className="flex items-center gap-3 p-2 rounded bg-muted">
      <div className="flex-1 flex items-center gap-2 text-sm">
        {getIconByExtension(extension)}
        <Link href={attachment.link} className="hover:underline" target="_blank">
          {attachment.name} ({prettyBytes(attachment.size)})
        </Link>
      </div>
      <Link href={attachment.link} download={attachment.name} target="_blank" className="block">
        <Download className="text-gray-500 hover:text-gray-800" />
      </Link>
    </div>
  )
}

import {
  Download,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  FolderArchive,
  Paperclip,
} from "lucide-react"
import prettyBytes from "pretty-bytes"
import { useCloudStorageOps } from "@medram/react-ui-kit/cloud-storage"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { cn } from "@/lib/utils"

export type AttachmentsPreviewProps = {
  attachmentIds: string[]
  className?: string
}

const IMAGE_EXTENSION_BY_NAME: Record<string, true> = {
  avif: true,
  gif: true,
  jpeg: true,
  jpg: true,
  png: true,
  svg: true,
  webp: true,
}

export default function AttachmentsPreview({
  attachmentIds,
  className,
}: AttachmentsPreviewProps) {
  const { uploadedFiles } = useCloudStorageOps({ attachmentIds })

  if (uploadedFiles.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        No attachments available.
      </p>
    )
  }

  return (
    <AttachmentGroup className={cn("w-full", className)}>
      {uploadedFiles.map((attachment) => (
        <AttachmentItem key={attachment.id} attachment={attachment} />
      ))}
    </AttachmentGroup>
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


function getIconByExtension(extension: string) {
  switch (extension) {
    case "txt":
    case "pdf":
    case "doc":
    case "docx":
    case "xls":
    case "xlsx":
    case "ppt":
    case "pptx":
      return <FileText />
    case "zip":
    case "rar":
    case "7z":
      return <FolderArchive />
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FileImage />
    case "mp4":
    case "avi":
    case "mov":
      return <FileVideo />
    case "mp3":
    case "wav":
      return <FileAudio />
    default:
      return <Paperclip />
  }
}

function AttachmentItem({ attachment }: AttachmentItemProps) {
  const extension = attachment.name.split(".").pop()?.toLowerCase() ?? ""
  const isImage = IMAGE_EXTENSION_BY_NAME[extension] === true
  const metadata = `${extension ? extension.toUpperCase() : "File"} · ${prettyBytes(attachment.size)}`

  return (
    <Attachment className="w-64">
      <AttachmentMedia variant={isImage ? "image" : "icon"}>
        {isImage ? (
          <img src={attachment.link} alt={`Preview of ${attachment.name}`} />
        ) : (
          getIconByExtension(extension)
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle title={attachment.name}>{attachment.name}</AttachmentTitle>
        <AttachmentDescription>{metadata}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
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
      </AttachmentActions>
      <AttachmentTrigger asChild>
        <a
          href={attachment.link}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${attachment.name}`}
        />
      </AttachmentTrigger>
    </Attachment>
  )
}

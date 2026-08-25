import type { FC } from "react"
import type { AttachmentDto } from "@medram/react-ui-kit/types"

interface ImagePreviewProps {
  attachment: AttachmentDto
}

const ImagePreview: FC<ImagePreviewProps> = ({ attachment }) => (
  <img
    src={attachment.link}
    alt={attachment.name}
    width={300}
    height={200}
    className="w-full max-w-[300px] rounded-lg border border-muted p-1 shadow-md"
  />
)

export default ImagePreview

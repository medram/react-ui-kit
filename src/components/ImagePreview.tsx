// ImagePreview.tsx
import Image from "next/image"
import React from "react"
import { AttachmentDto } from "../types"

interface ImagePreviewProps {
  attachment: AttachmentDto
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ attachment }) => {
  return (
    <Image
      src={attachment.link}
      alt={attachment.name}
      width={300}
      height={200}
      className="w-full border border-muted rounded-lg p-1 max-w-[300px] shadow-md"
      style={{ height: "auto" }}
    />
  )
}

export default ImagePreview

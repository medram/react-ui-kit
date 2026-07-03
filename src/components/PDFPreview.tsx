"use client"

import { Clock, DownloadIcon, FileIcon, TagIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { cn } from "../lib/cn"
import { Badge } from "../primitives/badge"
import { Card } from "../primitives/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../primitives/tooltip"
import type { AttachmentDto } from "../types"
import { formatFileSize } from "../utils"

dayjs.extend(relativeTime)
interface PDFPreviewProps {
  attachment: AttachmentDto
  className?: string
  suffixTitle?: string
}

export default function PDFPreview({ attachment, className, suffixTitle = "" }: PDFPreviewProps) {
  const [isHovered, setIsHovered] = useState(false)

  const createdTimeAgo = dayjs(attachment.created).fromNow()
  const formattedSize = formatFileSize(attachment.size)

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "max-w-full overflow-hidden p-3 flex items-center justify-between transition-all shadow-none duration-300 ease-in-out relative group hover:shadow-sm",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center space-x-4 flex-grow min-w-0">
          <FileIcon className="w-8 h-8 text-red-500 flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-medium truncate">{`${attachment.name} ${suffixTitle}`}</span>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {createdTimeAgo}
              </span>
              <span>|</span>
              <span>{formattedSize}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {attachment.tag && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              <TagIcon className="w-3 h-3 mr-1" />
              {attachment.tag}
            </Badge>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={attachment.link}
                download={attachment.name}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0 sm:opacity-100"}`}
                aria-label={`Download ${attachment.name}`}
              >
                <DownloadIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download {attachment.name}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Card>
    </TooltipProvider>
  )
}

import { cn } from "../lib/cn"
import { AvatarFallback, AvatarImage, Avatar as BaseAvatar } from "../primitives/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../primitives/tooltip"

type AvatarProps = {
  fallback: string
  src?: string
  alt?: string
  className?: string
  tooltipContent?: string
  size?: number
}

export default function Avatar({
  src = "",
  alt = "",
  fallback,
  className = "",
  tooltipContent = "",
  size = 11,
}: AvatarProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <BaseAvatar
            className={cn(
              `flex items-center justify-center rounded-full cursor-default ${className}`,
            )}
            style={{
              width: `${size * 0.25}rem`,
              height: `${size * 0.25}rem`,
              minWidth: `${size * 0.25}rem`,
              minHeight: `${size * 0.25}rem`,
            }}
          >
            {src && <AvatarImage className="object-cover rounded-full" src={src} alt={alt} />}
            <AvatarFallback className="flex justify-center items-center text-15 font-semibold w-full h-full">
              {fallback}
            </AvatarFallback>
          </BaseAvatar>
        </TooltipTrigger>
        {tooltipContent && (
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

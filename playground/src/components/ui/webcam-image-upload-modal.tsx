import { useField } from "formik"
import { ImageUp } from "lucide-react"
import { useCallback } from "react"
import { cn } from "@/lib/utils"
import { TriggerModal, useModalContext } from "@/components/ui/stacked-modals"
import { Label } from "@/components/ui/label"
import { WebcamImageUploader } from "@/components/ui/webcam-image-uploader"

const DEFAULT_PROFILE_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"

export type WebcamImageFieldProps = {
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
  className?: string
  triggerClassName?: string
  previewClassName?: string
  rounded?: boolean
  aspect?: "1:1" | "3:4" | "4:3" | "16:9"
  webcamType?: "portrait" | "landscape"
  buttonText?: string
  modalTitle?: string
  showEditOverlay?: boolean

  size?: number
}

const aspectMap: Record<string, string> = {
  "1:1": "aspect-square",
  "3:4": "aspect-[3/4]",
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
}

export function WebcamImageUploadModal({
  name,
  label,
  required,
  disabled,
  className,
  triggerClassName,
  previewClassName,
  rounded = true,
  aspect = "1:1",
  webcamType = "portrait",
  buttonText = "Upload Image",
  modalTitle = "Select Profile Image",
  showEditOverlay = true,
  size = 160,
}: WebcamImageFieldProps) {
  const [field, , helpers] = useField<string | null>(name)
  const { open } = useModalContext()
  const value = field.value

  const handleOpen = useCallback(() => {
    if (disabled) return
    open({
      title: modalTitle,
      contentClassName: "sm:min-w-[600px]",
      modal: ({ close }) => (
        <WebcamImageUploader
          onSave={(attachment) => {
            helpers.setValue(attachment?.link || null)
            close()
          }}
          className="bg-transparent border-none shadow-none p-0"
          saveButtonClassName="mt-4"
          webcamType={webcamType}
        />
      ),
    })
  }, [disabled, open, modalTitle, helpers, webcamType])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <TriggerModal
        onClick={handleOpen}
        disabled={disabled}
        className={cn(
          "group relative overflow-hidden border bg-muted/30 hover:bg-muted/60 transition flex items-center justify-center p-0",
          rounded && aspect === "1:1" ? "" : aspectMap[aspect],
          rounded ? "rounded-full" : "rounded-lg",
          !value && "flex-col gap-2 text-xs text-muted-foreground",
          triggerClassName,
        )}
        style={
          rounded && aspect === "1:1"
            ? {
                width: size,
                height: size,
                minWidth: size,
                minHeight: size,
              }
            : undefined
        }
      >
        {value ? (
          <div
            className={cn(
              "w-full h-full relative",
              rounded ? "rounded-full" : "rounded-lg",
              rounded && aspect === "1:1" ? "" : aspectMap[aspect],
            )}
            style={
              rounded && aspect === "1:1"
                ? {
                    width: size,
                    height: size,
                  }
                : undefined
            }
          >
            <img
              src={value || DEFAULT_PROFILE_IMAGE}
              alt="Profile image"
              className={cn("size-full object-cover", rounded ? "rounded-full" : "rounded-lg")}
            />
            {showEditOverlay && (
              <div
                className={cn(
                  "border-2 border-dashed border-primary absolute inset-0 hidden group-hover:flex flex-col items-center justify-center bg-primary/10 backdrop-blur-sm  text-white text-[11px] gap-1 ",
                  rounded ? "rounded-full " : "rounded-lg",
                )}
              >
                <ImageUp className="w-4 h-4" />
                <span>Upload new one</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div
              className={cn(
                "border-2 border-dashed border-primary absolute inset-0 hidden group-hover:flex flex-col items-center justify-center bg-primary/10 backdrop-blur-sm  text-white text-[11px] gap-1 ",
                rounded ? "rounded-full " : "rounded-lg",
              )}
            >
              <ImageUp className="w-4 h-4" />
              <span>Upload new one</span>
            </div>
            <img
              src={DEFAULT_PROFILE_IMAGE}
              alt="Profile image"
              className={cn("size-full object-cover", rounded ? "rounded-full" : "rounded-lg")}
            />
          </div>
        )}
      </TriggerModal>
    </div>
  )
}

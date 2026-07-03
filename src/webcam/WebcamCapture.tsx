/* eslint-disable @next/next/no-img-element */
"use client"
import { ArrowLeft, Camera, Loader2, RefreshCw, ShieldAlert } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import ReactWebcam from "react-webcam"
import { cn } from "../lib/cn"
import { Button } from "../primitives/button"

export type WebcamCaptureProps = {
  onCapture: (imageDataUrl: string) => void
  onBack: () => void
  webcamType?: "landscape" | "portrait"
  disabled?: boolean
  className?: string
}

const aspectRatios = {
  landscape: { width: 1280, height: 720 },
  portrait: { width: 720, height: 1280 },
}

export function WebcamCapture({
  onCapture,
  onBack,
  webcamType = "portrait",
  disabled = false,
  className = "",
}: WebcamCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">("unknown")
  const webcamRef = useRef<ReactWebcam>(null)

  const constraints = useMemo(
    () => ({ facingMode: "user", ...aspectRatios[webcamType] }),
    [webcamType],
  )

  // Width percentage for blurred side panels to highlight the center area
  const sideMaskWidthPct = webcamType === "portrait" ? 15 : 10

  const [webcamKey, setWebcamKey] = useState(0)

  const handleRetryPermission = () => {
    setPermission("unknown")
    setWebcamKey((k) => k + 1)
  }

  const handleCapture = () => {
    if (permission !== "granted") {
      toast.error("Camera not ready. Grant permission first.")
      return
    }
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) setCapturedImage(imageSrc)
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
  }

  const handleUsePhoto = async () => {
    if (!capturedImage) return
    setIsProcessing(true)
    try {
      await onCapture(capturedImage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      <div className="flex items-center gap-2 -mt-2">
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          onClick={onBack}
          disabled={disabled || isProcessing}
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
      </div>
      {/* Live Webcam Feed */}
      {!capturedImage && (
        <div className="flex flex-col gap-3 items-center w-full">
          <div
            className={cn(
              "relative rounded-xl overflow-hidden border w-full bg-black",
              webcamType === "portrait" ? "aspect-[3/4]" : "aspect-video",
            )}
          >
            {permission !== "denied" && (
              <ReactWebcam
                key={webcamKey}
                ref={webcamRef}
                mirrored
                screenshotFormat="image/jpeg"
                screenshotQuality={0.95}
                videoConstraints={constraints}
                onUserMedia={() => setPermission("granted")}
                onUserMediaError={(err) => {
                  setPermission("denied")
                  const name = typeof err === "string" ? "" : (err as DOMException).name
                  toast.error(
                    name === "NotAllowedError"
                      ? "Camera access denied. Please allow camera permission in browser settings."
                      : "Unable to access camera. Check permissions or device.",
                  )
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {permission === "granted" && (
              <>
                {/* Left and right blurred overlays to focus the center */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 bg-background/30 backdrop-blur-sm"
                  style={{ width: `${sideMaskWidthPct}%` }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-0 bg-background/30 backdrop-blur-sm"
                  style={{ width: `${sideMaskWidthPct}%` }}
                />

                {/* Center focus frame */}
                <div
                  className="pointer-events-none absolute inset-y-0 flex items-stretch"
                  style={{ left: `${sideMaskWidthPct}%`, right: `${sideMaskWidthPct}%` }}
                >
                  <div className="w-full ring-1 ring-white/70 rounded-md" />
                </div>
              </>
            )}
            {permission === "unknown" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs">
                <Loader2 className="w-5 h-5 animate-spin" />
                Requesting camera permission...
              </div>
            )}
            {permission === "denied" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-4 bg-background/70 backdrop-blur-sm">
                <ShieldAlert className="w-6 h-6 text-destructive" />
                <p className="text-xs leading-relaxed">
                  Camera access is blocked. Please enable permissions in your browser settings and
                  retry.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleRetryPermission}
                  disabled={disabled || isProcessing}
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleCapture}
            disabled={disabled || isProcessing || permission !== "granted"}
          >
            <Camera className="w-4 h-4 mr-1" /> Capture
          </Button>
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="flex flex-col gap-3 items-center w-full">
          <div
            className={cn(
              "relative rounded-xl overflow-hidden border w-full",
              webcamType === "portrait" ? "aspect-[3/4]" : "aspect-video",
            )}
          >
            {/* react-doctor-disable-next-line react-doctor/nextjs-no-img-element -- base64 data URL from webcam; next/image cannot optimize blobs and this is a UI library package */}
            <img
              src={capturedImage}
              alt="Captured"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Blurred sides to mirror the live preview */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 bg-background/30 backdrop-blur-sm"
              style={{ width: `${sideMaskWidthPct}%` }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 bg-background/30 backdrop-blur-sm"
              style={{ width: `${sideMaskWidthPct}%` }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 flex items-stretch"
              style={{ left: `${sideMaskWidthPct}%`, right: `${sideMaskWidthPct}%` }}
            >
              <div className="w-full ring-1 ring-white/70 rounded-md" />
            </div>

            <button
              type="button"
              onClick={handleRetake}
              disabled={disabled || isProcessing}
              className="absolute top-2 right-2 bg-background/70 rounded-full p-1 shadow hover:bg-background"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {isProcessing && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-xs">
                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRetake}
              disabled={disabled || isProcessing}
            >
              Retake
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUsePhoto}
              disabled={disabled || isProcessing}
            >
              {isProcessing && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Use Photo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

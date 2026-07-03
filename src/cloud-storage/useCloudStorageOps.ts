"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { AttachmentDto } from "../types"
import { useCloudStorageContext } from "./context"

type PlaceholderEntry = { index: number; progress: number }

type CloudStorageOpsOptions = {
  attachmentIds?: string[]
  /** 0–100 → displayed value; defaults to Math.round. */
  formatProgress?: (raw: number) => number
}

/**
 * Package-internal hook that replicates useCloudStorage's state machine while
 * sourcing its API calls from the nearest CloudStorageProvider instead of the
 * app's axios instance directly.
 *
 * All upload components use this instead of the app's useCloudStorage hook.
 */
export function useCloudStorageOps({
  attachmentIds = [],
  formatProgress = Math.round,
}: CloudStorageOpsOptions = {}) {
  const {
    uploadFile: uploadFn,
    fetchAttachment,
    deleteAttachment: deleteFn,
    onError,
  } = useCloudStorageContext()

  const [uploadedFiles, setUploadedFiles] = useState<AttachmentDto[]>([])
  const [placeholders, setPlaceholders] = useState<PlaceholderEntry[]>([])

  const isUploading = placeholders.length > 0

  // Keep track of the joined IDs string so we can do a synchronous drop of
  // files that are no longer in the value list (mirrors useCloudStorage).
  const prevIdsKeyRef = useRef<string>("")
  const idsKey = attachmentIds.join(",")
  if (idsKey !== prevIdsKeyRef.current) {
    prevIdsKeyRef.current = idsKey
    const idSet = new Set(attachmentIds)
    const kept = uploadedFiles.filter((f) => idSet.has(f.id))
    if (kept.length !== uploadedFiles.length) setUploadedFiles(kept)
  }

  // Fetch attachments by ID whenever the list changes.
  useEffect(() => {
    if (!attachmentIds.length) return
    void Promise.all(
      attachmentIds.map(async (id) => {
        if (!id) return
        try {
          const attachment = await fetchAttachment(id)
          setUploadedFiles((prev) => {
            if (prev.find((f) => f.id === attachment.id)) return prev
            return [...prev, attachment]
          })
        } catch (err) {
          if (onError) onError(err)
          else console.error("Failed to fetch attachment:", err)
        }
      }),
    )
    // idsKey is the stable dep; individual IDs don't need to be listed.
    // eslint-disable-next-line react-doctor/exhaustive-deps
  }, [idsKey])

  const uploadFile = useCallback(
    async ({ file, name = "file" }: { file: File; name?: string }) => {
      const idx = Date.now()
      setPlaceholders((prev) => [...prev, { index: idx, progress: 0 }])

      try {
        const attachment = await uploadFn(file, {
          name,
          onProgress: (raw) => {
            const progress = formatProgress(raw)
            setPlaceholders((prev) => prev.map((p) => (p.index === idx ? { ...p, progress } : p)))
          },
        })
        if (attachment) setUploadedFiles((prev) => [...prev, attachment])
        return attachment
      } finally {
        setPlaceholders((prev) => prev.filter((p) => p.index !== idx))
      }
    },
    [uploadFn, formatProgress],
  )

  const deleteAttachment = useCallback(
    async (id: string) => {
      await deleteFn(id)
      setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
    },
    [deleteFn],
  )

  const handleError = useCallback(
    (err: unknown) => {
      if (onError) onError(err)
      else console.error("Cloud storage error:", err)
    },
    [onError],
  )

  return {
    uploadFile,
    isUploading,
    uploadedFiles,
    setUploadedFiles,
    /** progress metadata — shape matches the original useCloudStorage */
    attachmentPlaceholdersMetadata: placeholders,
    deleteAttachment,
    handleError,
  } as const
}

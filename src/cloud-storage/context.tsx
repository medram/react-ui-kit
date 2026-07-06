"use client"

import React, { createContext, use } from "react"
import type { AttachmentDto } from "../types"

export type UploadFileOptions = {
  /** Filename to use on the server; defaults to "file". */
  name?: string
  /** Progress callback 0–100; called as bytes are sent. */
  onProgress?: (pct: number) => void
}

/**
 * Contract that the host app must satisfy to wire cloud storage into the
 * package's upload / attachment components.  The package owns only this
 * interface; all HTTP, auth, and endpoint details live in the app.
 *
 * Usage in the app's Providers.tsx:
 *
 *   import { CloudStorageProvider } from "@flowui/ui/cloud-storage"
 *   import { useCloudStorage } from "@/hooks/cloudstorage.hook"
 *
 *   function AppCloudStorageProvider({ children }) {
 *     const { uploadFile: appUpload } = useCloudStorage()
 *     return (
 *       <CloudStorageProvider
 *         value={{
 *           uploadFile: (file, { name, onProgress } = {}) =>
 *             appUpload({ file, name, axiosReqConfig: { onUploadProgress: e =>
 *               e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)) } }),
 *           fetchAttachment: (id) => APIs.common.getAttachment(id),
 *           deleteAttachment: (id) => APIs.common.deleteAttachment(id),
 *         }}
 *       >
 *         {children}
 *       </CloudStorageProvider>
 *     )
 *   }
 */
export type CloudStorageContextValue = {
  uploadFile: (file: File, options?: UploadFileOptions) => Promise<AttachmentDto>
  fetchAttachment: (id: string) => Promise<AttachmentDto>
  deleteAttachment: (id: string) => Promise<void>
  /** Called when uploadFile or fetchAttachment throws. Defaults to console.error. */
  onError?: (error: unknown) => void
}

const CloudStorageContext = createContext<CloudStorageContextValue | null>(null)

export function CloudStorageProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: CloudStorageContextValue
}) {
  return <CloudStorageContext.Provider value={value}>{children}</CloudStorageContext.Provider>
}

export function useCloudStorageContext(): CloudStorageContextValue {
  const ctx = use(CloudStorageContext)
  if (!ctx) {
    throw new Error(
      "useCloudStorageContext: no <CloudStorageProvider> found in the tree. " +
        "Wrap your app root with <CloudStorageProvider value={...}> from @flowui/ui/cloud-storage.",
    )
  }
  return ctx
}

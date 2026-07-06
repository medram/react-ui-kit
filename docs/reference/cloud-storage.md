# Cloud storage reference

Upload-aware components in `@flowui/ui` do not talk to your API directly. They depend on a provider contract that your app implements once.

## Import

```tsx
import {
  CloudStorageProvider,
  useCloudStorageContext,
  type CloudStorageContextValue,
  type UploadFileOptions,
} from "@flowui/ui/cloud-storage"
```

## Provider contract

```tsx
type UploadFileOptions = {
  name?: string
  onProgress?: (pct: number) => void
}

type CloudStorageContextValue = {
  uploadFile: (file: File, options?: UploadFileOptions) => Promise<AttachmentDto>
  fetchAttachment: (id: string) => Promise<AttachmentDto>
  deleteAttachment: (id: string) => Promise<void>
  onError?: (error: unknown) => void
}
```

### What each function is for

| Function | Used by |
| --- | --- |
| `uploadFile` | `UploadField`, `BasicImageUploaderField`, `UploadInput`, `WebcamImageUploader`, and `WebcamImageUploadModal` through its internal uploader flow |
| `fetchAttachment` | Preview and attachment hydration flows |
| `deleteAttachment` | Upload deletion and cleanup flows |
| `onError` | Centralized error handling when upload/fetch/delete operations fail |

## App-level setup

```tsx
import {
  CloudStorageProvider,
  type CloudStorageContextValue,
} from "@flowui/ui/cloud-storage"

const cloudStorageValue: CloudStorageContextValue = {
  uploadFile: async (file, { name, onProgress } = {}) =>
    uploadAttachment({
      file,
      name,
      onUploadProgress: (event) => {
        if (!event.total) return
        onProgress?.(Math.round((event.loaded / event.total) * 100))
      },
    }),
  fetchAttachment: async (id) => getAttachment(id),
  deleteAttachment: async (id) => removeAttachment(id),
  onError: (error) => reportError(error),
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <CloudStorageProvider value={cloudStorageValue}>{children}</CloudStorageProvider>
}
```

## Reading the provider from custom code

```tsx
import { useCloudStorageContext } from "@flowui/ui/cloud-storage"

export function RetryUploadButton({ file }: { file: File }) {
  const { uploadFile } = useCloudStorageContext()

  return <button onClick={() => uploadFile(file)}>Retry upload</button>
}
```

## Components that need this provider

- `UploadField`
- `BasicImageUploaderField`
- `UploadInput`
- `WebcamImageUploader`
- `WebcamImageUploadModal` via its internal uploader flow
- flows built on `useCloudStorageOps`

::: warning Missing provider behavior
`useCloudStorageContext()` throws when no `CloudStorageProvider` exists in the tree. If uploads fail immediately with a provider error, fix the app shell first rather than debugging the field component.
:::

## Progress reporting

If your HTTP client exposes upload progress, pass it to `onProgress` as a percentage from `0` to `100`. The package uses that callback to render progress feedback in upload-aware components.

## Practical advice

- Put the provider near the app root instead of inside individual forms.
- Keep API concerns in the host app and leave the package contract thin.
- Normalize attachment DTOs once in your provider implementation so every component sees the same shape.

# Cloud Storage

`@medram/react-ui-kit/cloud-storage` is the only runtime npm integration required by Medram registry upload workflows.

```tsx
import {
  CloudStorageProvider,
  type CloudStorageContextValue,
  type UploadFileOptions,
  useCloudStorageContext,
} from "@medram/react-ui-kit/cloud-storage"
```

## Provider contract

```tsx
const storage: CloudStorageContextValue = {
  uploadFile: async (file, options: UploadFileOptions = {}) => {
    return uploadViaApi(file, options)
  },
  fetchAttachment: async (id) => fetchAttachment(id),
  deleteAttachment: async (id) => deleteAttachment(id),
  onError: (error) => reportError(error),
}
```

Mount one provider above every Medram upload workflow:

```tsx
<CloudStorageProvider value={storage}>{children}</CloudStorageProvider>
```

`useCloudStorageContext()` throws a clear error when no provider is mounted. It supports React 18 and React 19.

## Upload state helper

Registry upload components use `useCloudStorageOps()` to fetch attachment IDs, upload files with progress, expose optimistic placeholders, and delete attachments. Custom application workflows may use it too:

```tsx
const { uploadFile, uploadedFiles, isUploading, deleteAttachment } = useCloudStorageOps({
  attachmentIds,
})
```

The application controls persistence and authorization; Medram does not own endpoints, HTTP clients, or authentication.

# Cloud Storage

Install `@medram/react-ui-kit` only for the headless Cloud Storage contract.

```tsx
import { CloudStorageProvider, useCloudStorageContext, useCloudStorageOps } from "@medram/react-ui-kit/cloud-storage"
```

Provide application-owned `uploadFile`, `fetchAttachment`, and `deleteAttachment` operations. The provider works in React 18 and React 19. Registry upload workflows require it; no visual Medram package import is legal.

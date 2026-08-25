# Webcam Image Uploader

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/webcam-image-uploader
```

Generated source: `components/ui/webcam-image-uploader.tsx`.

## Dependencies

- shadcn registry items: button, medram/react-ui-kit/image-upload-card, medram/react-ui-kit/webcam-capture, medram/react-ui-kit/webcam-file-upload
- npm packages: @medram/react-ui-kit, lucide-react, react-hot-toast
- runtime prerequisites: CloudStorageProvider above the component tree.

## Contract

- Source of truth: [`registry/source/webcam/WebcamImageUploader.tsx`](../../../registry/source/webcam/WebcamImageUploader.tsx).
- Exported declarations: `WebcamImageUploaderProps`, `WebcamImageUploader`
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.

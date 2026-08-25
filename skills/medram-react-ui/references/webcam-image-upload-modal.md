# Webcam Image Upload Modal

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/webcam-image-upload-modal
```

Generated source: `components/ui/webcam-image-upload-modal.tsx`.

## Dependencies

- shadcn registry items: label, medram/react-ui-kit/stacked-modals, medram/react-ui-kit/webcam-image-uploader
- npm packages: formik, lucide-react
- runtime prerequisites: Formik form context with a matching initial value.

## Contract

- Source of truth: [`registry/source/webcam/WebcamIamgeUploadModal.tsx`](../../../registry/source/webcam/WebcamIamgeUploadModal.tsx).
- Exported declarations: `WebcamImageFieldProps`, `WebcamImageUploadModal`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.

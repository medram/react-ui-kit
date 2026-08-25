---
name: medram-react-ui
description: "Use Medram shadcn registry workflows and Cloud Storage contracts in React and Next.js applications."
compatibility: "@medram/react-ui-kit 0.2.0; React 18+; Tailwind CSS 4.3; current shadcn CLI"
---

## Route requests correctly

1. Visual component request → install a registry item:

   ```bash
   pnpm dlx shadcn@latest add medram/react-ui-kit/<item>
   ```

   Import the generated consumer source from `@/components/ui/<item>`.

2. Ordinary button, card, dialog, field, or other primitive composition → use upstream shadcn:

   ```bash
   pnpm dlx shadcn@latest add <component>
   ```

3. Upload, attachment, webcam, or custom storage state → install npm package and use:

   ```tsx
   import {
     CloudStorageProvider,
     useCloudStorageContext,
     useCloudStorageOps,
   } from "@medram/react-ui-kit/cloud-storage"
   ```

4. Shared DTOs → import only from `@medram/react-ui-kit/types`.

## Non-negotiable rules

- Never import Medram visual components from npm. There is no root visual barrel or primitive subpath.
- Medram registry source targets current shadcn Radix components. Initialize the host with `pnpm dlx shadcn@latest init --base radix`.
- Install every visual item through the registry so its dependencies are explicit.
- Interactive registry items in Next.js App Router belong in a client component.
- Formik field items require matching `initialValues`; their generated controls must preserve label, error, and disabled associations.
- Upload workflows require `CloudStorageProvider`; modal webcam flow also requires Formik and `stacked-modals`.
- When a Next.js host needs routing, keep `router`/`Link` use in the host composition. Registry components expose callbacks and ordinary links so Vite remains supported.

## Reference map

| Need | Reference |
| --- | --- |
| Choose an item, command, source import, or prerequisite | [Registry catalogue](references/catalog.md) |
| Cloud upload, fetch, delete, progress, and failure contract | [Cloud Storage](references/cloud-storage.md) |
| A specific item’s source, dependencies, state, and callback contract | `references/<item>.md` |

## Before finishing

1. Read the item reference and its installed generated source.
2. Verify registry dependencies, provider placement, Formik ownership, value shape, labels/errors, and client boundaries.
3. Run the consumer build or typecheck. For UI changes, exercise the actual browser surface.

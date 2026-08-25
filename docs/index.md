---
layout: home
title: "@medram/react-ui-kit"
titleTemplate: false
hero:
  name: "@medram/react-ui-kit"
  text: Medram workflows for your shadcn application
  tagline: Install visual workflows as editable source; keep only Cloud Storage contracts in npm.
  actions:
    - theme: brand
      text: Browse registry
      link: /reference/catalog
    - theme: alt
      text: Get started
      link: /guide/getting-started
features:
  - title: Consumer-owned UI
    details: Medram registry items depend on your installed shadcn components rather than package-owned primitives.
  - title: React and Next.js
    details: Registry sources avoid Next-only imports so the same workflow can build in Vite and Next.js.
  - title: Explicit storage boundary
    details: CloudStorageProvider keeps upload, fetch, delete, and authorization code in the application.
---

## Public contract

The npm package exposes only:

- `@medram/react-ui-kit/cloud-storage`
- `@medram/react-ui-kit/types`

All visual components are installed from the source registry. Start with the [registry catalogue](/reference/catalog).

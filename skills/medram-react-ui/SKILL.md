---
name: medram-react-ui
description: "Use @medram/react-ui-kit correctly in React and Next.js applications. Use this skill whenever an agent installs, configures, builds, refactors, debugs, or reviews UI with this package, including Formik fields, shadcn/Radix primitives, charts, wizards, stacked modals, uploads and cloud storage, webcam, time pickers, Tailwind, or design tokens."
compatibility: "@medram/react-ui-kit 0.1.3; React 18+; Next.js 14+; Tailwind CSS 3+; feature-specific optional peers are documented in references/setup-and-runtime.md"
---

## Source of truth

1. Inspect the consumer's installed `@medram/react-ui-kit` version before coding.
2. Read its `package.json#exports` and public `.d.ts` declarations. Those installed contracts win whenever they differ from 0.1.3.
3. For 0.1.3, use this skill and this repository's public barrels and docs. Treat implementation files only as evidence; never teach consumers to import them.
4. Use only these manifest entrypoints: root, `/primitives`, `/fields`, `/charts`, `/modal`, `/wizard`, `/webcam`, `/time-picker`, `/cloud-storage`, `/tailwind`, and `/styles.css`.

Do not import `src/**`, `dist/**`, chart `*.content`, `useCloudStorageOps`, or any other deep path.

## Workflow

1. Inspect the host's package version, framework boundary, Tailwind config, form-state library, and providers already mounted.
2. Select a legal package layer below. Install every peer required by the selected feature.
3. Read the one or two references that answer the task before writing code.
4. Add `@medram/react-ui-kit/styles.css` once and configure the Tailwind preset/content scan when Tailwind participates.
5. In Next.js RSC apps, put hooks, callbacks, Formik, providers, charts, webcam, Radix primitives, and hash-aware tabs in a client component or a client child. Keep data fetching above that boundary.
6. Implement the smallest complete composition. Preserve the primitive accessibility structure rather than replacing compound parts with arbitrary markup.
7. Run the host app's build or typecheck after integration. Resolve missing peers or configuration at their source rather than changing package imports.

## Choose the package layer

| Need                                                           | Import from                          | Decision                                                                                                |
| -------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| App-ready dashboard helper or explicit compatibility re-export | `@medram/react-ui-kit`               | Use only when the helper's whole workflow matches. `SubmitButton` is root-only.                         |
| Low-level themed UI and Radix composition                      | `@medram/react-ui-kit/primitives`    | Use for controlled dialogs, conventional tabs, custom form layout, and accessible composition.          |
| Formik-ready fields or raw custom-state inputs                 | `@medram/react-ui-kit/fields`        | Use `*Field` under Formik. Use `SelectInput`, `ComboBox`, `UploadInput`, or `DropZone` for owned state. |
| Dashboard charts                                               | `@medram/react-ui-kit/charts`        | Use named chart imports. Normal wrappers already contain their `Suspense` boundary.                     |
| Stack-aware modal transitions                                  | `@medram/react-ui-kit/modal`         | Use a provider, `useModalContext()`, and `TriggerModal`.                                                |
| Multi-step flow                                                | `@medram/react-ui-kit/wizard`        | Start with `Wizard`; choose `BaseWizard` only for custom navigation/progress/content.                   |
| Capture or upload an image                                     | `@medram/react-ui-kit/webcam`        | Mount cloud storage; modal field also needs stacked modals and Formik.                                  |
| Standalone controlled time                                     | `@medram/react-ui-kit/time-picker`   | Use `TimePicker` with `date` and `onChange`.                                                            |
| Attachment adapter                                             | `@medram/react-ui-kit/cloud-storage` | Mount one `CloudStorageProvider` near the client app root.                                              |

## Non-negotiable rules

- [ ] Import `@medram/react-ui-kit/styles.css` once, unless the host intentionally owns the identical CSS variables.
- [ ] Add the Tailwind preset and package content glob whenever Tailwind is in scope.
- [ ] Render interactive package surfaces through a client component in Next.js RSC apps.
- [ ] Put every `*Field` and root `SubmitButton` under Formik. Field `name` values must exist in `initialValues`.
- [ ] Put upload and webcam flows below `CloudStorageProvider`.
- [ ] Open stacked modals only from `TriggerModal`; `open()` must run synchronously in its click handler.
- [ ] Preserve primitive accessibility: full compound family, labels and IDs, title/description, alt text, and explicit destructive-flow cancellation.
- [ ] Install every optional peer used by the selected feature. Optional package metadata is not a runtime fallback.

High-risk corrections:

- `SubmitButton` is root-only and Formik-dependent. Never import it from `/fields`.
- `TextEditor` returns `null`; do not recommend it.
- Public spellings are `FlikeringGrid`, `TimeZoneSelectFiels`, and `LineCharts`.
- Normal chart wrappers own their `Suspense`; do not wrap them again without a separate reason.
- `ModalStackedBox` and `DialogStack*` are implementation details, not `/modal` exports.
- `ModalBox` is not truly controlled: it only initializes internal state from `isOpen`; declared `width` and `height` do nothing. Use primitive `Dialog` for controlled state or the stacked-modal API for stack-aware flows.

## Reference map

| Read when                                                                                 | Reference                                                        |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Installing, configuring Tailwind, resolving Next.js boundaries or feature peers           | [Setup and runtime](references/setup-and-runtime.md)             |
| Choosing a symbol, import path, value type, alias, or limitation                          | [Component catalog](references/components.md)                    |
| Building an ordinary Formik form, primitive composition, root helper, raw input, or chart | [Composition patterns](references/patterns.md)                   |
| Wiring cloud storage, stacked modals, webcam, wizard, or standalone time input            | [Providers and workflows](references/providers-and-workflows.md) |

## Before finishing

1. Re-check the consumer's installed exports and declarations if its version is not 0.1.3.
2. Confirm every import is a manifest entrypoint and every required peer is installed.
3. Verify provider placement, Formik ownership, client boundaries, accessibility parts, and stored value shape.
4. Run the host app's own build or typecheck. Missing token styles, missing Tailwind scan paths, and unresolved feature peers are configuration defects, not reasons to deep-import package internals.

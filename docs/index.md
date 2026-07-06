---
layout: home
title: "@flowui/ui"
titleTemplate: false
hero:
  name: "@flowui/ui"
  text: A practical React UI kit for product teams
  tagline: Shadcn-style primitives, Formik-ready fields, charts, wizard flows, upload tooling, and dashboard helpers in one package.
  actions:
    - theme: brand
      text: Browse components
      link: /components/
    - theme: alt
      text: Get started
      link: /guide/getting-started
features:
  - title: Ship forms faster
    details: Use the Formik-ready field layer for labels, help text, validation feedback, date/time pickers, uploads, and image workflows.
  - title: Stay close to the metal
    details: Drop down to themed primitives whenever you want direct control over cards, dialogs, tabs, sheets, tables, and low-level form inputs.
  - title: Solve real app flows
    details: The package includes stacked modals, multi-step wizards, webcam capture, upload provider wiring, and chart wrappers for dashboard work.
---

## Pick your starting point

| If you are building | Go here |
| --- | --- |
| A form or settings screen | [Form fields](/components/form-fields) |
| A custom screen layout | [Primitives](/components/primitives) |
| A dashboard card or app widget | [Root components](/components/root-components) |
| A data visualization | [Charts](/components/charts) |
| A modal, wizard, upload, or camera flow | [Workflows and providers](/components/workflows) |

## Public entrypoints

- `@flowui/ui`
- `@flowui/ui/primitives`
- `@flowui/ui/fields`
- `@flowui/ui/charts`
- `@flowui/ui/modal`
- `@flowui/ui/wizard`
- `@flowui/ui/webcam`
- `@flowui/ui/time-picker`
- `@flowui/ui/cloud-storage`
- `@flowui/ui/tailwind`
- `@flowui/ui/styles.css`

## Friendly rules of thumb

::: tip
- Reach for `@flowui/ui/fields` when you want Formik wiring done for you.
- Reach for `@flowui/ui/primitives` when you want control over composition.
- Reach for the root barrel when a ready-made widget already fits the screen.
:::

Start with the [component guide](/components/) if you want the fastest path from requirement to import.

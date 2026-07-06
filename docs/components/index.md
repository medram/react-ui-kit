# Component guide

If you know the job to be done, start here.

## Choose the right entrypoint

| You need | Import from | Start with |
| --- | --- | --- |
| Formik-ready fields | `@flowui/ui/fields` | [Form fields](/components/form-fields) |
| shadcn-style building blocks | `@flowui/ui/primitives` | [Primitives](/components/primitives) |
| Ready-made dashboard and app helpers | `@flowui/ui` | [Root components](/components/root-components) |
| Recharts wrappers | `@flowui/ui/charts` | [Charts](/components/charts) |
| Wizards, stacked modals, webcam flows, and time input | `@flowui/ui/wizard`, `@flowui/ui/modal`, `@flowui/ui/webcam`, `@flowui/ui/time-picker` | [Workflows and providers](/components/workflows) |

::: tip Setup rules that matter
- Components ending in `Field` expect a Formik form context.
- Upload-aware components need `CloudStorageProvider`.
- `WebcamImageUploadModal` needs **Formik**, **CloudStorageProvider**, and **StackedModalsProvider**.
- The chart wrappers lazy-load Recharts, so `Suspense`-friendly layouts are a good fit.
:::

## The public surface, in plain English

### 1. Build forms quickly

Use the field layer when you want labels, help text, validation messages, and sensible Formik wiring out of the box.

- Text inputs: `InputField`, `TextAreaField`, `SensitiveField`, `CopyableInputField`
- Choice inputs: `SelectField`, `ComboBoxField`, `RadioGroupField`, `MultiSelectField`, `DropdownBoxField`
- Date and time inputs: `DatePickerField`, `DateRangePickerField`, `DateTimePickerField`, `MonthYearPickerField`, `TimePickerField`, timezone selectors
- Upload inputs: `UploadField`, `BasicImageUploaderField`, `UploadInput`, `DropZone`

### 2. Reach for primitives when you want layout control

The primitives layer exposes shadcn/Radix-style building blocks with the project theme already applied.

- Buttons, badges, labels, alerts, cards, tables
- Tabs, accordion, collapsible, popovers, sheets, dialogs, tooltips
- Raw select, checkbox, radio, switch, textarea, input
- Chart helpers like `ChartContainer`, `ChartTooltip`, and `ChartLegend`

### 3. Use the root barrel for app-ready pieces

The root `@flowui/ui` entrypoint is the convenience layer. It includes shared components that solve common dashboard problems directly.

- Feedback and state: `AlertBox`, `Loader`, `LoadingSection`, `FullScreenLoading`, `SubmitButton`
- Navigation and layout: `Tabs`, `VerticalTabs`, `Pagination`, `ModalBox`, `SheetBox`, `MultiStep`
- Display helpers: `OverviewBox`, `CopyableButton`, `CustomBadge`, `AttachmentsPreview`, `PDFPreview`, `WizardCard`
- Decorative helpers: `DotPattern`, `FlikeringGrid`, `gradientSeparator`, `NumberTicker`

## Recommended reading order

1. [Getting started](/guide/getting-started) for install and host-app setup.
2. [Form fields](/components/form-fields) if you are building forms.
3. [Root components](/components/root-components) if you want app-ready widgets.
4. [Charts](/components/charts) and [Workflows and providers](/components/workflows) for specialized flows.
5. [Exports reference](/reference/exports) when you want the shortest import path.

# Exports reference

This page is the shortest path to the right import.

## Entry points

| Import path | Use it for | Best follow-up page |
| --- | --- | --- |
| `@flowui/ui` | Convenience barrel for commonly reused fields and app-ready widgets | [Root components](/components/root-components) |
| `@flowui/ui/primitives` | shadcn/Radix-style low-level building blocks | [Primitives](/components/primitives) |
| `@flowui/ui/fields` | Formik-ready fields, upload inputs, and field helpers | [Form fields](/components/form-fields) |
| `@flowui/ui/charts` | Lazy-loaded Recharts wrappers | [Charts](/components/charts) |
| `@flowui/ui/modal` | Stacked modal provider, hooks, and modal helpers | [Workflows and providers](/components/workflows) |
| `@flowui/ui/wizard` | Wizard orchestration and wizard types | [Workflows and providers](/components/workflows) |
| `@flowui/ui/webcam` | Webcam capture and upload flows | [Workflows and providers](/components/workflows) |
| `@flowui/ui/time-picker` | Standalone time input controls | [Workflows and providers](/components/workflows) |
| `@flowui/ui/cloud-storage` | Upload provider contract and hooks | [Cloud storage reference](/reference/cloud-storage) |
| `@flowui/ui/tailwind` | Tailwind preset | [Styling](/guide/styling) |
| `@flowui/ui/styles.css` | Shared design-token stylesheet | [Styling](/guide/styling) |

## Root barrel highlights

The root barrel intentionally prioritizes convenience over perfect modularity.

### Re-exported field components

- `BasicImageUploaderField`
- `DatePickerField`
- `DateRangePickerField`
- `InputField`
- `MultiCheckBoxInputField`
- `MultiSelectField`
- `RadioGroupField`
- `SelectField`
- `UploadField`
- `DropdownBox` → alias of `DropdownBoxField`

### Root-only app helpers

- `AlertBox`
- `AttachmentsPreview`
- `Avatar`
- `BaseSelect`
- `CalendarDatePicker`
- `CardBox`
- `CheckInHeatmap`
- `CopyableButton`
- `CustomBadge`
- `DotPattern`
- `DropDownButtons`
- `FlikeringGrid`
- `FormError`
- `FullScreenLoading`
- `gradientSeparator`
- `Help`
- `ImagePreview`
- `Loader`
- `LoadingSection`
- `ModalBox`
- `MultiStep`
- `NumberTicker`
- `OverviewBox`
- `Pagination`
- `PDFPreview`
- `Select`
- `SheetBox`
- `SubmitButton`
- `Tabs`
- `VerticalTabs`
- `WebcamImageUploader`
- `WizardCard`
- `WizardCompletion`

## High-signal shared types

| Export | Where it helps |
| --- | --- |
| `SelectOptions<T>` | Typed option arrays for select-based fields and helpers |
| `CloudStorageContextValue` | Typing your upload provider implementation |
| `UploadFileOptions` | Progress-aware upload callbacks |
| `TabNavItem` | Root `Tabs` and `VerticalTabs` configuration |
| `WizardItem` | `WizardCard` and route-like wizard entry lists |
| `AttachmentDto` | Uploads, previews, and webcam flows |
| `DateRangeYupSchema` | Yup validation for date range fields |

## Need help choosing?

- Building a form? Start with [Form fields](/components/form-fields).
- Building a dashboard card or page widget? Start with [Root components](/components/root-components).
- Building a custom layout from scratch? Start with [Primitives](/components/primitives).

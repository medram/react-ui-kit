# Root components

The root `@flowui/ui` entrypoint is the convenience layer. It mixes a small set of re-exported fields with app-ready components that already encode common dashboard patterns.

Use it when you want fewer imports and the component already matches your workflow.

::: tip Prefer subpaths for focused imports
If you already know you need charts, wizard helpers, primitives, or fields, importing from the dedicated subpath keeps intent clearer.
:::

## Fast examples

### Status messaging with `AlertBox`

```tsx
import { AlertBox } from "@flowui/ui"

export function BillingNotice() {
  return (
    <AlertBox
      type="warning"
      title="Card expiring soon"
      description="Update the payment method before the next invoice runs."
    />
  )
}
```

### Async forms with `SubmitButton`

```tsx
import { Form, Formik } from "formik"
import { InputField, SubmitButton } from "@flowui/ui"

export function InviteForm() {
  return (
    <Formik initialValues={{ email: "" }} onSubmit={sendInvite}>
      <Form className="space-y-4">
        <InputField name="email" label="Email" type="email" required />
        <SubmitButton title="Send invite" />
      </Form>
    </Formik>
  )
}
```

### Pagination with page-size control

```tsx
import { Pagination } from "@flowui/ui"

export function ResultsFooter() {
  return (
    <Pagination
      currentPage={2}
      totalCount={126}
      pageSize={20}
      onPageChange={(page) => console.log(page)}
      onPageSizeChange={(size) => console.log(size)}
    />
  )
}
```

## Re-exported form components

These are also available from `@flowui/ui/fields`.

| Export | Use it for |
| --- | --- |
| `BasicImageUploaderField` | Single-image uploads with preview and aspect ratio support. |
| `DatePickerField` | Single date input. |
| `DateRangePickerField` | From/to date ranges. |
| `InputField` | Standard text input. |
| `MultiCheckBoxInputField` | Small multi-select sets with checkboxes. |
| `MultiSelectField` | Larger list-based multi-selects. |
| `RadioGroupField` | Visible mutually exclusive choices. |
| `SelectField` | Formik-ready select dropdowns. |
| `UploadField` | Attachment uploads backed by cloud storage. |
| `DropdownBox` | Alias for `DropdownBoxField`. |

## Feedback and state helpers

| Export | Use it for |
| --- | --- |
| `AlertBox` | Friendly inline status boxes with `info`, `warning`, `error`, and `success` variants. |
| `FormError` | Shared form error message styling. |
| `Loader` | Small loading spinner component. |
| `LoadingSection` | Localized loading states inside a page section. |
| `FullScreenLoading` | Full-page loading overlay. |
| `SubmitButton` | Formik-aware submit button that swaps in a loader while submitting. |

## Navigation and layout helpers

| Export | Use it for |
| --- | --- |
| `ModalBox` | Simple dialog wrapper with optional trigger and footer. |
| `SheetBox` | Drawer-style side panel. |
| `Tabs` | URL-hash-aware top tabs with optional permission filtering. |
| `VerticalTabs` | Same concept as `Tabs`, but with a sidebar layout. |
| `Pagination` | Paged list navigation with page-size selector. |
| `MultiStep` | Lightweight progress rail for named steps. |
| `WizardCard` | Card-style entry point into a wizard screen or route. |
| `WizardCompletion` | End-of-flow success screen. |

### Example: root `Tabs`

```tsx
import { Tabs, type TabNavItem } from "@flowui/ui"

const items: TabNavItem[] = [
  { title: "Overview", hash: "#overview", component: <OverviewPanel /> },
  { title: "Members", hash: "#members", component: <MembersPanel /> },
]

export function ProjectTabs() {
  return <Tabs items={items} showTitleSeparator styleMode="link" />
}
```

## Data display helpers

| Export | Use it for |
| --- | --- |
| `AttachmentsPreview` | Attachment lists and previews. |
| `Avatar` | User avatar display wrapper. |
| `BaseSelect` | Light select wrapper with typed options and callbacks. |
| `CalendarDatePicker` | Rich calendar picker with range, month, and year controls. |
| `CardBox` | Styled card container for dashboard sections. |
| `CheckInHeatmap` | Check-in activity heatmap visualizations. |
| `CopyableButton` | Copy-to-clipboard actions. |
| `CustomBadge` | Themed badges for statuses and labels. |
| `Help` | Inline help affordance with tooltip behavior. |
| `ImagePreview` | Display uploaded or selected images. |
| `OverviewBox` | KPI and stat cards with change indicators. |
| `PDFPreview` | Embedded PDF document previewing. |
| `Select` | Non-Formik select wrapper with typed options. |
| `WebcamImageUploader` | Upload-or-capture image flow from the root barrel. |

### Example: `OverviewBox`

```tsx
import { OverviewBox } from "@flowui/ui"
import { DollarSign } from "lucide-react"

export function RevenueCard() {
  return (
    <OverviewBox
      title="MRR"
      value="$24,800"
      change={12.4}
      description="Compared with last month"
      icon={DollarSign}
      additionalInfo="Includes active subscriptions only."
    />
  )
}
```

## Action collections and decorative helpers

| Export | Use it for |
| --- | --- |
| `DropDownButtons` | Action menus with async handlers and loading states. |
| `DotPattern` | Decorative dotted background layers. |
| `FlikeringGrid` | Animated grid effects. |
| `gradientSeparator` | Visual separators with more flair than a plain divider. |
| `NumberTicker` | Animated numeric transitions. |

## How to choose between root helpers and subpaths

- Want the simplest, app-ready component? Start at the root barrel.
- Want low-level composition or stricter import boundaries? Use the dedicated subpath.
- Want predictable form behavior? Prefer `@flowui/ui/fields`.
- Want a workflow with providers and shared state? See [Workflows and providers](/components/workflows).

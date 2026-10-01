# Form fields

This package has two layers for form work:

1. **Formik-ready fields** in `@medram/react-ui-kit/fields`
2. **Raw inputs** for custom state management when you do not want Formik

::: warning Formik is required for most field components
`InputField`, `SelectField`, `UploadField`, `DatePickerField`, and the rest of the `*Field` components call `useField()` internally. They must render inside `<Formik>` and usually inside a `<Form>`.
:::

::: tip Upload components need app wiring
`UploadField`, `BasicImageUploaderField`, and `UploadInput` rely on `CloudStorageProvider`. Set that up once near the app root, then the upload fields work everywhere.
:::


::: info Recommended import pattern
For the docs in this repo, the preferred split is:

- field components from `@medram/react-ui-kit/fields`
- shared helpers such as `SubmitButton` from `@medram/react-ui-kit`

That keeps form-specific imports narrow without hiding app-ready helpers in the root barrel.
:::
## Fast starter example

```tsx
import { Form, Formik } from "formik"
import { SubmitButton } from "@medram/react-ui-kit"
import { InputField, SelectField, type SelectOptions } from "@medram/react-ui-kit/fields"
const roleOptions: SelectOptions<string>[] = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer", value: "viewer" },
]

export function UserForm() {
  return (
    <Formik
      initialValues={{ fullName: "", role: "viewer" }}
      onSubmit={async (values) => {
        console.log(values)
      }}
    >
      <Form className="space-y-4">
        <InputField name="fullName" label="Full name" required placeholder="Ada Lovelace" />
        <SelectField name="role" label="Role" options={roleOptions} />
        <SubmitButton title="Save user" />
      </Form>
    </Formik>
  )
}
```

## Text inputs

| Component | Best for | Notes |
| --- | --- | --- |
| `InputField` | Standard text, email, numeric, and token inputs | Extends normal HTML input attributes and adds label/help/error UI. |
| `TextAreaField` | Longer descriptions and notes | Multi-line input with the same Formik-friendly wrapper. |
| `CopyableInputField` | Read-only values that users copy often | Shows copy feedback without extra plumbing. |
| `SensitiveField` | Passwords, secrets, invite keys | Adds built-in show/hide behavior. |

### Example: secure credentials form

```tsx
<Formik initialValues={{ apiKey: "", password: "" }} onSubmit={saveSecrets}>
  <Form className="space-y-4">
    <CopyableInputField name="apiKey" label="Generated API key" help="Users can copy this after creation." />
    <SensitiveField name="password" label="Password" required />
    <SubmitButton title="Update credentials" />
  </Form>
</Formik>
```

## Selection inputs

| Component | Best for | Notes |
| --- | --- | --- |
| `SelectField` | Ordinary single-select choices | Generic over `string`, `number`, and `null`; exports `SelectOptions<T>`. |
| `ComboBoxField` | Searchable pickers with callbacks | Good when the option list is long and typing should filter it. |
| `RadioGroupField` | Few mutually exclusive options | Best when every option should stay visible. |
| `MultiSelectField` | Choose many items from a larger list | Supports search plus move-all controls. |
| `DropdownBoxField` | Menu-driven checkbox or radio selection | Root barrel alias: `DropdownBox`. |
| `SpecialSelectField` | Fully custom option rendering without Formik | Parent manages value and change handling. |

### Example: searchable assignment field

```tsx
<Formik initialValues={{ ownerId: "", watchers: [] }} onSubmit={saveAssignment}>
  <Form className="space-y-4">
    <ComboBoxField
      name="ownerId"
      label="Owner"
      availableItems={teamMembers}
      searchPlaceholder="Search teammates"
      selectPlaceholder="Choose an owner"
    />

    <MultiSelectField
      name="watchers"
      label="Watchers"
      availableItems={teamMembers}
      enableSearch
      enableMoveAll
    />

    <SubmitButton title="Assign" />
  </Form>
</Formik>
```

## Date and time inputs

| Component | Best for | Notes |
| --- | --- | --- |
| `DatePickerField` | Single date, optional time | Accepts `Date` or string-like values and supports `includingTime`. |
| `DateSelectorField` | Date selection with explicit month/year navigation | Useful when users jump across months or years often. |
| `DateTimePickerField` | Full date-time scheduling | Stores ISO 8601 values and accepts an optional IANA `timezone` for display and edits. |
| `DateRangePickerField` | Start/end date ranges | Uses a dual-month range picker by default. |
| `CalendarDatePickerField` | Date-range picking backed by `CalendarDatePicker` | Good when you want richer calendar controls. |
| `MonthYearPickerField` | Billing periods and reporting months | Stores a date built from month, year, and `defaultDay`. |
| `TimePickerField` | Time only | Stores `HH:mm` strings. |
| `TimeZoneSelectFiels` | Rich timezone selector | Wraps `react-timezone-select`. |
| `BasicTimeZonesSelectField` | Convenience alias for timezone selection | Thin wrapper around `TimeZoneSelectFiels`. |

### Example: scheduling controls

```tsx
<Formik
  initialValues={{
    meetingAt: "",
    coverage: { from: "", to: "" },
    timezone: "UTC",
  }}
  onSubmit={scheduleMeeting}
>
  <Form className="space-y-4">
    <DateTimePickerField
      name="meetingAt"
      label="Meeting time"
      timeFormat="24h"
      timezone="Africa/Casablanca"
    />
    <DateRangePickerField name="coverage" label="Coverage window" numberOfMonths={2} />
    <BasicTimeZonesSelectField name="timezone" label="Timezone" />
    <SubmitButton title="Schedule" />
  </Form>
</Formik>
```

### Timezone-aware date-time values

`DateTimePickerField` validates its optional `timezone` prop and otherwise uses the valid `NEXT_PUBLIC_APPLICATION_TIME_ZONE` environment value. The explicit prop takes precedence. With a resolved timezone, stored ISO values are displayed as wall-clock values in that zone; calendar and time edits are converted back to the same instant. Without a resolved timezone, the existing browser-local behavior remains unchanged.

## Boolean and multi-checkbox inputs

| Component | Best for | Notes |
| --- | --- | --- |
| `CheckBoxField` | Single boolean confirmation | Standard Formik checkbox with label and help text. |
| `CheckBoxInputThinField` | Reusable checkbox primitive | Unmanaged. Use when you want manual state control. |
| `MultiCheckBoxInputField` | Small fixed multi-select sets | Stores an array of selected IDs. |
| `SwitchField` | On/off settings | Supports `small`, `medium`, and `large` sizes. |

## Upload and image inputs

| Component | Best for | Notes |
| --- | --- | --- |
| `UploadField` | File uploads inside Formik | Stores attachment IDs and validates file counts. |
| `BasicImageUploaderField` | Single image with preview and aspect ratio control | Supports `rounded` and `flat` variants. |
| `UploadInput` | Raw upload UI without Formik | Good for custom state handling. |
| `DropZone` | Bare drag-and-drop file picking | Optional image compression support. |

### Example: avatar upload with provider setup

```tsx
import { CloudStorageProvider } from "@medram/react-ui-kit/cloud-storage"
import { BasicImageUploaderField, SubmitButton } from "@medram/react-ui-kit/fields"
import { Form, Formik } from "formik"

const cloudStorage = {
  uploadFile: async (file: File) => uploadViaApi(file),
  fetchAttachment: async (id: string) => fetchAttachment(id),
  deleteAttachment: async (id: string) => deleteAttachment(id),
}

export function ProfilePhotoForm() {
  return (
    <CloudStorageProvider value={cloudStorage}>
      <Formik initialValues={{ avatarId: "" }} onSubmit={saveProfile}>
        <Form className="space-y-4">
          <BasicImageUploaderField
            name="avatarId"
            label="Profile photo"
            aspectRatio="1:1"
            variant="rounded"
          />
          <SubmitButton title="Save photo" />
        </Form>
      </Formik>
    </CloudStorageProvider>
  )
}
```

## Raw input primitives for custom forms

Use these when Formik is not part of the screen.

| Component | Best for | Notes |
| --- | --- | --- |
| `SelectInput` | Manual select state | Mirrors the shape used by `SelectField`. |
| `ComboBox` | Searchable manual picker | Parent owns selected value and filtering callbacks. |
| `UploadInput` | Raw upload state | Still requires `CloudStorageProvider`. |
| `DropZone` | Lowest-level file drop surface | Good for custom upload flows. |
| `SpecialSelectField` | Custom-rendered option rows | No Formik integration. |

## Helpful exports

| Export | Use it when |
| --- | --- |
| `SelectOptions<T>` | You want typed select and combobox options. |
| `DateRangeYupSchema` | You need a starter Yup validator for range values. |
| `ALLOWED_ATTACHMENTS` | You want prebuilt file-type accept maps for uploads. |

## Pick the right field quickly

- Need validation + label + help text + Formik state? Use a `*Field` component.
- Need a custom workflow with local state? Start with `SelectInput`, `ComboBox`, or `DropZone`.
- Need uploads? Solve provider wiring first, then choose `UploadField` or `BasicImageUploaderField`.
- Need timezone-aware scheduling? Pair `DateTimePickerField` with `BasicTimeZonesSelectField`.

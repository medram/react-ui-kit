# Registry catalogue

Every visual API is a shadcn source-registry item. Install an item with:

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/<item>
```

The generated source lives under `@/components/ui/`. The command installs the exact upstream shadcn primitives declared by the item.

## Forms and inputs

`base-check-box-field`, `basic-image-uploader-field`, `basic-time-zones-field`, `calendar-date-picker-field`, `check-box-field`, `check-box-group-field`, `combo-box`, `combo-box-field`, `copyable-input-field`, `date-picker-field`, `date-range-field`, `date-field`, `date-time-field`, `drop-down-buttons`, `drop-zone`, `dropdown-box-field`, `input-field`, `month-year-picker-field`, `multi-select-field`, `radio-group-field`, `select-field`, `select-input`, `sensitive-field`, `special-select-field`, `switch-field`, `text-area-field`, `time-field`, `time-zone-field`, `upload-field`, `upload-input`.

Items ending in `-field` use Formik unless their reference explicitly says otherwise. Use the generated field reference to confirm its value shape. Upload items require `CloudStorageProvider`.

## Date-field calendar bounds

`date-field`, `date-picker-field`, `date-time-field`, and `date-range-field` expose the shadcn Calendar navigation props. Use `startMonth` and `endMonth` to bound the years available in the calendar dropdowns:

```tsx
<DateField
  name="birthDate"
  startMonth={new Date(1950, 0)}
  endMonth={new Date(2025, 11)}
  reverseYears
/>
```

They also accept `captionLayout`, `defaultMonth`, `month`, `onMonthChange`, and the other DayPicker customization props. `month-year-picker-field` provides equivalent year controls through `yearsRange`, `minYear`, `maxYear`, and `yearsOrder`. `calendar-date-picker` and `calendar-date-picker-field` support those year controls plus `startMonth` and `endMonth`.


## Timezone-aware date fields

`date-picker-field`, `date-field`, and `month-year-picker-field` accept an optional IANA `timezone` prop. When omitted, they use the valid `NEXT_PUBLIC_APPLICATION_TIME_ZONE` value; a valid explicit prop takes precedence. `date-picker-field` converts ISO instants to wall-clock values for the resolved zone, while `date-field` and `month-year-picker-field` preserve strict `YYYY-MM-DD` calendar values without UTC shifts.

See the individual field references for stored-value and callback details.

## Dashboard and display

`alert-box`, `attachments-preview`, `avatar`, `base-select`, `calendar-date-picker`, `card-box`, `check-in-heatmap`, `copy-button`, `custom-badge`, `form-error`, `full-screen-loading`, `help`, `image-preview`, `loader`, `loading-section`, `modal-box`, `multi-step`, `number-ticker`, `overview-box`, `pagination`, `pdf-preview`, `select`, `sheet-box`, `submit-button`, `tabs`, `vertical-tabs`, `wizard-card`, `wizard-completion`.

## Charts

`area-chart`, `bar-chart`, `line-charts`, `pie-chart`, `radar-chart`, and `stack-bar-chart` lazy-load their chart body and own their `Suspense` boundary. `area-chart` and `line-charts` accept `selectedOption` and `onOptionChange` as a real controlled pair.

## Workflows

`stacked-modals`, `base-wizard`, `wizard`, `image-upload-card`, `webcam-capture`, `webcam-image-uploader`, `webcam-image-upload-modal`, `time-picker`, and [table](./table).

- `stacked-modals` installs provider state and the `TriggerModal` button wrapper.
- `webcam-image-uploader` and `image-upload-card` require `CloudStorageProvider` only when they perform storage operations.
- `webcam-image-upload-modal` requires Formik, `stacked-modals`, and `CloudStorageProvider`.
- `wizard-completion` is routing-neutral; provide `onGoBack` when the host needs navigation. Next.js hosts can call `router.back()` from that callback when routing is needed.
- [Table reference](./table) documents `ColumnDef`, `generateColumnsDefinition`, filters, actions, and server pagination.

## Headless npm modules

```tsx
import { CloudStorageProvider, useCloudStorageContext, useCloudStorageOps } from "@medram/react-ui-kit/cloud-storage"
import type { AttachmentDto, WizardItem } from "@medram/react-ui-kit/types"
```

There is no npm root visual barrel and no primitive export.

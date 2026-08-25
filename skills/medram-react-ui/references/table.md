# Table

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/table
```

Run the command in the consuming React application after initializing shadcn with the Radix base:

The new API name is `hide`. `notAllowed` is still accepted only for backward compatibility; when both are provided, `hide` takes precedence.

```bash
pnpm dlx shadcn@latest init --base radix
```

The command installs one Medram registry item. The generated implementation is editable source under `components/ui/`. The underlying shadcn primitives are transitive dependencies of this item; they are not separate Medram table registry items or npm visual exports.

## Dependencies

- shadcn registry items: `button`, `checkbox`, `command`, `dropdown-menu`, `input`, `popover`, `select`, `separator`, `table`, `tooltip`
- Medram registry items: `calendar-date-picker`, `copy-button`
- npm packages: `@tanstack/react-table`, `lucide-react`, `react-day-picker`
- runtime prerequisites: none beyond the generated item dependencies

## What to import

```tsx
import { DataTable } from "@/components/ui/data-table"
import generateColumnsDefinition from "@/components/ui/data-table-columns"
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"
import { PaginatedDataTable } from "@/components/ui/paginated-data-table"
import type {
  DataTableProps,
  SearchFilter,
  TableAction,
  TableActions,
  TableMultiRowAction,
  TableRowAction,
} from "@/components/ui/data-table"
import type {
  PaginatedData,
  Pagination,
  PaginatedDataTableProps,
  TableActionsProps,
} from "@/components/ui/paginated-data-table"
import type { ColumnDefinitionsProps } from "@/components/ui/data-table-columns"
import type { FilterDef } from "@/components/ui/filters"
```

The other generated files are support modules for this single table item. They can be imported when a host needs a lower-level piece, but the supported installation surface is the `table` registry item.

## Choosing a table

- Use `DataTable` when all rows are already in the browser. It provides local sorting, filtering, pagination, selection, and column visibility.
- Use `PaginatedDataTable` when the host owns a paginated API response. It supports the same table UI while delegating page changes and external filters to callbacks.
- Use `generateColumnsDefinition` when the standard Medram column behavior is useful. Write `ColumnDef<TData>` values directly when a column needs completely custom TanStack behavior.

## `ColumnDef` usage

Both table components accept TanStack Table column definitions:

```tsx
import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

type User = {
  id: number
  name: string
  email: string
  active: boolean
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: false,
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (row.original.active ? "Active" : "Inactive"),
  },
]
```

`DataTable` and `PaginatedDataTable` pass the array directly to `useReactTable`, so normal TanStack `ColumnDef<TData>` options are available. Common fields are:

| Field | Purpose |
| --- | --- |
| `accessorKey` | Reads a property from each row and supplies the column id. Use the same key in filters. |
| `accessorFn` | Computes a value when the displayed value is not a direct property. Give the column an explicit `id`. |
| `id` | Stable column id, especially required with `accessorFn` or display-only columns. |
| `header` | Text, JSX, or a callback receiving the TanStack header context. |
| `cell` | Custom cell renderer receiving the TanStack cell context. |
| `enableSorting` | Enables or disables sorting for this column. |
| `enableHiding` | Enables or disables the View-column toggle for this column. |
| `enableColumnFilter` | Enables or disables column filtering. |
| `filterFn` | Defines how a local column filter compares values. |
| `meta` | Stores application-specific column metadata. |

For custom cells, use `row.original` for the complete row object and `row.getValue("key")` for the resolved column value.

## `generateColumnsDefinition`

`generateColumnsDefinition<TData>` returns `ColumnDef<TData>[]` and accepts:

```ts
type ColumnDefinitionsProps<TData> = {
  columnsDef: ColumnDefinition<TData>[]
  enableSelection?: boolean
  actions?: TableRowAction<TData>[]
}
```

### Top-level parameters

| Parameter | Type | Default | Behavior |
| --- | --- | --- | --- |
| `columnsDef` | `ColumnDefinition<TData>[]` | required | Describes the data columns. Blocked columns are removed. |
| `enableSelection` | `boolean` | `false` | Adds a select-all header checkbox and one checkbox per row. |
| `actions` | `TableRowAction<TData>[]` | `undefined` | Adds an actions column when at least one action is supplied. |

Each `columnsDef` entry accepts the normal `ColumnDef<TData>` fields except that it must also provide `accessorKey` and `title`. It adds these Medram-specific fields:

| Parameter | Type | Default | Behavior |
| --- | --- | --- | --- |
| `accessorKey` | `string` | required | Property read from the row. It is also the default filter key. |
| `title` | `string` | required | Header label passed to `DataTableColumnHeader`. |
| `cell` | `ColumnDef<TData>["cell"]` | `undefined` | Replaces the standard cell renderer with a custom TanStack cell. |
| `enableCopy` | `boolean` | `undefined` | Adds a copy button for non-empty, non-boolean displayed values. Cannot be used with a custom `cell`. |
| `hide` | `boolean \| (() => boolean)` | `false` | Removes the column when true. The callback receives no arguments, so close over permissions or feature flags. |
| `notAllowed` | `boolean \| (() => boolean)` | compatibility only | Legacy alias for `hide`. It is used only when `hide` is `undefined`. |

The helper's default cell behavior is:

- Boolean values render as green check or orange cross icons.
- `null`, `undefined`, and empty strings render as `-`.
- `enableCopy: true` adds the generated `copy-button` beside stringified values.
- Other `ColumnDef` options are preserved.

### `generateColumnsDefinition` example

```tsx
import { Eye, Trash2 } from "lucide-react"
import generateColumnsDefinition from "@/components/ui/data-table-columns"

type User = {
  id: number
  name: string
  email: string
  active: boolean
  createdAt: string
  internalNotes: string
}

const canViewNotes = false

const columns = generateColumnsDefinition<User>({
  columnsDef: [
    {
      accessorKey: "name",
      title: "Name",
      enableCopy: true,
    },
    {
      accessorKey: "email",
      title: "Email",
      enableCopy: true,
    },
    {
      accessorKey: "active",
      title: "Status",
    },
    {
      accessorKey: "createdAt",
      title: "Created",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      accessorKey: "internalNotes",
      title: "Notes",
      hide: !canViewNotes,
    },
  ],
  enableSelection: true,
  actions: [
    {
      label: "View",
      Icon: Eye,
      clickHandler: (row) => {
        window.location.href = `/users/${row.original.id}`
      },
    },
    {
      label: "Delete",
      Icon: Trash2,
      hide: ({ row }) => row.original.id === 1,
      clickHandler: async (row) => {
        await deleteUser(row.original.id)
      },
    },
  ],
})
```

`TableRowAction` has these parameters:

| Parameter | Type | Behavior |
| --- | --- | --- |
| `label` | `string` | Menu label. It is also the action key in the rendered list. |
| `clickHandler` | `(row: Row<TData>) => void \| Promise<void>` | Runs for one TanStack row. `row.original` is the original data object. |
| `Icon` | `ComponentType<{ className?: string }>` | Optional icon component. Note the uppercase property name. |
| `hide` | `boolean \| ((args: { row: Row<TData> }) => boolean)` | Hides the action when true. |
| `notAllowed` | `boolean \| ((args: { row: Row<TData> }) => boolean)` | compatibility only; legacy alias for `hide`. |
| `hidden` | `boolean \| ((args: { row: Row<TData> }) => boolean)` | Hides the action without treating it as a permission failure. |

## `DataTable` API

```ts
type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  multiRowActions?: TableMultiRowAction<TData>[]
  searchFilter?: SearchFilter
  filtersDef?: FilterDef[]
  resetFilters?: () => void
  tableActions?: TableActions
  className?: string
  tableRowClassName?: string | ((row: TData) => string)
  tableCellClassName?: string
  rowLinkClassName?: string
  onRowClick?: (row: Row<TData>) => void
  onRowLinkClick?: (row: Row<TData>) => string
  hidePagination?: boolean
  isFetching?: boolean
}
```

| Parameter | Type | Default | Behavior |
| --- | --- | --- | --- |
| `columns` | `ColumnDef<TData, TValue>[]` | required | TanStack column definitions. |
| `data` | `TData[]` | required | All rows rendered and paginated in the browser. |
| `multiRowActions` | `TableMultiRowAction<TData>[]` | `undefined` | Actions shown for selected rows. Selection is enabled by the table. |
| `searchFilter` | `SearchFilter` | `undefined` | Adds one debounced text search input. |
| `filtersDef` | `FilterDef[]` | `undefined` | Adds text, select, and date filters to the toolbar. |
| `resetFilters` | `() => void` | `undefined` | Host callback invoked by the Reset button. |
| `tableActions` | `TableActions` | `undefined` | Adds a dropdown or inline action group. |
| `className` | `string` | `undefined` | Extra classes for the scrollable table container. |
| `tableRowClassName` | `string \| ((row: TData) => string)` | `undefined` | Static or per-row classes. |
| `tableCellClassName` | `string` | `undefined` | Extra classes on every data cell. |
| `rowLinkClassName` | `string` | `undefined` | Classes on anchors generated by `onRowLinkClick`. |
| `onRowClick` | `(row: Row<TData>) => void` | `undefined` | Runs when a row is clicked. Read data through `row.original`. |
| `onRowLinkClick` | `(row: Row<TData>) => string` | `undefined` | Returns an `href`; each cell is wrapped in a normal `<a>`. |
| `hidePagination` | `boolean` | `false` | Hides the local pagination controls. |
| `isFetching` | `boolean` | `false` | Shows the fetching indicator and sets `aria-busy`. |

### `SearchFilter`

`searchFilter` adds one text input to the toolbar:

```ts
type SearchFilter = {
  accessorKey: string
  placeholder?: string
  onChangeHandler?: (value: string) => void
}
```

| Parameter | Type | Default | Behavior |
| --- | --- | --- | --- |
| `accessorKey` | `string` | required | Local column id used when no external callback is provided. |
| `placeholder` | `string` | `Search by {accessorKey}...` | Input placeholder. |
| `onChangeHandler` | `(value: string) => void` | `undefined` | Host callback. It receives an empty string when the input is cleared. |

The built-in search input uses a 300 ms debounce. Use `filtersDef` when the debounce duration or filter type must be configurable.

### Basic `DataTable` example

```tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"

type Invoice = {
  id: string
  customer: string
  total: number
}

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: "customer", header: "Customer" },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
  },
]

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  return <DataTable columns={columns} data={invoices} />
}
```

## `PaginatedDataTable` API

`PaginatedDataTable` accepts the `DataTableProps` options except `data` and adds the server-pagination contract:

```ts
type PaginatedData<TData> = {
  results: TData[]
  count: number
  page_size: number
}

type Pagination = {
  page: number
  page_size: number
  setPage: (value: number) => void
  setPageSize: (value: number) => void
  query: string
}

type PaginatedDataTableProps<TData, TValue> = Omit<DataTableProps<TData, TValue>, "data"> & {
  paginatedData: PaginatedData<TData>
  pagination?: Pagination
  filtersDef?: FilterDef[]
  resetFilters?: () => void
  onFilterChange?: (filters: Record<string, unknown>) => void
  isLoading?: boolean
  isFetching?: boolean
  multiRowActions?: TableMultiRowAction<TData>[]
  tableActions?: TableActions
  displayPaginationUI?: boolean
}
```

| Parameter | Type | Default | Behavior |
| --- | --- | --- | --- |
| `paginatedData` | `PaginatedData<TData>` | required | Current API page and total count. |
| `paginatedData.results` | `TData[]` | required | Rows for the current page. |
| `paginatedData.count` | `number` | required | Total rows across all server pages. |
| `paginatedData.page_size` | `number` | required | Rows per server page; used to calculate page count. |
| `pagination` | `Pagination` | `undefined` | Enables manual server pagination. `page` is 1-based. |
| `pagination.page` | `number` | required | Current 1-based page. |
| `pagination.page_size` | `number` | required | Current page size. |
| `pagination.setPage` | `(value: number) => void` | required | Called when the user changes page. |
| `pagination.setPageSize` | `(value: number) => void` | required | Called when the user selects a page size. |
| `pagination.query` | `string` | required | Host-owned query state. The table keeps it in the contract but does not parse it. |
| `onFilterChange` | `(filters: Record<string, unknown>) => void` | `undefined` | Receives local column filters as `{ [columnId]: String(value) }`. |
| `isLoading` | `boolean` | `false` | Shows a blocking loading overlay and suppresses empty-state rendering. |
| `isFetching` | `boolean` | `false` | Shows a non-blocking fetching indicator. |
| `displayPaginationUI` | `boolean` | `true` | Enables pagination controls when `pagination` is also supplied. |

All inherited props keep the same behavior as `DataTable`, including `columns`, `searchFilter`, `filtersDef`, `tableActions`, row callbacks, class names, and row actions.

### Server-paginated example

```tsx
"use client"

import { useState } from "react"
import { PaginatedDataTable } from "@/components/ui/paginated-data-table"
import type { FilterDef } from "@/components/ui/filters"

type User = {
  id: number
  name: string
  status: "active" | "disabled"
}

const filters: FilterDef[] = [
  {
    type: "text",
    accessorKey: "name",
    title: "Name",
    placeHolder: "Search by name...",
    debounce: 500,
  },
  {
    type: "select",
    accessorKey: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Disabled", value: "disabled" },
    ],
  },
]

export function UsersTable({ pageData }: { pageData: { results: User[]; count: number } }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  return (
    <PaginatedDataTable
      columns={columns}
      paginatedData={{ results: pageData.results, count: pageData.count, page_size: pageSize }}
      pagination={{
        page,
        page_size: pageSize,
        query: "",
        setPage,
        setPageSize: (nextPageSize) => {
          setPage(1)
          setPageSize(nextPageSize)
        },
      }}
      filtersDef={filters}
      isFetching={false}
      displayPaginationUI
    />
  )
}
```

When the page or page size changes, call the API from the host state setters or the hook that owns them. The component does not fetch data itself.

## `FilterDef`

`filtersDef` accepts an array of these definitions:

```ts
type FilterDef = {
  type: "text" | "select" | "date"
  accessorKey: string
  title: string
  defaultValue?: string
  defaultDateRange?: DateRange
  hide?: boolean | (() => boolean)
  /** @deprecated Use `hide` instead. */
  notAllowed?: boolean | (() => boolean)
  placeHolder?: string
  tooltip?: string
  options?: { label: string; value: string }[]
  onChange?: (value: string | null) => void
  onDateSelectChange?: (date: DateRange) => void
  debounce?: number
  numberOfMonths?: 1 | 2
  classNames?: Partial<ClassNames>
  yearsRange?: number
  yearsOrder?: "asc" | "desc"
  minYear?: number
  maxYear?: number
  preventFuture?: boolean
  defaultToCurrentMonthYear?: boolean
}
```

| Parameter | Behavior |
| --- | --- |
| `type` | `text` renders a debounced input; `select` renders a searchable faceted filter; `date` renders the Medram calendar range picker. |
| `accessorKey` | Local TanStack column id, and the key used by external filter callbacks. |
| `title` | Filter label and select search placeholder. |
| `defaultValue` | Initial text/select value. |
| `defaultDateRange` | Initial `react-day-picker` `DateRange` value. |
| `hide` | Removes the filter when true; a callback receives no arguments. |
| `notAllowed` | compatibility only; legacy alias for `hide`, used when `hide` is `undefined`. |
| `placeHolder` | Input or date-picker placeholder. The spelling is intentionally `placeHolder`. |
| `tooltip` | Optional tooltip for a text filter. |
| `options` | Select choices with `label` and `value`. |
| `onChange` | External text/select callback. Receives the selected string or `null`; when supplied, the host owns the external filter state. |
| `onDateSelectChange` | External date callback receiving a `DateRange` with optional `from` and `to` dates. |
| `debounce` | Delay in milliseconds for text input and externally controlled select changes. |
| `numberOfMonths` | Date picker display size: `1` or `2`; defaults to `2`. |
| `classNames` | Partial `react-day-picker` class-name overrides. |
| `yearsRange` | Year range used by the date picker. |
| `yearsOrder` | Date-picker year order: `"asc"` or `"desc"`. |
| `minYear` / `maxYear` | Date-picker year bounds. |
| `preventFuture` | Prevents selecting future dates. |
| `defaultToCurrentMonthYear` | Starts the date range on today when no default date range is supplied. |

### External filter example

```tsx
const filtersDef: FilterDef[] = [
  {
    type: "text",
    accessorKey: "q",
    title: "Search",
    defaultValue: query.q ?? undefined,
    debounce: 500,
    onChange: (value) => setQuery((current) => ({ ...current, q: value })),
  },
  {
    type: "date",
    accessorKey: "created_at",
    title: "Created",
    numberOfMonths: 1,
    defaultDateRange: { from: startDate, to: endDate },
    onDateSelectChange: ({ from, to }) => {
      setQuery((current) => ({
        ...current,
        start: from ? from.toISOString().slice(0, 10) : null,
        end: to ? to.toISOString().slice(0, 10) : null,
      }))
    },
  },
]
```

If a filter does not provide `onChange`, the table updates its local TanStack column filter. In `PaginatedDataTable`, `onFilterChange` can observe those local filters. If a filter provides `onChange`, the host callback is responsible for updating the API query.

## Actions

### Multi-row actions

```ts
type TableMultiRowAction<TData> = {
  label: string
  clickHandler: (rows: Row<TData>[]) => void | Promise<void>
  Icon?: ComponentType<{ className?: string }>
  hide?: boolean
  /** @deprecated Use `hide` instead. */
  notAllowed?: boolean
}
```

`clickHandler` receives the selected TanStack rows. Use `row.original` for each data object:

```tsx
const multiRowActions: TableMultiRowAction<User>[] = [
  {
    label: "Disable selected",
    clickHandler: async (rows) => {
      await disableUsers(rows.map((row) => row.original.id))
    },
  },
]
```

### Toolbar actions

```ts
type TableAction = {
  label: string
  handler?: () => void | Promise<void>
  icon?: ComponentType<{ className?: string }>
  hidden?: boolean
  className?: string
}

type TableActionsOptions = {
  label?: string
  icon?: ComponentType<{ className?: string }>
  style?: "dropdown" | "inline"
}

type TableActions = {
  options?: TableActionsOptions
  actions: TableAction[]
}
```

Example:

```tsx
const tableActions: TableActions = {
  options: {
    label: "Export",
    style: "dropdown",
  },
  actions: [
    {
      label: "CSV",
      handler: () => exportUsers("csv"),
      hidden: !canExport,
    },
    {
      label: "Excel",
      handler: async () => {
        await exportUsers("xlsx")
      },
    },
  ],
}
```

`style` defaults to `"dropdown"`; `"inline"` renders one button per visible action. Async actions show a loading state while they are running. `TableActionsProps` exported from `paginated-data-table.tsx` is an alias of `TableActions`.

## Standalone faceted filter

When a host needs a filter outside the table toolbar:

```tsx
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"

<DataTableFacetedFilter
  title="Status"
  options={[
    { label: "Active", value: "active" },
    { label: "Disabled", value: "disabled" },
  ]}
  value={status}
  onChange={setStatus}
/>
```

Parameters:

| Parameter | Type | Behavior |
| --- | --- | --- |
| `title` | `string` | Button label and command search placeholder. |
| `options` | `{ label: string; value: string; icon?: ComponentType<{ className?: string }> }[]` | Choices rendered by the searchable command menu. |
| `value` | `string \| null` | Currently selected value. |
| `onChange` | `(value: string \| null) => void` | Receives the selected value or `null` when cleared. |

## Framework boundary and common pitfalls

- The generated table sources are client components. In a Next App Router host, keep table usage in a client component when the host owns state, callbacks, or browser APIs.
- `onRowClick` and row actions receive TanStack `Row<TData>` objects, not raw data. Use `row.original`.
- `onRowLinkClick` creates normal anchors. Keep SPA routing decisions in the host or replace the generated link behavior locally.
- `Pagination.page` is 1-based, while TanStack's internal page index is 0-based.
- `enableCopy` and a custom `cell` are mutually exclusive in `generateColumnsDefinition`.
- `filter.onChange` is for host-owned external filtering. Without it, filters update local TanStack state.
- The generated item expects the consumer's normal shadcn aliases, especially `@/components/ui` and `@/lib/utils`.
- The package intentionally does not export visual table components from npm. Install the source registry item and edit the generated files in the application.

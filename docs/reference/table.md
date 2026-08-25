# Table

The Medram table is installed as one editable shadcn source-registry item. It includes the data table, server-pagination wrapper, filters, sorting headers, selection, column visibility, row actions, and toolbar actions.

## Install

Initialize shadcn with the Radix base, then add the table item:

The new API name is `hide`. `notAllowed` is still accepted only for backward compatibility; when both are provided, `hide` takes precedence.

```bash
pnpm dlx shadcn@latest init --base radix
pnpm dlx shadcn@latest add medram/react-ui-kit/table
```

The generated source is placed under `components/ui/`. The table item installs the upstream shadcn primitives it needs; those primitives are dependencies, not separate Medram table items.

## Imports

```tsx
import { DataTable } from "@/components/ui/data-table"
import generateColumnsDefinition from "@/components/ui/data-table-columns"
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"
import { PaginatedDataTable } from "@/components/ui/paginated-data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { FilterDef } from "@/components/ui/filters"
```

Use `DataTable` for rows already loaded in the browser. Use `PaginatedDataTable` when the host owns a server response with `results`, `count`, and `page_size`.

## Column definitions

Both components accept TanStack Table `ColumnDef` values. The most common fields are:

| Field | Use |
| --- | --- |
| `accessorKey` | Reads a property from each row and supplies the column id. |
| `accessorFn` | Computes a value; provide an explicit `id` when using it. |
| `id` | Stable id for computed or display-only columns. |
| `header` | Text, JSX, or a header callback. |
| `cell` | Custom cell callback. Use `row.original` for the complete row. |
| `enableSorting` | Enables or disables sorting. |
| `enableHiding` | Enables or disables the View-column toggle. |
| `enableColumnFilter` | Enables or disables local column filtering. |
| `filterFn` | Defines local filter behavior. |
| `meta` | Stores host-defined column metadata. |

Example using `ColumnDef` directly:

```tsx
import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

type Invoice = {
  id: string
  customer: string
  total: number
  paid: boolean
}

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "customer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
  },
  {
    accessorKey: "paid",
    header: "Paid",
    cell: ({ row }) => (row.original.paid ? "Yes" : "No"),
  },
]
```

`ColumnDef<TData>` is passed directly to `@tanstack/react-table`, so other TanStack column options remain available.

## `generateColumnsDefinition`

`generateColumnsDefinition<TData>` is an optional helper for the standard Medram table behavior:

- selection checkboxes
- sortable column headers
- boolean check/cross rendering
- empty values rendered as `-`
- copy buttons for string values
- row action menus
- permission-based column hiding

### Parameters

```ts
type ColumnDefinitionsProps<TData> = {
  columnsDef: ColumnDefinition<TData>[]
  enableSelection?: boolean
  actions?: TableRowAction<TData>[]
}
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `columnsDef` | `ColumnDefinition<TData>[]` | required | Data columns. Each entry requires `accessorKey` and `title`. |
| `enableSelection` | `boolean` | `false` | Adds select-all and per-row checkboxes. |
| `actions` | `TableRowAction<TData>[]` | `undefined` | Adds a row action column when non-empty. |

Each `columnsDef` entry accepts the normal `ColumnDef<TData>` fields plus:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `accessorKey` | `string` | required | Row property used by the column. |
| `title` | `string` | required | Header text passed to the sortable header helper. |
| `cell` | `ColumnDef<TData>["cell"]` | `undefined` | Custom cell renderer. |
| `enableCopy` | `boolean` | `undefined` | Adds a copy button for non-empty displayed values. Cannot be combined with `cell`. |
| `hide` | `boolean \| (() => boolean)` | `false` | Removes the column when true. The callback receives no arguments. |
| `notAllowed` | `boolean \| (() => boolean)` | compatibility only | Legacy alias for `hide`. It is used only when `hide` is `undefined`. |

Example:

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
    { accessorKey: "name", title: "Name", enableCopy: true },
    { accessorKey: "email", title: "Email", enableCopy: true },
    { accessorKey: "active", title: "Status" },
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

### Row action parameters

```ts
type TableRowAction<TData> = {
  label: string
  clickHandler: (row: Row<TData>) => void | Promise<void>
  Icon?: ComponentType<{ className?: string }>
  hide?: boolean | ((args: { row: Row<TData> }) => boolean)
  /** @deprecated Use `hide` instead. */
  notAllowed?: boolean | ((args: { row: Row<TData> }) => boolean)
  hidden?: boolean | ((args: { row: Row<TData> }) => boolean)
}
```

`clickHandler` receives a TanStack `Row<TData>`. Read the original object with `row.original`. `Icon` is intentionally uppercase; toolbar actions use lowercase `icon`.

## `DataTable` props

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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `ColumnDef<TData, TValue>[]` | required | TanStack column definitions. |
| `data` | `TData[]` | required | All rows available for local table operations. |
| `multiRowActions` | `TableMultiRowAction<TData>[]` | `undefined` | Actions for selected rows. |
| `searchFilter` | `SearchFilter` | `undefined` | Adds one debounced search input. |
| `filtersDef` | `FilterDef[]` | `undefined` | Adds text, select, and date filters. |
| `resetFilters` | `() => void` | `undefined` | Host callback invoked by Reset. |
| `tableActions` | `TableActions` | `undefined` | Adds dropdown or inline toolbar actions. |
| `className` | `string` | `undefined` | Extra classes on the scrollable table container. |
| `tableRowClassName` | `string \| ((row: TData) => string)` | `undefined` | Static or per-row classes. |
| `tableCellClassName` | `string` | `undefined` | Extra classes on every data cell. |
| `rowLinkClassName` | `string` | `undefined` | Classes on generated row-link anchors. |
| `onRowClick` | `(row: Row<TData>) => void` | `undefined` | Called when a row is clicked. |
| `onRowLinkClick` | `(row: Row<TData>) => string` | `undefined` | Returns an `href`; each cell is wrapped in a normal anchor. |
| `hidePagination` | `boolean` | `false` | Hides local pagination controls. |
| `isFetching` | `boolean` | `false` | Shows a non-blocking fetching indicator and sets `aria-busy`. |

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

### Basic example

```tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"

type Customer = { id: number; name: string; email: string }

const columns: ColumnDef<Customer>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
]

export function CustomerTable({ rows }: { rows: Customer[] }) {
  return <DataTable columns={columns} data={rows} />
}
```

## `PaginatedDataTable` props

`PaginatedDataTable` accepts the `DataTable` options except `data` and adds:

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
```

| Prop or field | Type | Default | Description |
| --- | --- | --- | --- |
| `paginatedData` | `PaginatedData<TData>` | required | Current API response. |
| `paginatedData.results` | `TData[]` | required | Rows on the current page. |
| `paginatedData.count` | `number` | required | Total rows across all pages. |
| `paginatedData.page_size` | `number` | required | Rows per page; used to calculate page count. |
| `pagination` | `Pagination` | `undefined` | Enables manual server pagination. |
| `pagination.page` | `number` | required | Current 1-based page. |
| `pagination.page_size` | `number` | required | Current page size. |
| `pagination.setPage` | `(value: number) => void` | required | Called when the user changes page. |
| `pagination.setPageSize` | `(value: number) => void` | required | Called when the user changes page size. |
| `pagination.query` | `string` | required | Host-owned query value; the table does not parse it. |
| `onFilterChange` | `(filters: Record<string, unknown>) => void` | `undefined` | Receives local filters as `{ [columnId]: String(value) }`. |
| `isLoading` | `boolean` | `false` | Shows a blocking overlay and hides the empty state. |
| `isFetching` | `boolean` | `false` | Shows a non-blocking fetching indicator. |
| `displayPaginationUI` | `boolean` | `true` | Shows pagination controls when `pagination` is supplied. |

All `DataTable` props remain available, including `columns`, `searchFilter`, `filtersDef`, `tableActions`, row callbacks, and class names.

### Server pagination example

```tsx
"use client"

import { useState } from "react"
import { PaginatedDataTable } from "@/components/ui/paginated-data-table"
import type { FilterDef } from "@/components/ui/filters"

type User = { id: number; name: string; status: "active" | "disabled" }

const filtersDef: FilterDef[] = [
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
      filtersDef={filtersDef}
    />
  )
}
```

The component does not fetch data. The host must reload `paginatedData` when `setPage` or `setPageSize` is called.

## Filters

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

| Field | Description |
| --- | --- |
| `type` | `text`, `select`, or `date`. |
| `accessorKey` | Local column id and external filter key. |
| `title` | Label and select search placeholder. |
| `defaultValue` | Initial text/select value. |
| `defaultDateRange` | Initial `react-day-picker` `DateRange`. |
| `hide` | Removes the filter when true; callback receives no arguments. |
| `notAllowed` | compatibility only; legacy alias for `hide`, used when `hide` is `undefined`. |
| `placeHolder` | Input/date placeholder. The capital `H` is part of the API. |
| `tooltip` | Optional tooltip for text filters. |
| `options` | Select choices with `label` and `value`. |
| `onChange` | Host callback for external text/select filtering; receives a string or `null`. |
| `onDateSelectChange` | Host callback for date filtering; receives a `DateRange`. |
| `debounce` | Delay in milliseconds for text and external select changes. |
| `numberOfMonths` | Date-picker display size, `1` or `2`; defaults to `2`. |
| `classNames` | Partial `react-day-picker` class-name overrides. |
| `yearsRange` | Date-picker year range. |
| `yearsOrder` | Date-picker year order, `"asc"` or `"desc"`. |
| `minYear` / `maxYear` | Date-picker year bounds. |
| `preventFuture` | Prevents future-date selection. |
| `defaultToCurrentMonthYear` | Uses today as the initial date when no range is supplied. |

Example with host-owned filters:

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

Without `onChange`, text/select filters update local TanStack column filters. With `onChange`, the host owns the external query. `PaginatedDataTable` reports local filters through `onFilterChange`.

## Toolbar and row actions

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

```tsx
const tableActions: TableActions = {
  options: { label: "Export", style: "dropdown" },
  actions: [
    { label: "CSV", handler: () => exportUsers("csv") },
    { label: "Excel", handler: async () => exportUsers("xlsx"), hidden: !canExport },
  ],
}
```

`style` defaults to `"dropdown"`; `"inline"` renders one button per visible action. Async actions display a loading state while running. `TableActionsProps` from `paginated-data-table.tsx` is an alias of `TableActions`.

### Standalone faceted filter

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

Props:

| Prop | Type | Description |
| --- | --- | --- |
| `title` | `string` | Button label and search placeholder. |
| `options` | `{ label: string; value: string; icon?: ComponentType<{ className?: string }> }[]` | Searchable choices. |
| `value` | `string \| null` | Current selected value. |
| `onChange` | `(value: string \| null) => void` | Selected value or `null` when cleared. |

## Common notes

- Generated table sources are client components because they own state and event handlers.
- `onRowClick` and row actions receive TanStack rows. Use `row.original`.
- `onRowLinkClick` renders normal anchors. Keep SPA routing in the host.
- `Pagination.page` is 1-based; TanStack's internal page index is 0-based.
- `enableCopy` cannot be combined with a custom `cell` in `generateColumnsDefinition`.
- The table does not fetch data. The host owns API requests, query state, and pagination state.
- The package does not export visual table components from npm. Install and customize the generated shadcn source.

# Composition patterns

Use the narrowest public entrypoint whose complete workflow matches. All examples assume `@medram/react-ui-kit/styles.css` and the Tailwind preset/content scan are already configured. In Next.js, make these client components when they own hooks, Formik, callbacks, or interactive package surfaces.

## Formik form with typed select and submit state

**Prerequisites:** `formik` is installed. `InputField`, `SelectField`, and every `*Field` render below the owning `<Formik>`. `SubmitButton` comes from the root, not `/fields`.

```tsx
"use client"

import { SubmitButton } from "@medram/react-ui-kit"
import { InputField, SelectField, type SelectOptions } from "@medram/react-ui-kit/fields"
import { Form, Formik } from "formik"

const roleOptions: SelectOptions<string>[] = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer", value: "viewer" },
]

type UserValues = {
  fullName: string
  role: string
}

export function UserForm() {
  return (
    <Formik<UserValues>
      initialValues={{ fullName: "", role: "viewer" }}
      onSubmit={async (values) => {
        await saveUser(values)
      }}
    >
      <Form className="space-y-4">
        <InputField name="fullName" label="Full name" required />
        <SelectField name="role" label="Role" options={roleOptions} />
        <SubmitButton title="Save user" />
      </Form>
    </Formik>
  )
}
```

**Value/output:** submits `{ fullName: string, role: "admin" | "editor" | "viewer" }`. `SubmitButton` observes Formik `isSubmitting` and replaces its label with a loader while `onSubmit` is pending. A field name absent from `initialValues` is a form-model defect.

## Raw state and custom upload UI

**Prerequisites:** do not introduce Formik only to use a field. `UploadInput` still requires a cloud-storage provider and attachment peers.

```tsx
"use client"

import {
  CloudStorageProvider,
  type CloudStorageContextValue,
} from "@medram/react-ui-kit/cloud-storage"
import {
  ComboBox,
  DropZone,
  SelectInput,
  UploadInput,
  type SelectOptions,
} from "@medram/react-ui-kit/fields"
import { useState } from "react"

const statusOptions: SelectOptions<string>[] = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
]

const storage: CloudStorageContextValue = {
  uploadFile: uploadAttachment,
  fetchAttachment,
  deleteAttachment,
}

export function AssetControls() {
  const [status, setStatus] = useState("draft")
  const [owner, setOwner] = useState<string | null>(null)

  return (
    <CloudStorageProvider value={storage}>
      <SelectInput options={statusOptions} value={status} onChange={setStatus} />
      <ComboBox value={owner} availableItems={teamMembers} onChange={setOwner} />
      <UploadInput
        multiple
        onUploadComplete={(attachments) => saveAttachmentIds(attachments.map(({ id }) => id))}
      />
      <DropZone onUpload={({ files }) => inspectFiles(files)} />
    </CloudStorageProvider>
  )
}
```

**Value/output:** the host owns `status`, `owner`, raw `File[]`, and any attachment IDs. Use `SelectInput`, `ComboBox`, `UploadInput`, or `DropZone` instead of forcing a `*Field` into local state. Use `SpecialSelectField` for custom option rendering; it is also raw, despite its name.

## Accessible primitive composition

**Prerequisites:** use the full primitive compound family. Supply the Radix peers used by the primitive and make the component a client child when it owns state.

```tsx
"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@medram/react-ui-kit/primitives"

export function ProjectControls() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-name">Project name</Label>
        <Input id="project-name" name="projectName" />
      </div>

      <Select defaultValue="draft">
        <SelectTrigger aria-label="Project status">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete project</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
```

**Value/output:** the label targets `project-name`, select values are stable strings, and deletion has an explicit cancellation route. Use `asChild` to compose an existing interactive child; never nest a `Button` inside another interactive trigger.

## Root helpers versus primitive tabs

**Prerequisites:** use root tabs only when URL hash and optional permission-aware navigation are required. Use primitive tabs for normal controlled/uncontrolled tab state.

```tsx
"use client"

import { Tabs, type TabNavItem } from "@medram/react-ui-kit"

const projectTabs: TabNavItem[] = [
  { title: "Overview", hash: "#overview", component: <OverviewPanel /> },
  { title: "Members", hash: "#members", component: <MembersPanel /> },
]

export function ProjectTabs() {
  return <Tabs items={projectTabs} showTitleSeparator styleMode="link" />
}
```

```tsx
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@medram/react-ui-kit/primitives"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileSettings />
      </TabsContent>
      <TabsContent value="security">
        <SecuritySettings />
      </TabsContent>
    </Tabs>
  )
}
```

**Value/output:** root tabs own hash/permission-aware navigation over `TabNavItem[]`. Primitive tabs own only conventional tab selection. Do not import the root just for convenience when the primitive is the actual contract.

## Dashboard chart card

**Prerequisites:** install `recharts`, configure token styles/Tailwind, and render from a client boundary. Normal chart wrappers already own `Suspense`.

```tsx
"use client"

import { AreaChart } from "@medram/react-ui-kit/charts"

const monthlyRevenue = [
  {
    label: "Revenue",
    suffix: "$",
    data: [
      { month: "Jan", total: 1200 },
      { month: "Feb", total: 1750 },
      { month: "Mar", total: 1680 },
    ],
  },
]

export function RevenueCard() {
  return (
    <AreaChart
      data={monthlyRevenue}
      headerTitle="Monthly revenue"
      headerDescription="Jan–Mar"
      gradientArea
      showSummary
    />
  )
}
```

**Value/output:** the area-series shape is `{ label, suffix?, data }`; the first row key (`month`) is the axis and `total` is the stable series accessor. Use one logical story per card. For bar/stack charts, each series `accessorKey` must exactly match a key in every corresponding data row. Use built-in dataset selectors by supplying multiple logical groups; do not stack unrelated charts or add redundant consumer `Suspense`.

Use named `/charts` imports. `AreaChart` and `LineCharts` take `data`; `BarChart` and `StackBarChart` take `bars`; `PieChart` takes `pies`; `RadarChart` takes `data`.

# Providers and workflows

Mount context-backed package workflows in a client component. Put server-side data fetching and request preparation above that boundary, then inject the resulting host adapter or serializable props below it.

## Cloud storage adapter

`CloudStorageProvider` bridges host HTTP/auth code into package upload components. Mount one near the client app root; the package owns the interface, while the host owns endpoints, credentials, retries, and telemetry.

```tsx
"use client"

import {
  CloudStorageProvider,
  type CloudStorageContextValue,
} from "@medram/react-ui-kit/cloud-storage"

const storage: CloudStorageContextValue = {
  uploadFile: async (file, options) => {
    return uploadViaHostApi(file, options)
  },
  fetchAttachment: async (id) => {
    return getAttachmentViaHostApi(id)
  },
  deleteAttachment: async (id) => {
    await deleteAttachmentViaHostApi(id)
  },
  onError: (error) => {
    reportUploadError(error)
  },
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <CloudStorageProvider value={storage}>{children}</CloudStorageProvider>
}
```

The adapter signatures are exact:

```ts
uploadFile: (file: File, options?: { name?: string; onProgress?: (pct: number) => void }) => Promise<AttachmentDto>
fetchAttachment: (id: string) => Promise<AttachmentDto>
deleteAttachment: (id: string) => Promise<void>
onError?: (error: unknown) => void
```

Report `onProgress` as `0`–`100`. Keep HTTP and authorization in the host adapter. `useCloudStorageContext()` throws when no provider is present; fix that once at the provider boundary instead of catching it separately in every field or upload component.

`UploadField` and `UploadInput` conventionally store attachment IDs. `WebcamImageUploadModal` deliberately stores an attachment link instead; do not make those field values interchangeable.

## Stacked modals

Use the stack-aware modal system when dialogs can lead to more dialogs. Do not import `ModalStackedBox` or `DialogStack*`; they are not `/modal` exports.

```tsx
"use client"

import { StackedModalsProvider, TriggerModal, useModalContext } from "@medram/react-ui-kit/modal"

function InviteTrigger() {
  const { open } = useModalContext()

  return (
    <TriggerModal
      onClick={() =>
        open({
          title: "Invite teammate",
          description: "Send access to a new teammate.",
          modal: ({ close }) => <InviteForm onSuccess={close} />,
        })
      }
    >
      Invite teammate
    </TriggerModal>
  )
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  return <StackedModalsProvider>{children}</StackedModalsProvider>
}
```

The public value types are:

```ts
type ModalProps = {
  isOpen: boolean
  close: () => void
  showOverlay?: boolean
}

type OpenModalOptions = {
  modal: (props: ModalProps) => React.ReactNode
  title?: string
  description?: string
  contentClassName?: string
  onSuccess?: () => void
  onCancel?: () => void
}

open: (options: OpenModalOptions) => void
```

Development throws if `open()` does not execute synchronously inside `TriggerModal`'s click handler. `TriggerModal` is a non-submit button that prevents default and propagation; do not replace it with a regular `Button` or schedule `open` through an async callback. Use primitive `Dialog` for a single, truly controlled dialog.

## Webcam workflows

### Upload or capture outside a form

`WebcamImageUploader` needs cloud storage and calls `onSave` with the final attachment or `null`.

```tsx
"use client"

import { CloudStorageProvider } from "@medram/react-ui-kit/cloud-storage"
import { WebcamImageUploader } from "@medram/react-ui-kit/webcam"

export function ProfileImageStep() {
  return (
    <CloudStorageProvider value={storage}>
      <WebcamImageUploader
        label="Choose a profile image"
        webcamType="portrait"
        onSave={(attachment) => saveProfileImageId(attachment?.id ?? null)}
      />
    </CloudStorageProvider>
  )
}
```

**Output value:** `AttachmentDto | null`; this example persists the attachment ID intentionally.

### Formik modal image field

`WebcamImageUploadModal` is a Formik field that opens a stacked modal and uses cloud storage. It requires all three owners: `StackedModalsProvider`, `CloudStorageProvider`, and Formik.

```tsx
"use client"

import { CloudStorageProvider } from "@medram/react-ui-kit/cloud-storage"
import { StackedModalsProvider } from "@medram/react-ui-kit/modal"
import { WebcamImageUploadModal } from "@medram/react-ui-kit/webcam"
import { Form, Formik } from "formik"

type ProfileValues = {
  avatarLink: string | null
}

export function ProfileImageField() {
  return (
    <StackedModalsProvider>
      <CloudStorageProvider value={storage}>
        <Formik<ProfileValues>
          initialValues={{ avatarLink: null }}
          onSubmit={async (values) => saveProfile(values)}
        >
          <Form>
            <WebcamImageUploadModal
              name="avatarLink"
              label="Profile image"
              aspect="1:1"
              webcamType="portrait"
            />
          </Form>
        </Formik>
      </CloudStorageProvider>
    </StackedModalsProvider>
  )
}
```

**Output value:** the field writes `attachment?.link || null`, so the matching Formik value must be `string | null`. Do not deep-import the misspelled source filename; public consumers import `WebcamImageUploadModal` from `/webcam`.

## Wizard selection

Default to `Wizard` with a `WizardStep[]`. Use `BaseWizard` and `useWizardContext` only when custom progress, content, or navigation must own the controller.

```tsx
"use client"

import { Wizard, type WizardStep } from "@medram/react-ui-kit/wizard"

const steps: WizardStep[] = [
  {
    id: "profile",
    title: "Profile",
    description: "Tell us about your team.",
    content: <ProfileStep />,
    onNext: async () => validateProfile(),
  },
  {
    id: "review",
    title: "Review",
    content: ({ currentStep, totalSteps, controller }) => (
      <ReviewStep currentStep={currentStep} totalSteps={totalSteps} onBack={controller.previous} />
    ),
    onPrevious: async () => saveDraft(),
  },
]

export function SetupWizard() {
  return (
    <Wizard steps={steps} showProgressBar showNavigation onFinish={async () => finishSetup()} />
  )
}
```

A `WizardStep` has exact `id`, `title`, optional `description`, `icon`, and presentation classes. Its `content` is either a node or a callback receiving `{ currentStep, totalSteps, controller }`. `onNext` and `onPrevious` may be async; do not bypass them with external index state.

## Standalone time input

Use `/time-picker` `TimePicker` for a controlled `Date` value. It is different from Formik `/fields` `TimePickerField`, which stores `HH:mm`.

```tsx
"use client"

import { TimePicker } from "@medram/react-ui-kit/time-picker"
import { useState } from "react"

export function QuietHoursInput() {
  const [date, setDate] = useState<Date | null>(new Date())

  return <TimePicker date={date} onChange={setDate} hourCycle={12} granularity="minute" />
}
```

**Output value:** `onChange` receives `Date | undefined`; keep that controlled date in host state. Use `hourCycle={12 | 24}` and `granularity="hour" | "minute" | "second"` to choose the rendered units.

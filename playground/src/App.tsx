import { Form, Formik } from "formik"
import { ThemeProvider, useTheme } from "next-themes"
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Code2,
  Download,
  Eye,
  Filter,
  Gauge,
  Layers3,
  LayoutGrid,
  Menu,
  Moon,
  MoreHorizontal,
  PackageCheck,
  PanelRight,
  Play,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  UploadCloud,
  Users,
} from "lucide-react"
import { Component, useMemo, useState, type ReactNode } from "react"
import toast, { Toaster } from "react-hot-toast"
import type { ColumnDef } from "@tanstack/react-table"
import type { DateRange } from "react-day-picker"
import { CloudStorageProvider, type CloudStorageContextValue } from "@medram/react-ui-kit/cloud-storage"
import type { AttachmentDto, CheckInDto } from "@medram/react-ui-kit/types"

import AlertBox from "@/components/ui/alert-box"
import AttachmentsPreview from "@/components/ui/attachments-preview"
import MedramAvatar from "@/components/ui/medram-avatar"
import BaseSelect from "@/components/ui/base-select"
import { CalendarDatePicker } from "@/components/ui/calendar-date-picker"
import CardBox from "@/components/ui/card-box"
import CheckInHeatmap from "@/components/ui/check-in-heatmap"
import CopyButton from "@/components/ui/copy-button"
import CustomBadge from "@/components/ui/custom-badge"
import { DotPattern } from "@/components/ui/dot-pattern"
import DropDownButtons from "@/components/ui/drop-down-buttons"
import FlickeringGrid from "@/components/ui/flickering-grid"
import FormError from "@/components/ui/form-error"
import FullScreenLoading from "@/components/ui/full-screen-loading"
import GradientSeparator from "@/components/ui/gradient-separator"
import Help from "@/components/ui/help"
import ImagePreview from "@/components/ui/image-preview"
import Loader from "@/components/ui/loader"
import LoadingSection from "@/components/ui/loading-section"
import ModalBox from "@/components/ui/modal-box"
import MultiStep from "@/components/ui/multi-step"
import { NumberTicker } from "@/components/ui/number-ticker"
import OverviewBox from "@/components/ui/overview-box"
import PDFPreview from "@/components/ui/pdf-preview"
import Pagination from "@/components/ui/pagination"
import MedramSelect from "@/components/ui/medram-select"
import SheetBox from "@/components/ui/sheet-box"
import SubmitButton from "@/components/ui/submit-button"
import MedramTabs from "@/components/ui/medram-tabs"
import VerticalTabs from "@/components/ui/vertical-tabs"
import WizardCard from "@/components/ui/wizard-card"
import WizardCompletion from "@/components/ui/wizard-completion"

import { BarChart, type BarChartDataItem } from "@/components/ui/bar-chart"
import { BaseChartCard } from "@/components/ui/base-chart-card"
import AreaChart from "@/components/ui/area-chart"
import { LineCharts } from "@/components/ui/line-charts"
import type { LineChartDataItem } from "@/components/ui/line-chart-content"
import PieChart from "@/components/ui/pie-chart"
import RadarChart from "@/components/ui/radar-chart"
import { StackBarChart, type StackBarGroup } from "@/components/ui/stack-bar-chart"

import BasicImageUploaderField from "@/components/ui/basic-image-uploader-field"
import BasicTimeZonesSelectField from "@/components/ui/basic-time-zones-select-field"
import CalendarDatePickerField from "@/components/ui/calendar-date-picker-field"
import CheckBoxField from "@/components/ui/check-box-field"
import CheckBoxInputFieldThin from "@/components/ui/check-box-input-thin-field"
import ComboboxField from "@/components/ui/combo-box-field"
import CopyableInputField from "@/components/ui/copyable-input-field"
import DatePickerField from "@/components/ui/date-picker-field"
import DateRangePickerField from "@/components/ui/date-range-picker-field"
import DateSelectorField from "@/components/ui/date-selector-field"
import DateTimePickerField from "@/components/ui/date-time-picker-field"
import DropdownBoxField from "@/components/ui/dropdown-box-field"
import InputField from "@/components/ui/input-field"
import MonthYearPickerField from "@/components/ui/month-year-picker-field"
import MultiCheckBoxInputField from "@/components/ui/multi-check-box-input-field"
import MultiSelectField from "@/components/ui/multi-select-field"
import RadioGroupField from "@/components/ui/radio-group-field"
import SelectField from "@/components/ui/select-field"
import SensitiveField from "@/components/ui/sensitive-field"
import SwitchField from "@/components/ui/switch-field"
import TextAreaField from "@/components/ui/text-area-field"
import TimePickerField from "@/components/ui/time-picker-field"
import TimeZoneSelectField from "@/components/ui/time-zone-select-field"
import UploadField from "@/components/ui/upload-field"

import { ImageUploadCard } from "@/components/ui/image-upload-card"
import { WebcamCapture } from "@/components/ui/webcam-capture"
import { WebcamImageUploadModal } from "@/components/ui/webcam-image-upload-modal"
import { WebcamImageUploader } from "@/components/ui/webcam-image-uploader"
import UploadInput from "@/components/ui/upload-input"
import Combobox from "@/components/ui/combo-box"
import DropZone from "@/components/ui/drop-zone"
import SelectInput from "@/components/ui/select-input"
import { SpecialSelectField } from "@/components/ui/special-select-field"

import { StackedModalsProvider, TriggerModal, useModalContext } from "@/components/ui/stacked-modals"
import { ModalStackedBox } from "@/components/ui/stacked-modal-box"
import { DataTable } from "@/components/ui/data-table"
import { PaginatedDataTable } from "@/components/ui/paginated-data-table"
import { Wizard } from "@/components/ui/wizard"
import { TimePicker } from "@/components/ui/time-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TooltipProvider } from "@/components/ui/tooltip"

const selectOptions = [
  { label: "Design system", value: "design" },
  { label: "Research notes", value: "research" },
  { label: "Release planning", value: "release" },
]
const specialOptions = selectOptions.map((option) => ({ ...option }))

const numericOptions = [
  { label: "One workspace", value: 1 },
  { label: "Two workspaces", value: 2 },
  { label: "Three workspaces", value: 3 },
]

const radioOptions = [
  { label: "Every week", value: "weekly" },
  { label: "Every month", value: "monthly" },
  { label: "Only when needed", value: "manual" },
]

const multiSelectOptions = [
  { label: "Design system", value: "design", id: "design" },
  { label: "Research", value: "research", id: "research" },
  { label: "Engineering", value: "engineering", id: "engineering" },
  { label: "Operations", value: "operations", id: "operations" },
]

const dropdownOptions = [
  { label: "Priority review", value: "priority" },
  { label: "Needs triage", value: "triage" },
  { label: "Assigned to me", value: "assigned" },
]
function wait(milliseconds: number) {
  const { promise, resolve } = Promise.withResolvers<void>()
  window.setTimeout(resolve, milliseconds)
  return promise
}


const demoImageLink =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='420' viewBox='0 0 640 420'%3E%3Crect width='640' height='420' fill='%23131e34'/%3E%3Ccircle cx='118' cy='112' r='58' fill='%2391f2c3' fill-opacity='.85'/%3E%3Cpath d='M0 334 170 192l104 79 92-111 274 174v86H0Z' fill='%23ff876e' fill-opacity='.85'/%3E%3Cpath d='M0 350 166 252l106 74 92-78 276 102v70H0Z' fill='%235a67d8' fill-opacity='.75'/%3E%3Ctext x='32' y='54' fill='%23f4f7ff' font-family='sans-serif' font-size='22' letter-spacing='4'%3EMEDRAM / LAB%3C/text%3E%3C/svg%3E"

const demoImageAttachment: AttachmentDto = {
  id: "demo-image",
  name: "workspace-cover.svg",
  file: "workspace-cover.svg",
  size: 48200,
  is_used: true,
  tag: "image",
  link: demoImageLink,
  updated: "2026-08-28T10:15:00.000Z",
  created: "2026-08-28T10:15:00.000Z",
}

const demoPdfAttachment: AttachmentDto = {
  id: "demo-pdf",
  name: "release-notes.pdf",
  file: "release-notes.pdf",
  size: 182400,
  is_used: false,
  tag: "document",
  link: "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrpw==",
  updated: "2026-08-27T09:00:00.000Z",
  created: "2026-08-27T09:00:00.000Z",
}

const checkIns: CheckInDto[] = Array.from({ length: 32 }, (_, index) => {
  const date = new Date()
  date.setDate(date.getDate() - index * 3)
  return {
    id: index + 1,
    member: 101,
    club_door: "demo-door",
    notes: index % 4 === 0 ? "Morning session" : null,
    is_successful: index % 7 !== 0,
    check_in_time: date.toISOString(),
    created: date.toISOString(),
    updated: date.toISOString(),
  }
})

const tableRows = [
  { name: "Amina Rahman", team: "Design", status: "Active", seats: 18 },
  { name: "Jon Bell", team: "Engineering", status: "Review", seats: 24 },
  { name: "Mina Park", team: "Research", status: "Active", seats: 12 },
  { name: "Leo Martins", team: "Operations", status: "Paused", seats: 9 },
  { name: "Sofia Chen", team: "Design", status: "Active", seats: 21 },
  { name: "Noah Williams", team: "Engineering", status: "Review", seats: 16 },
]

type DemoRow = (typeof tableRows)[number]

const tableColumns: ColumnDef<DemoRow>[] = [
  { accessorKey: "name", header: "Member" },
  { accessorKey: "team", header: "Team" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "seats", header: "Seats" },
]

const pieData = [
  {
    label: "Workspace mix",
    axisSuffix: "projects",
    suffix: "projects",
    data: [
      { name: "Design", data: 38, fill: "#91f2c3" },
      { name: "Research", data: 24, fill: "#7c8cff" },
      { name: "Operations", data: 18, fill: "#ff876e" },
    ],
  },
]

const radarData = [
  {
    label: "Team health",
    axisSuffix: "points",
    data: [
      { name: "Focus", data: 82, fill: "#91f2c3" },
      { name: "Momentum", data: 68, fill: "#7c8cff" },
      { name: "Clarity", data: 76, fill: "#ff876e" },
      { name: "Care", data: 88, fill: "#f7c873" },
      { name: "Learning", data: 72, fill: "#a58bfa" },
    ],
  },
]

const chartBars: BarChartDataItem[] = [
  {
    label: "Weekly activity",
    axisAccessorKey: "week",
    axisSuffix: "week",
    bars: [
      { accessorKey: "opened", label: "Opened", fill: "#91f2c3" },
      { accessorKey: "closed", label: "Closed", fill: "#ff876e" },
    ],
    data: [
      { week: "W1", opened: 32, closed: 22 },
      { week: "W2", opened: 48, closed: 36 },
      { week: "W3", opened: 41, closed: 31 },
      { week: "W4", opened: 62, closed: 54 },
    ],
    suffix: "items",
  },
]

const stackBars: StackBarGroup[] = [
  {
    label: "Delivery by team",
    axisAccessorKey: "team",
    axisSuffix: "team",
    bars: [
      { accessorKey: "design", label: "Design", fill: "#91f2c3", stackId: "total" },
      { accessorKey: "build", label: "Build", fill: "#7c8cff", stackId: "total" },
      { accessorKey: "review", label: "Review", fill: "#ff876e", stackId: "total" },
    ],
    data: [
      { team: "Design", design: 42, build: 22, review: 12 },
      { team: "Research", design: 24, build: 34, review: 18 },
      { team: "Ops", design: 16, build: 28, review: 24 },
    ],
    suffix: "cards",
  },
]

const lineData: LineChartDataItem[] = [
  {
    label: "Activity trend",
    data: [
      { month: "Apr", active: 28, completed: 18 },
      { month: "May", active: 34, completed: 24 },
      { month: "Jun", active: 46, completed: 32 },
      { month: "Jul", active: 42, completed: 38 },
      { month: "Aug", active: 58, completed: 47 },
    ],
    suffix: "updates",
  },
]

const areaData = [
  {
    label: "Capacity trend",
    data: [
      { month: "Apr", used: 32, available: 68 },
      { month: "May", used: 42, available: 58 },
      { month: "Jun", used: 51, available: 49 },
      { month: "Jul", used: 46, available: 54 },
      { month: "Aug", used: 64, available: 36 },
    ],
    suffix: "%",
  },
]

const liveDemoNames = new Set([
  "alert-box",
  "attachments-preview",
  "avatar",
  "base-select",
  "calendar-date-picker",
  "card-box",
  "check-in-heatmap",
  "copy-button",
  "custom-badge",
  "dot-pattern",
  "drop-down-buttons",
  "flickering-grid",
  "form-error",
  "full-screen-loading",
  "gradient-separator",
  "help",
  "image-preview",
  "loader",
  "loading-section",
  "modal-box",
  "multi-step",
  "number-ticker",
  "overview-box",
  "pdf-preview",
  "pagination",
  "select",
  "sheet-box",
  "stacked-modal-box",
  "stacked-modals",
  "submit-button",
  "tabs",
  "vertical-tabs",
  "wizard-card",
  "wizard-completion",
  "switch-field",
  "text-area-field",
  "time-picker-field",
  "time-zone-select-field",
  "upload-field",
  "copyable-input-field",
  "date-picker-field",
  "date-range-picker-field",
  "date-selector-field",
  "date-time-picker-field",
  "dropdown-box-field",
  "input-field",
  "month-year-picker-field",
  "multi-check-box-input-field",
  "multi-select-field",
  "radio-group-field",
  "select-field",
  "sensitive-field",
  "basic-image-uploader-field",
  "basic-time-zones-select-field",
  "calendar-date-picker-field",
  "check-box-field",
  "check-box-input-thin-field",
  "combo-box-field",
  "special-select-field",
  "upload-input",
  "combo-box",
  "drop-zone",
  "select-input",
  "pie-chart",
  "radar-chart",
  "stack-bar-chart",
  "bar-chart",
  "base-chart-card",
  "line-charts",
  "area-chart",
  "image-upload-card",
  "webcam-capture",
  "webcam-image-upload-modal",
  "webcam-image-uploader",
  "wizard",
  "table",
  "time-picker",
])

const registryInventory = [
  "modal-box",
  "form-error",
  "full-screen-loading",
  "help",
  "image-preview",
  "loader",
  "loading-section",
  "multi-step",
  "number-ticker",
  "overview-box",
  "pdf-preview",
  "pagination",
  "select",
  "sheet-box",
  "submit-button",
  "tabs",
  "vertical-tabs",
  "wizard-card",
  "wizard-completion",
  "gradient-separator",
  "alert-box",
  "attachments-preview",
  "avatar",
  "base-select",
  "calendar-date-picker",
  "card-box",
  "check-in-heatmap",
  "copy-button",
  "custom-badge",
  "dot-pattern",
  "drop-down-buttons",
  "flickering-grid",
  "switch-field",
  "text-area-field",
  "time-picker-field",
  "time-zone-select-field",
  "upload-field",
  "copyable-input-field",
  "date-picker-field",
  "date-range-picker-field",
  "date-range-yup-schema",
  "date-selector-field",
  "date-time-picker-field",
  "dropdown-box-field",
  "input-field",
  "month-year-picker-field",
  "multi-check-box-input-field",
  "multi-select-field",
  "radio-group-field",
  "select-field",
  "sensitive-field",
  "basic-image-uploader-field",
  "basic-time-zones-select-field",
  "calendar-date-picker-field",
  "check-box-field",
  "check-box-input-thin-field",
  "combo-box-field",
  "special-select-field",
  "upload-input",
  "attachment-inputs",
  "combo-box",
  "drop-zone",
  "select-input",
  "pie-chart",
  "radar-chart-content",
  "radar-chart",
  "stack-bar-chart-content",
  "stack-bar-chart",
  "bar-chart",
  "base-chart-card",
  "line-chart-content",
  "line-charts",
  "pie-chart-content",
  "area-chart-content",
  "area-chart",
  "bar-chart-content",
  "stacked-modal-box",
  "stacked-dialog",
  "modal-context",
  "stacked-modals",
  "image-upload-card",
  "webcam-capture",
  "webcam-image-upload-modal",
  "webcam-image-uploader",
  "webcam-file-upload",
  "wizard-controller",
  "wizard-context-hook",
  "wizard-types",
  "base-wizard",
  "wizard",
  "wizard-content",
  "wizard-context",
  "wizard-navigation",
  "wizard-progress-bar",
  "table",
  "time-picker",
  "medram-utils",
  "use-url-hash",
]

const initialValues = {
  fullName: "Amina Rahman",
  email: "amina@example.com",
  bio: "A small team building calm, useful software.",
  workspace: "design",
  workspaceCount: 2,
  cadence: "weekly",
  notifications: true,
  accepted: true,
  thinAccepted: false,
  secret: "demo-secret-2026",
  copyable: "https://medram.example/workspaces/design",
  date: "2026-08-21",
  dateRange: { from: "2026-08-05", to: "2026-08-12" },
  selectorDate: "2026-08-26",
  datetime: "2026-08-27T14:30:00.000Z",
  monthYear: "2026-08-01",
  time: "14:30",
  timezone: "UTC",
  basicTimezone: "Europe/Paris",
  multi: ["design", "research"],
  filters: ["priority"],
  combo: "design",
  selectField: "research",
  profileImage: demoImageLink,
  uploadIds: [demoImageAttachment.id],
  calendarRange: { from: new Date("2026-08-04T00:00:00.000Z"), to: new Date("2026-08-11T00:00:00.000Z") },
  webcamImage: demoImageLink,
}

class DemoErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="lab-error" role="alert">
        <strong>Demo reported an error</strong>
        <code>{this.state.error.message}</code>
      </div>
    )
  }
}

type DemoCardProps = {
  name: string
  source: string
  children: ReactNode
  className?: string
}

function DemoCard({ name, source, children, className = "" }: DemoCardProps) {
  return (
    <article className={`lab-card ${className}`} data-component={name}>
      <header className="lab-card-header">
        <div>
          <p className="lab-eyebrow">{name}</p>
          <p className="lab-source">{source}</p>
        </div>
        <span className="lab-live-dot" aria-label="Live demo" title="Live demo" />
      </header>
      <DemoErrorBoundary>
        <div className="lab-card-body">{children}</div>
      </DemoErrorBoundary>
    </article>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="lab-section-heading">
      <p className="lab-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme !== "light"
  return (
    <button
      type="button"
      className="lab-icon-button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Use light theme" : "Use dark theme"}
      title={isDark ? "Use light theme" : "Use dark theme"}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  )
}

function StackedModalDemo() {
  const { open } = useModalContext()
  return (
    <TriggerModal
      variant="outline"
      onClick={() =>
        open({
          title: "A stacked test modal",
          description: "Open another layer to verify the stack and close behavior.",
          modal: ({ close }) => (
            <div className="grid gap-3">
              <p className="text-sm text-muted-foreground">
                This content is supplied through the modal callback. The provider owns the stack.
              </p>
              <Button type="button" onClick={close}>
                Close layer
              </Button>
            </div>
          ),
        })
      }
    >
      Open stacked modal
    </TriggerModal>
  )
}

function DeferredWebcamDemo() {
  const [open, setOpen] = useState(false)
  const [capture, setCapture] = useState<string | null>(null)
  if (!open) {
    return (
      <div className="grid gap-3">
        <p className="text-sm text-muted-foreground">Camera permission is requested only after you open this demo.</p>
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <Play data-icon="inline-start" /> Open camera demo
        </Button>
      </div>
    )
  }
  return (
    <div className="grid gap-3">
      <WebcamCapture
        webcamType="landscape"
        onBack={() => setOpen(false)}
        onCapture={(imageDataUrl) => {
          setCapture(imageDataUrl)
          toast.success("Camera capture received")
        }}
      />
      {capture && <p className="text-xs text-muted-foreground">Capture ready: {capture.slice(0, 32)}…</p>}
    </div>
  )
}

function LabPage() {
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState<"all" | "component" | "field" | "workflow">("all")
  const [selected, setSelected] = useState("design")
  const [selectedNumber, setSelectedNumber] = useState<number>(2)
  const [selectedInput, setSelectedInput] = useState("research")
  const [thinChecked, setThinChecked] = useState(false)
  const [calendarRange, setCalendarRange] = useState<DateRange>({
    from: new Date("2026-08-04T00:00:00.000Z"),
    to: new Date("2026-08-11T00:00:00.000Z"),
  })
  const [specialSelection, setSpecialSelection] = useState(specialOptions[1])
  const [standaloneTime, setStandaloneTime] = useState(new Date("2026-08-21T13:45:00.000Z"))
  const [paginationPage, setPaginationPage] = useState(2)
  const [paginationSize, setPaginationSize] = useState(10)
  const [showFullscreenLoading, setShowFullscreenLoading] = useState(false)
  const [stackedOpen, setStackedOpen] = useState(false)
  const [wizardDone, setWizardDone] = useState(false)

  const normalizedQuery = query.trim().toLowerCase()
  const isVisible = (name: string, itemKind: "component" | "field" | "workflow") => {
    const matchesQuery = !normalizedQuery || name.includes(normalizedQuery)
    const matchesKind = kind === "all" || kind === itemKind
    return matchesQuery && matchesKind
  }

  const visibleDemos = useMemo(
    () =>
      [...liveDemoNames].filter((name) => {
        const itemKind = name.includes("field") ? "field" : name.includes("chart") || name === "table" ? "workflow" : "component"
        return isVisible(name, itemKind)
      }).length,
    [kind, normalizedQuery],
  )


  return (
    <div className="lab-shell">
      <aside className="lab-sidebar">
        <a className="lab-brand" href="#top" aria-label="Medram Component Lab home">
          <span className="lab-brand-mark"><Layers3 aria-hidden="true" /></span>
          <span>
            <strong>Medram</strong>
            <small>component lab</small>
          </span>
        </a>
        <div className="lab-sidebar-rule" />
        <p className="lab-sidebar-label">Bench map</p>
        <nav className="lab-nav" aria-label="Playground sections">
          <a href="#overview"><Gauge aria-hidden="true" /> Overview</a>
          <a href="#fields"><Settings2 aria-hidden="true" /> Fields</a>
          <a href="#display"><LayoutGrid aria-hidden="true" /> Display</a>
          <a href="#workflows"><PanelRight aria-hidden="true" /> Workflows</a>
          <a href="#media"><UploadCloud aria-hidden="true" /> Media</a>
          <a href="#charts"><BarChart3 aria-hidden="true" /> Charts</a>
          <a href="#table"><Clipboard aria-hidden="true" /> Table</a>
          <a href="#inventory"><PackageCheck aria-hidden="true" /> Inventory</a>
        </nav>
        <div className="lab-sidebar-footer">
          <p className="lab-sidebar-label">Test mode</p>
          <div className="lab-status"><span /> Dummy data only</div>
          <p>No network calls are needed. Uploads use an in-memory provider.</p>
        </div>
      </aside>

      <main id="top" className="lab-main">
        <header className="lab-topbar">
          <div className="lab-mobile-brand"><Menu aria-hidden="true" /> <span>Component Lab</span></div>
          <div className="lab-breadcrumb"><Terminal aria-hidden="true" /> / manual-test-bench</div>
          <div className="lab-top-actions">
            <span className="lab-version">registry / local</span>
            <ThemeToggle />
          </div>
        </header>

        <section id="overview" className="lab-hero">
          <div className="lab-hero-copy">
            <p className="lab-kicker"><span /> Source registry / interaction surface</p>
            <h1>Every surface.<br /><em>One honest test bench.</em></h1>
            <p className="lab-hero-text">
              A hands-on room for the Medram React UI Kit. Change values, open overlays, drag files,
              move through steps, and spot the tiny behaviors that static screenshots miss.
            </p>
            <div className="lab-hero-actions">
              <a className="lab-primary-button" href="#fields">Start with fields <ArrowRight aria-hidden="true" /></a>
              <a className="lab-quiet-link" href="#inventory">See coverage <ChevronRight aria-hidden="true" /></a>
            </div>
          </div>
          <div className="lab-hero-instrument" aria-label="Playground status">
            <div className="lab-instrument-grid" />
            <div className="lab-instrument-readout">
              <span className="lab-readout-label">SESSION READOUT</span>
              <strong>{visibleDemos.toString().padStart(2, "0")}</strong>
              <span>examples in view</span>
            </div>
            <div className="lab-instrument-line"><span /> all systems nominal</div>
          </div>
        </section>

        <section className="lab-summary-grid" aria-label="Playground summary">
          <div className="lab-summary-item"><span className="lab-summary-icon"><Code2 aria-hidden="true" /></span><strong>98</strong><span>registry records</span></div>
          <div className="lab-summary-item"><span className="lab-summary-icon"><Settings2 aria-hidden="true" /></span><strong>25</strong><span>field demos</span></div>
          <div className="lab-summary-item"><span className="lab-summary-icon"><ShieldCheck aria-hidden="true" /></span><strong>0</strong><span>network dependencies</span></div>
          <div className="lab-summary-item"><span className="lab-summary-icon"><Activity aria-hidden="true" /></span><strong>LIVE</strong><span>stateful controls</span></div>
        </section>

        <section className="lab-filter-bar" aria-label="Filter demos">
          <label className="lab-search-box">
            <Search aria-hidden="true" />
            <span className="sr-only">Search demos</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a component, field, or workflow" />
            <kbd>/</kbd>
          </label>
          <div className="lab-filter-tabs" role="group" aria-label="Demo type">
            {(["all", "component", "field", "workflow"] as const).map((option) => (
              <button key={option} type="button" className={kind === option ? "is-active" : ""} onClick={() => setKind(option)}>
                {option === "all" ? "All" : option === "component" ? "Components" : option === "field" ? "Fields" : "Workflows"}
              </button>
            ))}
          </div>
          <span className="lab-filter-count"><Filter aria-hidden="true" /> {visibleDemos} live cards</span>
        </section>

        <Formik
          initialValues={initialValues}
          onSubmit={async (_values, helpers) => {
            await wait(450)
            helpers.setSubmitting(false)
            toast.success("Dummy form submitted")
          }}
        >
          <Form className="lab-form-shell">
            <section id="fields" className="lab-section">
              <SectionHeader eyebrow="01 / Form controls" title="Fields are where contracts meet people." description="Every field is wired to one shared Formik form with realistic values. Edit freely; submit at the bottom to exercise the state boundary." />
              <div className="lab-card-grid lab-card-grid-fields">
                {isVisible("input-field", "field") && <DemoCard name="input-field" source="fields/InputField.tsx"><InputField name="fullName" label="Full name" help="Displayed in workspace activity." /></DemoCard>}
                {isVisible("text-area-field", "field") && <DemoCard name="text-area-field" source="fields/TextAreaField.tsx"><TextAreaField name="bio" label="Workspace note" rows={3} help="Keep it short and useful." /></DemoCard>}
                {isVisible("select-field", "field") && <DemoCard name="select-field" source="fields/SelectField.tsx"><SelectField name="selectField" label="Primary area" options={selectOptions} help="The trigger should show the option label." /></DemoCard>}
                {isVisible("base-select", "component") && <DemoCard name="base-select" source="components/BaseSelect.tsx"><BaseSelect name="workspaceCount" defaultValue={2} options={numericOptions} onChange={(value) => setSelectedNumber(Number(value))} /><p className="lab-event-readout">Selected: <strong>{selectedNumber}</strong></p></DemoCard>}
                {isVisible("switch-field", "field") && <DemoCard name="switch-field" source="fields/SwitchField.tsx"><SwitchField name="notifications" label="Notifications" switchLabel="Send weekly digest" help="Toggle the Formik boolean value." /></DemoCard>}
                {isVisible("check-box-field", "field") && <DemoCard name="check-box-field" source="fields/CheckBoxField.tsx"><CheckBoxField name="accepted" label="Terms accepted" checkboxLabel="I understand the demo data is disposable." /></DemoCard>}
                {isVisible("check-box-input-thin-field", "field") && <DemoCard name="check-box-input-thin-field" source="fields/CheckBoxInputThinField.tsx"><CheckBoxInputFieldThin name="thinAccepted" checked={thinChecked} onCheckedChange={(checked) => { setThinChecked(checked); toast.success(checked ? "Checked" : "Unchecked") }} checkboxLabel="Standalone checkbox" /></DemoCard>}
                {isVisible("radio-group-field", "field") && <DemoCard name="radio-group-field" source="fields/RadioGroupField.tsx"><RadioGroupField name="cadence" label="Review cadence" options={radioOptions} help="Choose one option." /></DemoCard>}
                {isVisible("multi-select-field", "field") && <DemoCard name="multi-select-field" source="fields/MultiSelectField.tsx"><MultiSelectField name="multi" label="Teams in scope" availableItems={multiSelectOptions} enableMoveAll enableSearch help="Double click an item or use the move buttons." /></DemoCard>}
                {isVisible("multi-check-box-input-field", "field") && <DemoCard name="multi-check-box-input-field" source="fields/MultiCheckBoxInputField.tsx"><MultiCheckBoxInputField name="multi" label="Checkbox group" options={multiSelectOptions.slice(0, 3)} help="A compact multi-value field." /></DemoCard>}
                {isVisible("dropdown-box-field", "field") && <DemoCard name="dropdown-box-field" source="fields/DropdownBoxField.tsx"><DropdownBoxField name="filters" type="checkbox" label="Saved filters" options={dropdownOptions}><Button type="button" variant="outline"><Filter data-icon="inline-start" /> Filters</Button></DropdownBoxField></DemoCard>}
                {isVisible("combo-box-field", "field") && <DemoCard name="combo-box-field" source="fields/ComboBoxField.tsx"><ComboboxField name="combo" label="Search workspace" availableItems={selectOptions} searchPlaceholder="Find a workspace" selectPlaceholder="Choose a workspace" help="Type to filter the command list." /></DemoCard>}
                {isVisible("sensitive-field", "field") && <DemoCard name="sensitive-field" source="fields/SensitiveField.tsx"><SensitiveField name="secret" label="API secret" help="The eye button toggles visibility." /></DemoCard>}
                {isVisible("copyable-input-field", "field") && <DemoCard name="copyable-input-field" source="fields/CopyableInputField.tsx"><CopyableInputField name="copyable" label="Share link" help="Copy the input without leaving the page." /></DemoCard>}
                {isVisible("date-picker-field", "field") && <DemoCard name="date-picker-field" source="fields/DatePickerField.tsx"><DatePickerField name="date" label="Launch date" dateOnly help="Open the calendar and choose another date." /></DemoCard>}
                {isVisible("date-range-picker-field", "field") && <DemoCard name="date-range-picker-field" source="fields/DateRangePickerField.tsx"><DateRangePickerField name="dateRange" label="Review window" numberOfMonths={1} help="Pick a start and end date." /></DemoCard>}
                {isVisible("date-selector-field", "field") && <DemoCard name="date-selector-field" source="fields/DateSelectorField.tsx"><DateSelectorField name="selectorDate" label="Selector date" help="Use the month and year controls inside the calendar." /></DemoCard>}
                {isVisible("date-time-picker-field", "field") && <DemoCard name="date-time-picker-field" source="fields/DateTimePickerField.tsx"><DateTimePickerField name="datetime" label="Scheduled handoff" timeFormat="24h" help="Date plus time in one control." /></DemoCard>}
                {isVisible("month-year-picker-field", "field") && <DemoCard name="month-year-picker-field" source="fields/MonthYearPickerField.tsx"><MonthYearPickerField name="monthYear" label="Billing month" help="Choose month and year, with a stable day." /></DemoCard>}
                {isVisible("time-picker-field", "field") && <DemoCard name="time-picker-field" source="fields/TimePickerField.tsx"><TimePickerField name="time" label="Reminder time" help="Keyboard-friendly hour and minute inputs." /></DemoCard>}
                {isVisible("time-zone-select-field", "field") && <DemoCard name="time-zone-select-field" source="fields/TimeZoneSelectFiels.tsx"><TimeZoneSelectField name="timezone" label="Site timezone" /></DemoCard>}
                {isVisible("basic-time-zones-select-field", "field") && <DemoCard name="basic-time-zones-select-field" source="fields/BasicTimeZonesSelectField.tsx"><BasicTimeZonesSelectField name="basicTimezone" label="Basic timezone list" /></DemoCard>}
                {isVisible("calendar-date-picker-field", "field") && <DemoCard name="calendar-date-picker-field" source="fields/CalendarDatePickerField.tsx"><CalendarDatePickerField name="calendarRange" label="Calendar range" numberOfMonths={1} className="w-full" help="The range is stored as Date objects." /></DemoCard>}
                {isVisible("basic-image-uploader-field", "field") && <DemoCard name="basic-image-uploader-field" source="fields/BasicImageUploaderField.tsx"><BasicImageUploaderField name="profileImage" label="Profile image" aspectRatio="16:9" variant="flat" enableUploadIndicator imagePlaceholder="Workspace cover" defaultPlaceholder={demoImageLink} /></DemoCard>}
                {isVisible("upload-field", "field") && <DemoCard name="upload-field" source="fields/UploadField.tsx"><UploadField name="uploadIds" label="Attachments" multiple maxFiles={3} help="Drop a file or delete the seeded dummy attachment." /></DemoCard>}
                {isVisible("webcam-image-upload-modal", "workflow") && <DemoCard name="webcam-image-upload-modal" source="webcam/WebcamIamgeUploadModal.tsx"><WebcamImageUploadModal name="webcamImage" label="Profile image modal" buttonText="Open image picker" modalTitle="Pick a dummy profile image" /></DemoCard>}
              </div>
              {isVisible("submit-button", "component") && <DemoCard name="submit-button" source="components/SubmitButton.tsx" className="lab-card-submit"><div className="flex flex-wrap items-center gap-3"><SubmitButton title="Submit dummy form" /><span className="text-xs text-muted-foreground">Formik waits 450ms, then shows a toast.</span></div></DemoCard>}
            </section>
          </Form>
        </Formik>

        <section id="display" className="lab-section">
          <SectionHeader eyebrow="02 / Display and feedback" title="Quiet primitives, visible states." description="These pieces are intentionally small. Hover, copy, resize, open a tooltip, or trigger the loading state to test their edges." />
          <div className="lab-card-grid">
            {isVisible("alert-box", "component") && <DemoCard name="alert-box" source="components/AlertBox.tsx"><div className="grid gap-2"><AlertBox type="info" title="Info" description="This is a calm informational state." /><AlertBox type="warning" title="Warning" description="A review is waiting for an owner." /><AlertBox type="success" title="Success" description="The dummy action completed." /></div></DemoCard>}
            {isVisible("card-box", "component") && <DemoCard name="card-box" source="components/CardBox.tsx"><CardBox title="Card box" description="A composed card with a content slot."><p className="text-sm text-muted-foreground">Card content stays separate from its header and description.</p></CardBox></DemoCard>}
            {isVisible("custom-badge", "component") && <DemoCard name="custom-badge" source="components/CustomBadge.tsx"><div className="flex flex-wrap gap-2"><CustomBadge type="default">Default</CustomBadge><CustomBadge type="warning">Warning</CustomBadge><CustomBadge type="success">Ready</CustomBadge><CustomBadge type="danger">Blocked</CustomBadge><CustomBadge type="random">Workspace</CustomBadge></div></DemoCard>}
            {isVisible("avatar", "component") && <DemoCard name="avatar" source="components/Avatar.tsx"><div className="flex items-center gap-3"><MedramAvatar src={demoImageLink} alt="Amina Rahman" fallback="AR" tooltipContent="Amina Rahman" size={14} /><MedramAvatar fallback="JB" tooltipContent="Jon Bell" size={14} /><MedramAvatar fallback="MP" tooltipContent="Mina Park" size={14} /></div></DemoCard>}
            {isVisible("help", "component") && <DemoCard name="help" source="components/Help.tsx"><Help>Helper copy sits directly below the control it describes.</Help></DemoCard>}
            {isVisible("form-error", "component") && <DemoCard name="form-error" source="components/FormError.tsx"><FormError>Example validation message: choose a workspace before continuing.</FormError></DemoCard>}
            {isVisible("number-ticker", "component") && <DemoCard name="number-ticker" source="components/NumberTicker.tsx"><div className="lab-big-number"><NumberTicker value={2847} decimalPlaces={0} /><span>events indexed</span></div></DemoCard>}
            {isVisible("loader", "component") && <DemoCard name="loader" source="components/Loader.tsx"><div className="flex items-center gap-3"><Loader color="#91f2c3" size={10} /><span className="text-sm text-muted-foreground">Syncing dummy state…</span></div></DemoCard>}
            {isVisible("loading-section", "component") && <DemoCard name="loading-section" source="components/LoadingSection.tsx"><div className="h-16"><LoadingSection /></div></DemoCard>}
            {isVisible("full-screen-loading", "component") && <DemoCard name="full-screen-loading" source="components/FullScreenLoading.tsx"><div className="grid gap-3"><p className="text-sm text-muted-foreground">The overlay appears briefly, then dismisses automatically.</p><Button type="button" variant="outline" onClick={() => { setShowFullscreenLoading(true); window.setTimeout(() => setShowFullscreenLoading(false), 1200) }}><RefreshCw data-icon="inline-start" /> Run overlay</Button>{showFullscreenLoading && <FullScreenLoading />}</div></DemoCard>}
            {isVisible("overview-box", "component") && <DemoCard name="overview-box" source="components/OverviewBox.tsx"><OverviewBox title="Active members" value="1,284" change={12.4} description="vs. last month" icon={Users} additionalInfo="Dummy metric for testing the tooltip." /></DemoCard>}
            {isVisible("check-in-heatmap", "component") && <DemoCard name="check-in-heatmap" source="components/CheckInHeatmap.tsx" className="lab-card-wide"><CheckInHeatmap checkIns={checkIns} weeks={26} title="Dummy activity over the last six months" /></DemoCard>}
            {isVisible("image-preview", "component") && <DemoCard name="image-preview" source="components/ImagePreview.tsx"><ImagePreview attachment={demoImageAttachment} /></DemoCard>}
            {isVisible("pdf-preview", "component") && <DemoCard name="pdf-preview" source="components/PDFPreview.tsx"><PDFPreview attachment={demoPdfAttachment} suffixTitle="/ dummy attachment" /></DemoCard>}
            {isVisible("attachments-preview", "component") && <DemoCard name="attachments-preview" source="components/AttachmentsPreview.tsx"><AttachmentsPreview attachmentIds={[demoImageAttachment.id, demoPdfAttachment.id]} /></DemoCard>}
            {isVisible("dot-pattern", "component") && <DemoCard name="dot-pattern" source="components/DotPattern.tsx"><DotPattern className="lab-pattern-surface"><div className="lab-pattern-copy"><Sparkles aria-hidden="true" /><span>Pattern layer with live children</span></div></DotPattern></DemoCard>}
            {isVisible("flickering-grid", "component") && <DemoCard name="flickering-grid" source="components/FlikeringGrid.tsx"><div className="h-36 overflow-hidden rounded-lg border border-border/60"><FlickeringGrid squareSize={4} gridGap={5} color="rgba(145, 242, 195, 0.75)" maxOpacity={0.35} /></div></DemoCard>}
            {isVisible("gradient-separator", "component") && <DemoCard name="gradient-separator" source="components/gradientSeparator.tsx"><div className="grid gap-5"><GradientSeparator color="#91f2c3" speed="7s" /><p className="text-sm text-muted-foreground">A moving divider; reduced motion is respected by the page shell.</p></div></DemoCard>}
            {isVisible("multi-step", "component") && <DemoCard name="multi-step" source="components/MultiStep.tsx"><MultiStep steps={["brief", "build", "review", "ship"]} currentStep="review" /></DemoCard>}
          </div>
        </section>

        <section id="workflows" className="lab-section">
          <SectionHeader eyebrow="03 / Workflows" title="Open the things that move." description="Menus, sheets, tabs, and wizards are mounted with dummy callbacks so you can exercise focus, navigation, and transitions." />
          <div className="lab-card-grid">
            {isVisible("calendar-date-picker", "component") && <DemoCard name="calendar-date-picker" source="components/CalendarDatePicker.tsx"><CalendarDatePicker date={calendarRange} onDateSelect={(nextRange) => setCalendarRange(nextRange)} numberOfMonths={1} /></DemoCard>}
            {isVisible("select", "component") && <DemoCard name="select" source="components/Select.tsx"><MedramSelect options={selectOptions} value={selected} onChange={(value) => setSelected(String(value))} placeholder="Choose a workspace" /><p className="lab-event-readout">Current value: <strong>{selected}</strong></p></DemoCard>}
            {isVisible("select-input", "workflow") && <DemoCard name="select-input" source="inputs/SelectInput.tsx"><SelectInput options={selectOptions} value={selectedInput} onChange={(value) => setSelectedInput(String(value))} placeholder="Choose a report" /><p className="lab-event-readout">Current value: <strong>{selectedInput}</strong></p></DemoCard>}
            {isVisible("special-select-field", "field") && <DemoCard name="special-select-field" source="fields/SpecialSelectField.tsx"><SpecialSelectField options={specialOptions} value={specialSelection} onSelect={(value) => setSpecialSelection(value ?? specialOptions[0])} render={({ option, selected: isSelected, onClick }) => <button type="button" className={`lab-special-option${isSelected ? " is-selected" : ""}`} onClick={onClick}>{option.label}<ChevronRight aria-hidden="true" /></button>} /><p className="lab-event-readout">Special selection: <strong>{specialSelection.label}</strong></p></DemoCard>}
            {isVisible("combo-box", "workflow") && <DemoCard name="combo-box" source="inputs/ComboBox.tsx"><Combobox availableItems={selectOptions} value={selected} onChange={(value) => setSelected(String(value))} searchPlaceholder="Search areas" selectPlaceholder="Pick an area" /></DemoCard>}
            {isVisible("time-picker", "workflow") && <DemoCard name="time-picker" source="time-picker/TimePicker.tsx"><TimePicker date={standaloneTime} onChange={(nextDate) => nextDate && setStandaloneTime(nextDate)} hourCycle={24} /></DemoCard>}
            {isVisible("copy-button", "component") && <DemoCard name="copy-button" source="components/CopyableButton.tsx"><div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3"><code className="truncate text-xs">pnpm dlx shadcn@latest add medram/react-ui-kit</code><CopyButton text="pnpm dlx shadcn@latest add medram/react-ui-kit" /></div></DemoCard>}
            {isVisible("pagination", "component") && <DemoCard name="pagination" source="components/Pagination.tsx" className="lab-card-wide"><Pagination currentPage={paginationPage} totalCount={84} pageSize={paginationSize} pageSizeOptions={[10, 20, 50]} onPageChange={setPaginationPage} onPageSizeChange={setPaginationSize} /></DemoCard>}
            {isVisible("drop-down-buttons", "component") && <DemoCard name="drop-down-buttons" source="components/DropDownButtons.tsx"><DropDownButtons label="Actions" icon={MoreHorizontal} actions={[{ label: "Duplicate", icon: Clipboard, handler: async () => { toast.success("Duplicate queued") } }, { label: "Export", icon: Download, handler: async () => { toast.success("Export queued") } }]} /></DemoCard>}
            {isVisible("modal-box", "component") && <DemoCard name="modal-box" source="components/ModalBox.tsx"><ModalBox trigger={<Button type="button" variant="outline"><Eye data-icon="inline-start" /> Open modal</Button>} title="A focused modal" description="ModalBox keeps the dialog contract small."><div className="grid gap-3"><p className="text-sm text-muted-foreground">Use Escape, click outside, and tab through the controls.</p><Input placeholder="Dummy modal input" /></div></ModalBox></DemoCard>}
            {isVisible("sheet-box", "component") && <DemoCard name="sheet-box" source="components/SheetBox.tsx"><SheetBox trigger={<Button type="button" variant="outline"><PanelRight data-icon="inline-start" /> Open sheet</Button>} title="Inspector sheet" subTitle="A right-side surface for secondary work."><div className="grid gap-4"><Input defaultValue="Amina Rahman" /><Textarea defaultValue="Dummy inspector notes" rows={4} /></div></SheetBox></DemoCard>}
            {isVisible("tabs", "component") && <DemoCard name="tabs" source="components/Tabs.tsx" className="lab-card-wide"><MedramTabs items={[{ title: "Summary", hash: "#lab-summary", component: <p className="text-sm text-muted-foreground">Summary tab content with no network state.</p> }, { title: "Activity", hash: "#lab-activity", component: <p className="text-sm text-muted-foreground">Activity tab content with a different hash.</p> }]} showSeparator={false} showTitle /></DemoCard>}
            {isVisible("vertical-tabs", "component") && <DemoCard name="vertical-tabs" source="components/VerticalTabs.tsx" className="lab-card-wide"><VerticalTabs items={[{ title: "General", hash: "#lab-general", component: <p className="text-sm text-muted-foreground">General settings are ready to inspect.</p> }, { title: "Permissions", hash: "#lab-permissions", component: <p className="text-sm text-muted-foreground">Permissions content is intentionally dummy.</p> }]} suspense={false} /></DemoCard>}
            {isVisible("stacked-modal-box", "workflow") && <DemoCard name="stacked-modal-box" source="modal/ModalStackedBox.tsx"><Button type="button" variant="outline" onClick={() => setStackedOpen(true)}>Open stacked box</Button><ModalStackedBoxDemo open={stackedOpen} onOpenChange={setStackedOpen} /></DemoCard>}
            {isVisible("stacked-modals", "workflow") && <DemoCard name="stacked-modals" source="modal/modal.hook.tsx"><StackedModalDemo /></DemoCard>}
            {isVisible("wizard-card", "component") && <DemoCard name="wizard-card" source="components/WizardCard.tsx"><WizardCard item={{ name: "New workspace", description: "A dummy card entry for a guided setup.", icon: Sparkles, href: "#wizard" }} /></DemoCard>}
            {isVisible("wizard-completion", "component") && <DemoCard name="wizard-completion" source="components/WizardCompletion.tsx"><WizardCompletion title="Workspace ready" description="The dummy workflow reached its completion state." onGoBack={() => toast("Back action fired")} /></DemoCard>}
            {isVisible("wizard", "workflow") && <DemoCard name="wizard" source="wizard/Wizard.tsx" className="lab-card-wide"><WizardDemo done={wizardDone} onFinish={() => setWizardDone(true)} onReset={() => setWizardDone(false)} /></DemoCard>}
          </div>
        </section>

        <section id="media" className="lab-section">
          <SectionHeader eyebrow="04 / Media inputs" title="Files, previews, and camera boundaries." description="The storage provider is deliberately fake: uploads resolve in memory, seeded attachments render immediately, and no credentials are needed." />
          <div className="lab-card-grid">
            {isVisible("drop-zone", "workflow") && <DemoCard name="drop-zone" source="inputs/DropZone.tsx"><DropZone onUpload={({ files }) => toast.success(`${files.length} file${files.length === 1 ? "" : "s"} accepted`)} onError={() => toast.error("Dummy file rejected")}><div className="flex flex-col items-center gap-2"><UploadCloud aria-hidden="true" /><span>Drop a file here or browse</span><small>Image files up to 1 MB</small></div></DropZone></DemoCard>}
            {isVisible("upload-input", "workflow") && <DemoCard name="upload-input" source="inputs/UploadInput.tsx"><UploadInput defaultValue={[demoImageAttachment.id]} multiple maxFiles={2} /></DemoCard>}
            {isVisible("image-upload-card", "workflow") && <DemoCard name="image-upload-card" source="webcam/ImageUploadCard.tsx"><ImageUploadCard attachment={demoImageAttachment} isUploading={false} onFileSelect={(file) => toast.success(`${file.name} selected`)} onClear={() => toast.success("Preview cleared")} /></DemoCard>}
            {isVisible("webcam-image-uploader", "workflow") && <DemoCard name="webcam-image-uploader" source="webcam/WebcamImageUploader.tsx"><WebcamImageUploader initialAttachmentId={demoImageAttachment.id} label="Image uploader" onSave={(attachment) => toast.success(attachment ? "Image saved" : "Image cleared")} /></DemoCard>}
            {isVisible("webcam-capture", "workflow") && <DemoCard name="webcam-capture" source="webcam/WebcamCapture.tsx"><DeferredWebcamDemo /></DemoCard>}
          </div>
        </section>

        <section id="charts" className="lab-section">
          <SectionHeader eyebrow="05 / Data surfaces" title="Charts with enough data to be honest." description="Each chart uses local values and the same card shell. Resize the viewport, switch chart options where available, and inspect tooltips." />
          <div className="lab-card-grid lab-card-grid-charts">
            {isVisible("base-chart-card", "workflow") && <DemoCard name="base-chart-card" source="charts/BaseChartCard.tsx"><BaseChartCard options={[{ label: "Primary", value: "primary" }, { label: "Secondary", value: "secondary" }]} defaultValue="primary" headerTitle="Base chart card" headerDescription="A generic card contract with option switching." footerDescription="Dummy footer state."><div className="lab-chart-placeholder"><Activity aria-hidden="true" /><span>Child chart content slot</span></div></BaseChartCard></DemoCard>}
            {isVisible("pie-chart", "workflow") && <DemoCard name="pie-chart" source="charts/PieChart.tsx"><PieChart pies={pieData} headerTitle="Workspace mix" headerDescription="Dummy project distribution" showSummary showLegend /></DemoCard>}
            {isVisible("radar-chart", "workflow") && <DemoCard name="radar-chart" source="charts/RadarChart.tsx"><RadarChart data={radarData} headerTitle="Team health" headerDescription="Dummy qualitative score" showSummary /></DemoCard>}
            {isVisible("bar-chart", "workflow") && <DemoCard name="bar-chart" source="charts/BarChart.tsx"><BarChart bars={chartBars} headerTitle="Weekly activity" headerDescription="Opened vs. closed" enableLegend /></DemoCard>}
            {isVisible("stack-bar-chart", "workflow") && <DemoCard name="stack-bar-chart" source="charts/StackBarChart.tsx"><StackBarChart bars={stackBars} headerTitle="Delivery by team" headerDescription="Stacked dummy totals" enableLegend /></DemoCard>}
            {isVisible("line-charts", "workflow") && <DemoCard name="line-charts" source="charts/LineCharts.tsx"><LineCharts data={lineData} headerTitle="Activity trend" headerDescription="Monthly dummy activity" /></DemoCard>}
            {isVisible("area-chart", "workflow") && <DemoCard name="area-chart" source="charts/AreaChart.tsx"><AreaChart data={areaData} headerTitle="Capacity trend" headerDescription="Used vs. available" gradientArea /></DemoCard>}
          </div>
        </section>

        <section id="table" className="lab-section">
          <SectionHeader eyebrow="06 / Table workflow" title="Rows, filters, and pagination in one place." description="The table uses six dummy members and TanStack column definitions so sorting, filtering, selection, and toolbar actions are available to inspect." />
          <div className="lab-card-grid">
            {isVisible("table", "workflow") && <DemoCard name="table" source="table/data-table.tsx + paginated-data-table.tsx" className="lab-card-wide"><div className="overflow-x-auto"><DataTable columns={tableColumns} data={tableRows} searchFilter={{ accessorKey: "name", placeholder: "Search members" }} /></div><div className="my-5 border-t border-border/60" /><div className="overflow-x-auto"><PaginatedDataTable columns={tableColumns} paginatedData={{ results: tableRows.slice(0, 3), count: 9, page_size: 3 }} displayPaginationUI={false} /></div></DemoCard>}
          </div>
        </section>

        <section id="inventory" className="lab-section lab-inventory-section">
          <SectionHeader eyebrow="07 / Coverage ledger" title="Nothing hidden behind a demo shortcut." description="Live cards are mounted above. Support modules are listed here because they are exercised by their parent workflow rather than rendered as standalone UI." />
          <div className="lab-inventory-card">
            <div className="lab-inventory-topline"><span><PackageCheck aria-hidden="true" /> Registry ledger</span><strong>{registryInventory.length} items</strong></div>
            <div className="lab-inventory-list">
              {registryInventory.map((name) => <span key={name} className={liveDemoNames.has(name) ? "is-live" : "is-support"}><i />{name}</span>)}
            </div>
            <div className="lab-inventory-legend"><span><i className="is-live" /> Live card mounted</span><span><i className="is-support" /> Support module exercised by parent</span></div>
          </div>
        </section>

        <footer className="lab-footer"><span>Medram Component Lab</span><span>Built for manual inspection / dummy data only</span><a href="#top">Back to top <ArrowRight aria-hidden="true" /></a></footer>
      </main>

      <nav className="lab-mobile-nav" aria-label="Mobile playground sections"><a href="#fields" aria-label="Fields"><Settings2 aria-hidden="true" /></a><a href="#display" aria-label="Display"><LayoutGrid aria-hidden="true" /></a><a href="#workflows" aria-label="Workflows"><PanelRight aria-hidden="true" /></a><a href="#charts" aria-label="Charts"><BarChart3 aria-hidden="true" /></a></nav>
    </div>
  )
}

function ModalStackedBoxDemo({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <div className="relative">
      <ModalStackedBox isOpen={open} onOpenChange={onOpenChange} showOverlay title="Stacked box" description="A controlled stacked dialog with dummy content.">
        <div className="grid gap-3"><p className="text-sm text-muted-foreground">The box is controlled by the button in the card.</p><Button type="button" onClick={() => onOpenChange(false)}>Close box</Button></div>
      </ModalStackedBox>
    </div>
  )
}

function WizardDemo({ done, onFinish, onReset }: { done: boolean; onFinish: () => void; onReset: () => void }) {
  const steps = [
    { id: "brief", title: "Brief", description: "Set a direction", content: <div className="grid gap-2"><strong>Step one</strong><p className="text-sm text-muted-foreground">Describe the dummy workspace.</p></div> },
    { id: "shape", title: "Shape", description: "Choose a shape", content: <div className="grid gap-2"><strong>Step two</strong><p className="text-sm text-muted-foreground">Tune the dummy surface.</p></div> },
    { id: "ship", title: "Ship", description: "Confirm the handoff", content: <div className="grid gap-2"><strong>Step three</strong><p className="text-sm text-muted-foreground">Finish to fire the callback.</p></div> },
  ]
  if (done) return <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm"><span className="flex items-center gap-3"><CheckCircle2 aria-hidden="true" />Wizard finished.</span><Button type="button" variant="outline" size="sm" onClick={onReset}>Reset</Button></div>
  return <Wizard steps={steps} onFinish={onFinish} onReset={onReset} className="grid gap-4" />
}

export default function App() {
  const storage = useMemo<CloudStorageContextValue>(
    () => ({
      uploadFile: async (file, options) => {
        options?.onProgress?.(15)
        await wait(180)
        options?.onProgress?.(100)
        return { ...demoImageAttachment, id: `upload-${Date.now()}`, name: file.name, file: file.name, size: file.size }
      },
      fetchAttachment: async (id) => id === demoImageAttachment.id ? demoImageAttachment : id === demoPdfAttachment.id ? demoPdfAttachment : { ...demoImageAttachment, id },
      deleteAttachment: async () => undefined,
      onError: (error) => console.error("Playground storage error", error),
    }),
    [],
  )
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CloudStorageProvider value={storage}>
        <TooltipProvider>
          <StackedModalsProvider>
            <LabPage />
            <Toaster position="bottom-right" toastOptions={{ duration: 2200 }} />
          </StackedModalsProvider>
        </TooltipProvider>
      </CloudStorageProvider>
    </ThemeProvider>
  )
}

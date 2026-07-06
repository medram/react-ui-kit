# Primitives

The primitives layer is the package's themed toolbox: shadcn-style building blocks, mostly backed by Radix, already wired to the local design tokens.

Use this layer when you want layout control and do **not** need the higher-level behavior from the root helpers or Formik fields.

## Starter example

```tsx
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@flowui/ui/primitives"

export function InviteCard() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Invite teammate</CardTitle>
        <CardDescription>Send access without opening a full modal flow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="invite-email">Email</Label>
          <Input id="invite-email" type="email" placeholder="teammate@company.com" />
        </div>
        <Button>Send invite</Button>
      </CardContent>
    </Card>
  )
}
```

## Buttons and basic form primitives

| Export | Use it for |
| --- | --- |
| `Button` | Primary, secondary, outline, ghost, link, and destructive actions. Supports `asChild`. |
| `Label` | Accessible labels for custom form layouts. |
| `Input` | Raw text inputs with the project theme. |
| `Textarea` | Multi-line text areas. |
| `Checkbox` | Boolean selection. |
| `RadioGroup`, `RadioGroupItem` | Mutually exclusive option sets. |
| `Switch` | On/off toggles with optional custom thumb classes. |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue` | Build custom select menus. |
| `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton` | Advanced select composition. |

### Example: composed select

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@flowui/ui/primitives"

export function StatusSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Pick a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Workflow</SelectLabel>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="review">In review</SelectItem>
          <SelectItem value="published">Published</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

## Dialogs, sheets, and confirmation surfaces

| Export group | Use it for |
| --- | --- |
| `Dialog*` | Standard modal dialogs. |
| `AlertDialog*` | Destructive or confirmation flows with explicit action/cancel buttons. |
| `Sheet*` | Slide-out drawers from any side. |

### Example: confirmation dialog

```tsx
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
} from "@flowui/ui/primitives"

export function DeleteProjectButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the project for everyone and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Menus, popovers, and command palettes

| Export group | Use it for |
| --- | --- |
| `Popover*` | Lightweight floating panels anchored to a trigger. |
| `DropdownMenu*` | Action menus, checkable menus, radio menus, and submenus. |
| `Command*` | Search palettes, filterable action lists, and keyboard-driven pickers. |

## Layout and structure

| Export group | Use it for |
| --- | --- |
| `Card*` | Bordered containers with standard spacing. |
| `Table*` | Data tables with project styling. |
| `Separator` | Horizontal or vertical dividers. |
| `ScrollArea`, `ScrollBar` | Scrollable regions with themed scrollbars. |

## Navigation primitives

| Export group | Use it for |
| --- | --- |
| `Tabs*` | Standard top-tab layouts. |
| `Accordion*` | Expand/collapse FAQ or grouped content. |
| `Collapsible*` | Simple one-section show/hide behavior. |

### Example: tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@flowui/ui/primitives"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">Profile settings go here.</TabsContent>
      <TabsContent value="notifications">Notification settings go here.</TabsContent>
    </Tabs>
  )
}
```

## Data display

| Export group | Use it for |
| --- | --- |
| `Alert`, `AlertTitle`, `AlertDescription` | Lightweight inline status messaging. |
| `Badge` | Compact status labels and tags. |
| `Tooltip*` | Hover or focus hints. |
| `Avatar`, `AvatarImage`, `AvatarFallback` | User identity display. |
| `Calendar` | Raw calendar views and date picking. |
| `Skeleton` | Loading placeholders. |

## Chart helpers

These are the low-level pieces behind `@flowui/ui/charts`.

| Export | Use it for |
| --- | --- |
| `ChartContainer` | Shared chart wrapper with theme support. |
| `ChartStyle` | Inject chart theme styles. |
| `ChartTooltip`, `ChartTooltipContent` | Tooltip wrappers and formatters. |
| `ChartLegend`, `ChartLegendContent` | Legend wrappers and formatting helpers. |
| `ChartConfig` | Typed chart configuration shape. |

## Utility exports

| Export | Use it for |
| --- | --- |
| `buttonVariants` | Reusing the button variant system in custom components. |

## Good defaults

- Use `@flowui/ui/primitives` when you want full control over composition.
- Use `@flowui/ui/fields` when you want the same visual language plus labels, validation, and Formik integration.
- Use the root barrel only when a component already solves the full workflow you want.

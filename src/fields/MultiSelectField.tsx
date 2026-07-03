import { ErrorMessage, useField } from "formik"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { ChangeEvent, useMemo, useReducer } from "react"
import FormError from "../components/FormError"
import Help from "../components/Help"
import { cn } from "../lib/cn"
import { Input } from "../primitives/input"
import { Label } from "../primitives/label"

type MultiSelectState = {
  selectedItems: Item[]
  availableSearch: string
  selectedSearch: string
  checkedAvailableItems: string[]
  checkedSelectedItems: string[]
}

type MultiSelectAction =
  | { type: "SET_CHECKED_AVAILABLE"; items: string[] }
  | { type: "SET_CHECKED_SELECTED"; items: string[] }
  | { type: "SET_AVAILABLE_SEARCH"; query: string }
  | { type: "SET_SELECTED_SEARCH"; query: string }
  | { type: "APPLY_SELECTION"; selected: Item[] }
  | { type: "APPLY_DESELECTION"; selected: Item[] }
  | { type: "SET_SELECTED"; selected: Item[] }

function multiSelectReducer(state: MultiSelectState, action: MultiSelectAction): MultiSelectState {
  switch (action.type) {
    case "SET_CHECKED_AVAILABLE":
      return { ...state, checkedAvailableItems: action.items }
    case "SET_CHECKED_SELECTED":
      return { ...state, checkedSelectedItems: action.items }
    case "SET_AVAILABLE_SEARCH":
      return { ...state, availableSearch: action.query }
    case "SET_SELECTED_SEARCH":
      return { ...state, selectedSearch: action.query }
    case "APPLY_SELECTION":
      return { ...state, selectedItems: action.selected, checkedAvailableItems: [] }
    case "APPLY_DESELECTION":
      return { ...state, selectedItems: action.selected, checkedSelectedItems: [] }
    case "SET_SELECTED":
      return { ...state, selectedItems: action.selected }
    default:
      return state
  }
}

type Item = {
  label: string
  value: string | number
}

export type MultiSelectFieldProps = {
  name: string
  label?: string
  className?: string
  availableItems: Item[]
  disabled?: boolean
  help?: string | React.ReactNode
  required?: boolean
  enableSearch?: boolean
  enableMoveAll?: boolean
  itemsClassName?: string
  searchClassName?: string
  selectAllClassName?: string
  onChange?: (items: Item[]) => void
}

export default function MultiSelectField({
  name,
  label,
  help,
  className,
  availableItems,
  disabled,
  required,
  enableSearch = true,
  enableMoveAll = true,
  itemsClassName,
  searchClassName,
  selectAllClassName,
  onChange,
}: MultiSelectFieldProps) {
  const [field, meta, helpers] = useField<(string | number)[]>({
    name,
    validate: (value) => {
      if (required && !value.length) {
        return "Please select at least one item"
      }
    },
  })

  const [state, dispatch] = useReducer(multiSelectReducer, field.value, (fieldValue) => ({
    selectedItems: fieldValue.map((item) => ({
      value: item,
      label: availableItems.find((i) => i.value === item)?.label || item.toString(),
    })),
    availableSearch: "",
    selectedSearch: "",
    checkedAvailableItems: [],
    checkedSelectedItems: [],
  }))
  const {
    selectedItems,
    availableSearch,
    selectedSearch,
    checkedAvailableItems,
    checkedSelectedItems,
  } = state

  // Memoized filtered lists
  const filteredAvailableItems = useMemo(
    () =>
      availableItems.filter(
        (item) =>
          !selectedItems.some((selected) => selected.value === item.value) &&
          item.label.toLowerCase().includes(availableSearch.toLowerCase()),
      ),
    [availableItems, selectedItems, availableSearch],
  )

  const filteredSelectedItems = useMemo(
    () =>
      selectedItems.filter((item) =>
        item.label.toLowerCase().includes(selectedSearch.toLowerCase()),
      ),
    [selectedItems, selectedSearch],
  )

  // Event Handlers
  const handleAvailableItemChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value)
    dispatch({ type: "SET_CHECKED_AVAILABLE", items: selectedOptions })
  }

  const handleSelectedItemChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value)
    dispatch({ type: "SET_CHECKED_SELECTED", items: selectedOptions })
  }

  const handleAddItems: () => void = () => {
    const selected = [
      ...selectedItems,
      ...filteredAvailableItems.filter((item) =>
        checkedAvailableItems.includes(item.value.toString()),
      ),
    ]
    helpers.setValue(selected.map((item) => item.value))
    dispatch({ type: "APPLY_SELECTION", selected })
    onChange?.(selected)
  }

  const handleRemoveItems = () => {
    const selected = selectedItems.filter(
      (item) => !checkedSelectedItems.includes(item.value.toString()),
    )
    helpers.setValue(selected.map((item) => item.value))
    dispatch({ type: "APPLY_DESELECTION", selected })
    onChange?.(selected)
  }

  const handleAddItemOnDoubleClick = (item: Item) => {
    if (availableItems.some((avail) => avail.value === item.value)) {
      const selected = [...selectedItems, item]
      helpers.setValue(selected.map((item) => item.value))
      dispatch({ type: "APPLY_SELECTION", selected })
      onChange?.(selected)
    }
  }

  const handleRemoveItemOnDoubleClick = (item: Item) => {
    if (selectedItems.some((sel) => sel.value === item.value)) {
      const selected = selectedItems.filter((i) => i.value !== item.value)
      helpers.setValue(selected.map((item) => item.value))
      dispatch({ type: "APPLY_DESELECTION", selected })
      onChange?.(selected)
    }
  }

  const handleChooseAll = () => {
    const selected = [
      ...selectedItems,
      ...filteredAvailableItems.filter(
        (item) => !selectedItems.some((sel) => sel.value === item.value),
      ),
    ]
    helpers.setValue(selected.map((item) => item.value))
    dispatch({ type: "SET_SELECTED", selected })
    onChange?.(selected)
  }

  const handleRemoveAll = () => {
    const selected = selectedItems.filter(
      (item) => !filteredSelectedItems.some((sel) => sel.value === item.value),
    )
    helpers.setValue(selected.map((item) => item.value))
    dispatch({ type: "SET_SELECTED", selected })
    onChange?.(selected)
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {availableItems.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4 md:gap-2">
          {/* Available Items */}
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <Label htmlFor="search-available">Available items</Label>
            {enableSearch && (
              <div className="flex items-center gap-2 relative">
                <Input
                  placeholder={`Search available ${label ? label?.toLowerCase() : "items"}`}
                  value={availableSearch}
                  onChange={(e) =>
                    dispatch({ type: "SET_AVAILABLE_SEARCH", query: e.target.value })
                  }
                  name="search-available"
                  disabled={disabled}
                  className={searchClassName}
                />
                <Search className="absolute right-2 text-gray-600 dark:text-gray-200" />
              </div>
            )}
            <select
              multiple
              onChange={handleAvailableItemChange}
              disabled={disabled}
              className={cn(
                "w-full min-h-40 md:min-h-56 overflow-auto rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                itemsClassName,
              )}
            >
              {filteredAvailableItems.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                  onDoubleClick={() => handleAddItemOnDoubleClick(item)}
                >
                  {item.label}
                </option>
              ))}
            </select>
            <div className="flex justify-center">
              {enableMoveAll && (
                <button
                  type="button"
                  className={cn(
                    "bg-transparent text-sm flex justify-center items-center text-gray-800 dark:text-gray-100 gap-1 disabled:opacity-65",
                    selectAllClassName,
                  )}
                  disabled={!filteredAvailableItems.length || disabled}
                  onClick={handleChooseAll}
                >
                  <ChevronRight
                    className={`h-4 w-4 bg-gray-600 rounded-full text-gray-100 dark:bg-gray-100 dark:text-gray-800`}
                    strokeWidth={4}
                  />
                  <span>Choose All</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center md:flex-col">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex flex-row md:flex-col gap-2">
              <button
                onClick={handleAddItems}
                type="button"
                className="disabled:opacity-40 "
                disabled={!(checkedAvailableItems.length > 0 && filteredAvailableItems.length > 0)}
              >
                <ChevronRight
                  className={`h-5 w-5 rounded-full text-gray-100 dark:bg-gray-100 bg-gray-600 dark:text-gray-700 rotate-90 md:rotate-0`}
                  strokeWidth={4}
                />
              </button>
              <button
                onClick={handleRemoveItems}
                type="button"
                className="disabled:opacity-40"
                disabled={!(checkedSelectedItems.length > 0 && filteredSelectedItems.length > 0)}
              >
                <ChevronLeft
                  className={`h-5 w-5 rounded-full text-gray-100 dark:bg-gray-100 bg-gray-600 dark:text-gray-700 rotate-90 md:rotate-0`}
                  strokeWidth={4}
                />
              </button>
            </div>
          </div>

          {/* Selected Items */}
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <Label htmlFor="search-selected">Selected items</Label>
            {enableSearch && (
              <div className="flex items-center gap-2 relative">
                <Input
                  placeholder={`Search selected ${label ? label?.toLowerCase() : "items"}`}
                  value={selectedSearch}
                  onChange={(e) => dispatch({ type: "SET_SELECTED_SEARCH", query: e.target.value })}
                  name="search-selected"
                  disabled={disabled}
                  className={searchClassName}
                />
                <Search className="absolute right-2 text-gray-600 dark:text-gray-200" />
              </div>
            )}
            <select
              multiple
              className={cn(
                "w-full min-h-40 md:min-h-56 overflow-auto rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                itemsClassName,
              )}
              disabled={disabled}
              onChange={handleSelectedItemChange}
            >
              {filteredSelectedItems.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                  onDoubleClick={() => handleRemoveItemOnDoubleClick(item)}
                >
                  {item.label}
                </option>
              ))}
            </select>
            <div className="flex justify-center">
              {enableMoveAll && (
                <button
                  type="button"
                  className={cn(
                    "bg-transparent text-sm flex justify-center items-center text-gray-800 dark:text-gray-100 gap-1 disabled:opacity-65",
                    selectAllClassName,
                  )}
                  disabled={!filteredSelectedItems.length || disabled}
                  onClick={handleRemoveAll}
                >
                  <ChevronLeft
                    className={`h-4 w-4 bg-gray-600 rounded-full text-gray-100 dark:bg-gray-100 dark:text-gray-800`}
                    strokeWidth={4}
                  />
                  <span>Remove All</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}

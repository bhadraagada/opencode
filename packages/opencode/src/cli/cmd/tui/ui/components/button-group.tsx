import { TextAttributes, type RGBA } from "@opentui/core"
import { createSignal, For, type JSX, Show, createMemo } from "solid-js"
import { useTheme, selectedForeground } from "@tui/context/theme"
import { useKeyboard } from "@opentui/solid"

export interface ButtonGroupItem {
  value: string
  label: string
  disabled?: boolean
}

export interface ButtonGroupProps {
  items: ButtonGroupItem[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  variant?: "default" | "outline"
  size?: "sm" | "md"
}

export function ButtonGroup(props: ButtonGroupProps) {
  const { theme } = useTheme()
  const [activeValue, setActiveValue] = createSignal(props.defaultValue ?? props.items[0]?.value ?? "")
  const [focusedIndex, setFocusedIndex] = createSignal(0)

  const currentValue = () => props.value ?? activeValue()
  const size = () => props.size ?? "md"
  const variant = () => props.variant ?? "default"

  const enabledItems = createMemo(() => props.items.filter((item) => !item.disabled))

  const handleSelect = (value: string) => {
    setActiveValue(value)
    props.onChange?.(value)
  }

  const moveFocus = (direction: number) => {
    const enabled = enabledItems()
    if (enabled.length === 0) return

    let newIndex = focusedIndex() + direction
    if (newIndex < 0) newIndex = enabled.length - 1
    if (newIndex >= enabled.length) newIndex = 0

    setFocusedIndex(newIndex)
  }

  useKeyboard((evt) => {
    if (evt.name === "left" || evt.name === "h") moveFocus(-1)
    if (evt.name === "right" || evt.name === "l") moveFocus(1)
    if (evt.name === "return" || evt.name === "space") {
      const enabled = enabledItems()
      if (enabled[focusedIndex()]) {
        handleSelect(enabled[focusedIndex()].value)
      }
    }
  })

  const padding = () => (size() === "sm" ? 1 : 2)

  return (
    <box flexDirection="row">
      <For each={props.items}>
        {(item, index) => {
          const isActive = () => currentValue() === item.value
          const isFocused = () => enabledItems()[focusedIndex()]?.value === item.value
          const isFirst = () => index() === 0
          const isLast = () => index() === props.items.length - 1

          const getBg = (): RGBA | undefined => {
            if (item.disabled) return undefined
            if (isActive()) return theme.primary
            if (isFocused()) return theme.backgroundElement
            return variant() === "outline" ? undefined : theme.backgroundElement
          }

          const getFg = (): RGBA => {
            if (item.disabled) return theme.textMuted
            if (isActive()) return selectedForeground(theme)
            return theme.text
          }

          return (
            <box
              paddingLeft={padding()}
              paddingRight={padding()}
              backgroundColor={getBg()}
              border={variant() === "outline" ? "all" : undefined}
              borderColor={variant() === "outline" ? (isActive() ? theme.primary : theme.border) : undefined}
              onMouseUp={() => {
                if (!item.disabled) {
                  handleSelect(item.value)
                }
              }}
              onMouseOver={() => {
                if (!item.disabled) {
                  const idx = enabledItems().findIndex((i) => i.value === item.value)
                  if (idx !== -1) setFocusedIndex(idx)
                }
              }}
            >
              <text fg={getFg()} attributes={isActive() && !item.disabled ? TextAttributes.BOLD : undefined}>
                {item.label}
              </text>
            </box>
          )
        }}
      </For>
    </box>
  )
}

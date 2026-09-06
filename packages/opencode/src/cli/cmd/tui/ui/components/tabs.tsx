import { TextAttributes, type RGBA } from "@opentui/core"
import { createSignal, For, type JSX, Show, createMemo } from "solid-js"
import { useTheme, selectedForeground } from "@tui/context/theme"
import { useKeyboard } from "@opentui/solid"

export interface TabItem {
  value: string
  label: string
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  orientation?: "horizontal" | "vertical"
  variant?: "underline" | "boxed" | "pills"
}

export function Tabs(props: TabsProps) {
  const { theme } = useTheme()
  const [activeValue, setActiveValue] = createSignal(props.defaultValue ?? props.items[0]?.value ?? "")

  const currentValue = () => props.value ?? activeValue()
  const orientation = () => props.orientation ?? "horizontal"
  const variant = () => props.variant ?? "underline"

  const activeIndex = createMemo(() => {
    const enabledItems = props.items.filter((item) => !item.disabled)
    return enabledItems.findIndex((item) => item.value === currentValue())
  })

  const enabledItems = createMemo(() => props.items.filter((item) => !item.disabled))

  const handleSelect = (value: string) => {
    setActiveValue(value)
    props.onChange?.(value)
  }

  const moveFocus = (direction: number) => {
    const enabled = enabledItems()
    if (enabled.length === 0) return

    let newIndex = activeIndex() + direction
    if (newIndex < 0) newIndex = enabled.length - 1
    if (newIndex >= enabled.length) newIndex = 0

    handleSelect(enabled[newIndex].value)
  }

  useKeyboard((evt) => {
    if (orientation() === "horizontal") {
      if (evt.name === "left" || evt.name === "h") moveFocus(-1)
      if (evt.name === "right" || evt.name === "l") moveFocus(1)
    } else {
      if (evt.name === "up" || evt.name === "k") moveFocus(-1)
      if (evt.name === "down" || evt.name === "j") moveFocus(1)
    }

    // Quick jump with number keys
    if (evt.name && /^[1-9]$/.test(evt.name)) {
      const index = parseInt(evt.name) - 1
      const enabled = enabledItems()
      if (index < enabled.length) {
        handleSelect(enabled[index].value)
      }
    }
  })

  return (
    <box flexDirection={orientation() === "horizontal" ? "row" : "column"} gap={orientation() === "horizontal" ? 2 : 0}>
      <For each={props.items}>
        {(item) => {
          const isActive = () => currentValue() === item.value
          const isDisabled = () => item.disabled ?? false

          const getStyle = (): { fg: RGBA; bg?: RGBA; underline?: boolean } => {
            if (isDisabled()) {
              return { fg: theme.textMuted }
            }

            switch (variant()) {
              case "boxed":
                return {
                  fg: isActive() ? selectedForeground(theme) : theme.text,
                  bg: isActive() ? theme.primary : theme.backgroundElement,
                }
              case "pills":
                return {
                  fg: isActive() ? selectedForeground(theme) : theme.textMuted,
                  bg: isActive() ? theme.primary : undefined,
                }
              default: // underline
                return {
                  fg: isActive() ? theme.primary : theme.textMuted,
                  underline: isActive(),
                }
            }
          }

          return (
            <box
              paddingLeft={variant() === "underline" ? 0 : 1}
              paddingRight={variant() === "underline" ? 0 : 1}
              backgroundColor={getStyle().bg}
              onMouseUp={() => {
                if (!isDisabled()) {
                  handleSelect(item.value)
                }
              }}
            >
              <text fg={getStyle().fg} attributes={isActive() && !isDisabled() ? TextAttributes.BOLD : undefined}>
                {item.label}
              </text>
              <Show when={variant() === "underline" && isActive()}>
                <text fg={theme.primary}>{"\u2501".repeat(item.label.length)}</text>
              </Show>
            </box>
          )
        }}
      </For>
    </box>
  )
}

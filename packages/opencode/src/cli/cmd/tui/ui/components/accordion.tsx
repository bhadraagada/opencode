import { TextAttributes, type RGBA } from "@opentui/core"
import { createSignal, For, type JSX, Show, createMemo, createEffect, on } from "solid-js"
import { useTheme, selectedForeground } from "@tui/context/theme"
import { useKeyboard } from "@opentui/solid"

export interface AccordionItem {
  value: string
  title: string
  content: JSX.Element | string
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  collapsible?: boolean
  onChange?: (value: string | string[]) => void
}

export function Accordion(props: AccordionProps) {
  const { theme } = useTheme()
  const type = () => props.type ?? "single"
  const collapsible = () => props.collapsible ?? true

  const [openItems, setOpenItems] = createSignal<Set<string>>(
    new Set(Array.isArray(props.defaultValue) ? props.defaultValue : props.defaultValue ? [props.defaultValue] : []),
  )
  const [focusedIndex, setFocusedIndex] = createSignal(0)

  const enabledItems = createMemo(() => props.items.filter((item) => !item.disabled))

  const isOpen = (value: string) => openItems().has(value)

  const toggle = (value: string) => {
    const current = openItems()
    const newSet = new Set(current)

    if (type() === "single") {
      if (isOpen(value)) {
        if (collapsible()) {
          newSet.clear()
        }
      } else {
        newSet.clear()
        newSet.add(value)
      }
    } else {
      if (isOpen(value)) {
        newSet.delete(value)
      } else {
        newSet.add(value)
      }
    }

    setOpenItems(newSet)
    props.onChange?.(type() === "single" ? (Array.from(newSet)[0] ?? "") : Array.from(newSet))
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
    if (evt.name === "up" || evt.name === "k") moveFocus(-1)
    if (evt.name === "down" || evt.name === "j") moveFocus(1)
    if (evt.name === "return" || evt.name === "space") {
      const enabled = enabledItems()
      if (enabled[focusedIndex()]) {
        toggle(enabled[focusedIndex()].value)
      }
    }
  })

  return (
    <box flexDirection="column">
      <For each={props.items}>
        {(item, index) => {
          const isFocused = () => enabledItems()[focusedIndex()]?.value === item.value
          const open = () => isOpen(item.value)

          return (
            <box flexDirection="column">
              <box
                flexDirection="row"
                backgroundColor={isFocused() ? theme.backgroundElement : undefined}
                paddingLeft={1}
                paddingRight={1}
                onMouseUp={() => {
                  if (!item.disabled) {
                    toggle(item.value)
                  }
                }}
                onMouseOver={() => {
                  if (!item.disabled) {
                    const idx = enabledItems().findIndex((i) => i.value === item.value)
                    if (idx !== -1) setFocusedIndex(idx)
                  }
                }}
              >
                <text fg={item.disabled ? theme.textMuted : isFocused() ? theme.primary : theme.text} marginRight={1}>
                  {open() ? "\u25BC" : "\u25B6"}
                </text>
                <text
                  fg={item.disabled ? theme.textMuted : theme.text}
                  attributes={isFocused() && !item.disabled ? TextAttributes.BOLD : undefined}
                >
                  {item.title}
                </text>
              </box>
              <Show when={open()}>
                <box paddingLeft={3} paddingTop={1} paddingBottom={1}>
                  {typeof item.content === "string" ? <text fg={theme.text}>{item.content}</text> : item.content}
                </box>
              </Show>
            </box>
          )
        }}
      </For>
    </box>
  )
}

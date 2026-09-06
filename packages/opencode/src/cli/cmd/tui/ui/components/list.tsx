import { TextAttributes, ScrollBoxRenderable } from "@opentui/core"
import { createSignal, createMemo, For, type JSX, Show } from "solid-js"
import { useTheme, selectedForeground } from "@tui/context/theme"
import { useKeyboard } from "@opentui/solid"

export interface ListItem<T = any> {
  id: string
  value: T
  title: string
  description?: string
  icon?: string
  disabled?: boolean
  suffix?: JSX.Element | string
}

export interface ListProps<T = any> {
  items: ListItem<T>[]
  selectedId?: string
  onSelect?: (item: ListItem<T>) => void
  onMove?: (item: ListItem<T>) => void
  maxHeight?: number
  emptyText?: string
  showIndex?: boolean
}

export function List<T>(props: ListProps<T>) {
  const { theme } = useTheme()
  const [selectedIndex, setSelectedIndex] = createSignal(0)

  const enabledItems = createMemo(() => props.items.filter((item) => !item.disabled))

  const selectedItem = createMemo(() => enabledItems()[selectedIndex()])

  let scrollRef: ScrollBoxRenderable | undefined

  const moveFocus = (direction: number) => {
    const enabled = enabledItems()
    if (enabled.length === 0) return

    let newIndex = selectedIndex() + direction
    if (newIndex < 0) newIndex = enabled.length - 1
    if (newIndex >= enabled.length) newIndex = 0

    setSelectedIndex(newIndex)
    props.onMove?.(enabled[newIndex])

    // Scroll into view
    if (scrollRef) {
      const target = scrollRef.getChildren().find((child) => child.id === enabled[newIndex]?.id)
      if (target) {
        const y = target.y - scrollRef.y
        if (y >= scrollRef.height) {
          scrollRef.scrollBy(y - scrollRef.height + 1)
        }
        if (y < 0) {
          scrollRef.scrollBy(y)
        }
      }
    }
  }

  useKeyboard((evt) => {
    if (evt.name === "up" || evt.name === "k") {
      evt.preventDefault()
      moveFocus(-1)
    }
    if (evt.name === "down" || evt.name === "j") {
      evt.preventDefault()
      moveFocus(1)
    }
    if (evt.name === "return") {
      const item = selectedItem()
      if (item) {
        props.onSelect?.(item)
      }
    }
    if (evt.name === "pageup") moveFocus(-10)
    if (evt.name === "pagedown") moveFocus(10)
    if (evt.name === "home" || evt.name === "g") setSelectedIndex(0)
    if (evt.name === "end" || evt.name === "G") setSelectedIndex(enabledItems().length - 1)
  })

  return (
    <Show
      when={props.items.length > 0}
      fallback={
        <box paddingLeft={2} paddingRight={2}>
          <text fg={theme.textMuted}>{props.emptyText ?? "No items"}</text>
        </box>
      }
    >
      <scrollbox
        ref={(r: ScrollBoxRenderable) => (scrollRef = r)}
        maxHeight={props.maxHeight}
        scrollbarOptions={{ visible: false }}
      >
        <For each={props.items}>
          {(item, index) => {
            const isSelected = createMemo(() => {
              if (props.selectedId) {
                return item.id === props.selectedId
              }
              return enabledItems()[selectedIndex()]?.id === item.id
            })

            return (
              <box
                id={item.id}
                flexDirection="row"
                paddingLeft={1}
                paddingRight={1}
                backgroundColor={isSelected() ? theme.primary : undefined}
                onMouseUp={() => {
                  if (!item.disabled) {
                    props.onSelect?.(item)
                  }
                }}
                onMouseOver={() => {
                  if (!item.disabled) {
                    const idx = enabledItems().findIndex((i) => i.id === item.id)
                    if (idx !== -1) setSelectedIndex(idx)
                  }
                }}
              >
                <Show when={props.showIndex}>
                  <text fg={isSelected() ? selectedForeground(theme) : theme.textMuted} marginRight={1}>
                    {(index() + 1).toString().padStart(2, " ")}
                  </text>
                </Show>
                <Show when={item.icon}>
                  <text fg={isSelected() ? selectedForeground(theme) : theme.accent} marginRight={1}>
                    {item.icon}
                  </text>
                </Show>
                <box flexGrow={1} flexDirection="row" justifyContent="space-between">
                  <box>
                    <text
                      fg={item.disabled ? theme.textMuted : isSelected() ? selectedForeground(theme) : theme.text}
                      attributes={isSelected() && !item.disabled ? TextAttributes.BOLD : undefined}
                    >
                      {item.title}
                    </text>
                    <Show when={item.description}>
                      <text fg={isSelected() ? selectedForeground(theme) : theme.textMuted}> {item.description}</text>
                    </Show>
                  </box>
                  <Show when={item.suffix}>
                    {typeof item.suffix === "string" ? (
                      <text fg={isSelected() ? selectedForeground(theme) : theme.textMuted}>{item.suffix}</text>
                    ) : (
                      item.suffix
                    )}
                  </Show>
                </box>
              </box>
            )
          }}
        </For>
      </scrollbox>
    </Show>
  )
}

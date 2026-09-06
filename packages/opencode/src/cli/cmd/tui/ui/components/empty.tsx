import { TextAttributes, type RGBA } from "@opentui/core"
import type { JSX, ParentProps } from "solid-js"
import { Show } from "solid-js"
import { useTheme } from "@tui/context/theme"

export interface EmptyProps {
  icon?: string
  title?: string
  description?: string
  action?: JSX.Element
}

const DEFAULT_ICONS = {
  empty: "\u2205", // Empty set symbol
  search: "\u2315", // Magnifying glass
  error: "\u26A0", // Warning triangle
  inbox: "\u2709", // Envelope
}

export function Empty(props: EmptyProps) {
  const { theme } = useTheme()

  return (
    <box
      flexDirection="column"
      alignItems="center"
      paddingTop={2}
      paddingBottom={2}
      paddingLeft={4}
      paddingRight={4}
      gap={1}
    >
      <Show when={props.icon !== null}>
        <text fg={theme.textMuted} attributes={TextAttributes.BOLD}>
          {props.icon ?? DEFAULT_ICONS.empty}
        </text>
      </Show>
      <Show when={props.title}>
        <text fg={theme.text} attributes={TextAttributes.BOLD}>
          {props.title}
        </text>
      </Show>
      <Show when={props.description}>
        <text fg={theme.textMuted}>{props.description}</text>
      </Show>
      <Show when={props.action}>
        <box marginTop={1}>{props.action}</box>
      </Show>
    </box>
  )
}

// Preset empty states
Empty.NoResults = (props: { query?: string }) => (
  <Empty
    icon={DEFAULT_ICONS.search}
    title="No results found"
    description={props.query ? `No results for "${props.query}"` : "Try adjusting your search"}
  />
)

Empty.NoItems = (props: { itemType?: string }) => (
  <Empty
    icon={DEFAULT_ICONS.inbox}
    title={`No ${props.itemType ?? "items"} yet`}
    description={`${props.itemType ?? "Items"} will appear here`}
  />
)

Empty.Error = (props: { message?: string }) => (
  <Empty icon={DEFAULT_ICONS.error} title="Something went wrong" description={props.message ?? "An error occurred"} />
)

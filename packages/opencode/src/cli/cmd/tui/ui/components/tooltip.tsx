import { TextAttributes } from "@opentui/core"
import { createSignal, type JSX, type ParentProps, Show } from "solid-js"
import { useTheme } from "@tui/context/theme"

export interface TooltipProps {
  content: string | JSX.Element
  position?: "top" | "bottom" | "left" | "right"
}

/**
 * Tooltip component that shows additional information on hover.
 * Note: In terminal UIs, hover is simulated via mouse position tracking.
 * This component is primarily useful for providing context in help text.
 */
export function Tooltip(props: ParentProps<TooltipProps>) {
  const { theme } = useTheme()
  const [visible, setVisible] = createSignal(false)
  const position = () => props.position ?? "top"

  const renderTooltip = () => (
    <box
      position="absolute"
      backgroundColor={theme.backgroundMenu}
      paddingLeft={1}
      paddingRight={1}
      border="all"
      borderColor={theme.border}
    >
      {typeof props.content === "string" ? <text fg={theme.text}>{props.content}</text> : props.content}
    </box>
  )

  return (
    <box onMouseOver={() => setVisible(true)} onMouseOut={() => setVisible(false)}>
      <Show when={visible() && position() === "top"}>{renderTooltip()}</Show>
      {props.children}
      <Show when={visible() && position() === "bottom"}>{renderTooltip()}</Show>
    </box>
  )
}

export interface HoverCardProps {
  trigger: JSX.Element
  content: JSX.Element
  width?: number
}

/**
 * HoverCard component for showing rich content on hover.
 */
export function HoverCard(props: HoverCardProps) {
  const { theme } = useTheme()
  const [visible, setVisible] = createSignal(false)

  return (
    <box onMouseOver={() => setVisible(true)} onMouseOut={() => setVisible(false)}>
      {props.trigger}
      <Show when={visible()}>
        <box
          position="absolute"
          backgroundColor={theme.backgroundPanel}
          paddingLeft={2}
          paddingRight={2}
          paddingTop={1}
          paddingBottom={1}
          border="all"
          borderColor={theme.border}
          width={props.width}
        >
          {props.content}
        </box>
      </Show>
    </box>
  )
}

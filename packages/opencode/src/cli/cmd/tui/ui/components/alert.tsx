import { TextAttributes, type RGBA } from "@opentui/core"
import type { JSX, ParentProps } from "solid-js"
import { Show } from "solid-js"
import { useTheme } from "@tui/context/theme"

export type AlertVariant = "info" | "success" | "warning" | "error"

export interface AlertProps {
  variant?: AlertVariant
  title?: string
  icon?: boolean
}

const ALERT_ICONS: Record<AlertVariant, string> = {
  info: "\u2139", // i in circle
  success: "\u2713", // checkmark
  warning: "\u26A0", // warning triangle
  error: "\u2717", // x mark
}

export function Alert(props: ParentProps<AlertProps>) {
  const { theme } = useTheme()
  const variant = () => props.variant ?? "info"

  const getColor = (): RGBA => {
    switch (variant()) {
      case "success":
        return theme.success
      case "warning":
        return theme.warning
      case "error":
        return theme.error
      default:
        return theme.info
    }
  }

  const showIcon = () => props.icon !== false

  return (
    <box
      paddingLeft={2}
      paddingRight={2}
      paddingTop={1}
      paddingBottom={1}
      border={["left"]}
      borderColor={getColor()}
      backgroundColor={theme.backgroundElement}
      customBorderChars={{
        topLeft: "",
        bottomLeft: "",
        vertical: "\u2503",
        topRight: "",
        bottomRight: "",
        horizontal: " ",
        bottomT: "",
        topT: "",
        cross: "",
        leftT: "",
        rightT: "",
      }}
    >
      <Show when={props.title}>
        <box flexDirection="row" gap={1} marginBottom={1}>
          <Show when={showIcon()}>
            <text fg={getColor()}>{ALERT_ICONS[variant()]}</text>
          </Show>
          <text fg={theme.text} attributes={TextAttributes.BOLD}>
            {props.title}
          </text>
        </box>
      </Show>
      <Show when={!props.title && showIcon()}>
        <box flexDirection="row" gap={1}>
          <text fg={getColor()}>{ALERT_ICONS[variant()]}</text>
          <text fg={theme.text}>{props.children}</text>
        </box>
      </Show>
      <Show when={props.title || !showIcon()}>
        <text fg={theme.text}>{props.children}</text>
      </Show>
    </box>
  )
}

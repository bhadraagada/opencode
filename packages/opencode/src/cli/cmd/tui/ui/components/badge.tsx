import { TextAttributes, type RGBA } from "@opentui/core"
import type { ParentProps } from "solid-js"
import { useTheme } from "@tui/context/theme"

export type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info" | "outline"

export interface BadgeProps {
  variant?: BadgeVariant
  size?: "sm" | "md"
}

export function Badge(props: ParentProps<BadgeProps>) {
  const { theme } = useTheme()

  const getColors = (): { bg: RGBA | undefined; fg: RGBA } => {
    switch (props.variant) {
      case "primary":
        return { bg: theme.primary, fg: theme.background }
      case "secondary":
        return { bg: theme.secondary, fg: theme.background }
      case "success":
        return { bg: theme.success, fg: theme.background }
      case "warning":
        return { bg: theme.warning, fg: theme.background }
      case "error":
        return { bg: theme.error, fg: theme.background }
      case "info":
        return { bg: theme.info, fg: theme.background }
      case "outline":
        return { bg: undefined, fg: theme.textMuted }
      default:
        return { bg: theme.backgroundElement, fg: theme.text }
    }
  }

  const padding = () => (props.size === "sm" ? 0 : 1)

  return (
    <box paddingLeft={padding()} paddingRight={padding()} backgroundColor={getColors().bg}>
      <text fg={getColors().fg} attributes={props.size === "sm" ? undefined : TextAttributes.BOLD}>
        {props.children}
      </text>
    </box>
  )
}

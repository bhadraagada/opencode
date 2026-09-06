import { TextAttributes } from "@opentui/core"
import type { ParentProps } from "solid-js"
import { useTheme } from "@tui/context/theme"

export interface KbdProps {
  /** Whether to show in compact mode (no padding) */
  compact?: boolean
}

/**
 * Keyboard shortcut display component.
 * Renders keyboard shortcuts in a styled box.
 *
 * Usage:
 * <Kbd>ctrl+s</Kbd>
 * <Kbd>esc</Kbd>
 * <Kbd compact>k</Kbd>
 */
export function Kbd(props: ParentProps<KbdProps>) {
  const { theme } = useTheme()

  return (
    <box
      paddingLeft={props.compact ? 0 : 1}
      paddingRight={props.compact ? 0 : 1}
      backgroundColor={theme.backgroundElement}
    >
      <text fg={theme.textMuted} attributes={TextAttributes.BOLD}>
        {props.children}
      </text>
    </box>
  )
}

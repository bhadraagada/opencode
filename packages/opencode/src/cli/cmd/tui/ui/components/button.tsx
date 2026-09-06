import { TextAttributes, type RGBA } from "@opentui/core"
import { createSignal, type ParentProps, Show } from "solid-js"
import { useTheme, selectedForeground } from "@tui/context/theme"

export interface ButtonProps {
  onPress?: () => void
  disabled?: boolean
  variant?: "default" | "primary" | "ghost" | "outline" | "destructive"
  size?: "sm" | "md" | "lg"
  focusId?: string
  autoFocus?: boolean
  focused?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

export function Button(props: ParentProps<ButtonProps>) {
  const { theme } = useTheme()
  const [internalFocused, setInternalFocused] = createSignal(props.autoFocus ?? false)
  const isFocused = () => props.focused ?? internalFocused()

  const padding = () => {
    switch (props.size) {
      case "sm":
        return { x: 1, y: 0 }
      case "lg":
        return { x: 4, y: 1 }
      default:
        return { x: 2, y: 0 }
    }
  }

  const getColors = (): { bg: RGBA | undefined; fg: RGBA; border?: RGBA } => {
    if (props.disabled) {
      return { bg: undefined, fg: theme.textMuted }
    }

    switch (props.variant) {
      case "primary":
        return {
          bg: isFocused() ? theme.primary : theme.backgroundElement,
          fg: isFocused() ? selectedForeground(theme) : theme.primary,
        }
      case "ghost":
        return {
          bg: isFocused() ? theme.backgroundElement : undefined,
          fg: isFocused() ? theme.text : theme.textMuted,
        }
      case "outline":
        return {
          bg: isFocused() ? theme.backgroundElement : undefined,
          fg: isFocused() ? theme.text : theme.textMuted,
          border: theme.border,
        }
      case "destructive":
        return {
          bg: isFocused() ? theme.error : undefined,
          fg: isFocused() ? selectedForeground(theme) : theme.error,
        }
      default:
        return {
          bg: isFocused() ? theme.primary : theme.backgroundElement,
          fg: isFocused() ? selectedForeground(theme) : theme.text,
        }
    }
  }

  return (
    <box
      flexDirection="row"
      onMouseUp={() => {
        if (!props.disabled) {
          props.onPress?.()
        }
      }}
      onMouseOver={() => {
        if (!props.disabled) {
          setInternalFocused(true)
          props.onFocus?.()
        }
      }}
      onMouseOut={() => {
        setInternalFocused(false)
        props.onBlur?.()
      }}
    >
      <Show when={isFocused() && !props.disabled}>
        <text fg={theme.primary}>{"\u25B6 "}</text>
      </Show>
      <Show when={!isFocused() || props.disabled}>
        <text>{"  "}</text>
      </Show>
      <box
        paddingLeft={padding().x}
        paddingRight={padding().x}
        paddingTop={padding().y}
        paddingBottom={padding().y}
        backgroundColor={getColors().bg}
        border={props.variant === "outline" ? "all" : undefined}
        borderColor={getColors().border}
      >
        <text fg={getColors().fg} attributes={isFocused() && !props.disabled ? TextAttributes.BOLD : undefined}>
          {props.children}
        </text>
      </box>
    </box>
  )
}

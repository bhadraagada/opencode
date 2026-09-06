import { TextAttributes, type RGBA } from "@opentui/core"
import type { JSX, ParentProps } from "solid-js"
import { useTheme, selectedForeground } from "@tui/context/theme"

export interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: "sm" | "md"
  label?: string | JSX.Element
}

export function Toggle(props: ToggleProps) {
  const { theme } = useTheme()
  const size = () => props.size ?? "md"
  const checked = () => props.checked ?? false

  const getToggleDisplay = () => {
    if (size() === "sm") {
      return checked() ? "[\u2713]" : "[ ]"
    }
    // md size with switch style
    return checked() ? "[\u25CF\u2500]" : "[\u2500\u25CB]"
  }

  const handleToggle = () => {
    if (!props.disabled) {
      props.onChange?.(!checked())
    }
  }

  return (
    <box flexDirection="row" gap={1} onMouseUp={handleToggle}>
      <text
        fg={props.disabled ? theme.textMuted : checked() ? theme.success : theme.border}
        attributes={checked() && !props.disabled ? TextAttributes.BOLD : undefined}
      >
        {getToggleDisplay()}
      </text>
      {props.label &&
        (typeof props.label === "string" ? (
          <text fg={props.disabled ? theme.textMuted : theme.text}>{props.label}</text>
        ) : (
          props.label
        ))}
    </box>
  )
}

export interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  indeterminate?: boolean
  label?: string | JSX.Element
}

export function Checkbox(props: CheckboxProps) {
  const { theme } = useTheme()
  const checked = () => props.checked ?? false

  const getCheckboxDisplay = () => {
    if (props.indeterminate) return "[\u2500]"
    return checked() ? "[\u2713]" : "[ ]"
  }

  const handleToggle = () => {
    if (!props.disabled) {
      props.onChange?.(!checked())
    }
  }

  return (
    <box flexDirection="row" gap={1} onMouseUp={handleToggle}>
      <text
        fg={props.disabled ? theme.textMuted : checked() ? theme.success : theme.text}
        attributes={checked() && !props.disabled ? TextAttributes.BOLD : undefined}
      >
        {getCheckboxDisplay()}
      </text>
      {props.label &&
        (typeof props.label === "string" ? (
          <text fg={props.disabled ? theme.textMuted : theme.text}>{props.label}</text>
        ) : (
          props.label
        ))}
    </box>
  )
}

export interface RadioProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string | JSX.Element
}

export function Radio(props: RadioProps) {
  const { theme } = useTheme()
  const checked = () => props.checked ?? false

  const getRadioDisplay = () => {
    return checked() ? "(\u25CF)" : "( )"
  }

  const handleSelect = () => {
    if (!props.disabled && !checked()) {
      props.onChange?.(true)
    }
  }

  return (
    <box flexDirection="row" gap={1} onMouseUp={handleSelect}>
      <text
        fg={props.disabled ? theme.textMuted : checked() ? theme.primary : theme.text}
        attributes={checked() && !props.disabled ? TextAttributes.BOLD : undefined}
      >
        {getRadioDisplay()}
      </text>
      {props.label &&
        (typeof props.label === "string" ? (
          <text fg={props.disabled ? theme.textMuted : theme.text}>{props.label}</text>
        ) : (
          props.label
        ))}
    </box>
  )
}

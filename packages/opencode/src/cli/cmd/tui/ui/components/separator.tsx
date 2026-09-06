import { type RGBA } from "@opentui/core"
import { useTheme } from "@tui/context/theme"

export type SeparatorOrientation = "horizontal" | "vertical"
export type SeparatorStyle = "solid" | "dashed" | "dotted" | "double"

export interface SeparatorProps {
  orientation?: SeparatorOrientation
  style?: SeparatorStyle
  color?: RGBA
  label?: string
  length?: number
}

const SEPARATOR_CHARS: Record<SeparatorStyle, { horizontal: string; vertical: string }> = {
  solid: { horizontal: "\u2500", vertical: "\u2502" },
  dashed: { horizontal: "\u2504", vertical: "\u2506" },
  dotted: { horizontal: "\u2508", vertical: "\u250A" },
  double: { horizontal: "\u2550", vertical: "\u2551" },
}

export function Separator(props: SeparatorProps) {
  const { theme } = useTheme()
  const orientation = () => props.orientation ?? "horizontal"
  const style = () => props.style ?? "solid"
  const color = () => props.color ?? theme.border

  if (orientation() === "vertical") {
    const char = SEPARATOR_CHARS[style()].vertical
    const length = props.length ?? 1
    return (
      <box flexDirection="column">
        {Array.from({ length }, (_, i) => (
          <text fg={color()}>{char}</text>
        ))}
      </box>
    )
  }

  const char = SEPARATOR_CHARS[style()].horizontal
  const length = props.length ?? 40

  if (props.label) {
    const labelWithPadding = ` ${props.label} `
    const sideLength = Math.max(0, Math.floor((length - labelWithPadding.length) / 2))
    return (
      <box flexDirection="row">
        <text fg={color()}>{char.repeat(sideLength)}</text>
        <text fg={theme.textMuted}>{labelWithPadding}</text>
        <text fg={color()}>{char.repeat(sideLength)}</text>
      </box>
    )
  }

  return <text fg={color()}>{char.repeat(length)}</text>
}

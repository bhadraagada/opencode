import { type RGBA } from "@opentui/core"
import { createMemo } from "solid-js"
import { useTheme } from "@tui/context/theme"

export interface ProgressProps {
  /** Current progress value (0-100) */
  value: number
  /** Maximum value (default: 100) */
  max?: number
  /** Width of the progress bar in characters */
  width?: number
  /** Visual variant */
  variant?: "default" | "success" | "warning" | "error"
  /** Show percentage text */
  showValue?: boolean
  /** Style of the progress bar */
  style?: "bar" | "blocks" | "dots"
}

export function Progress(props: ProgressProps) {
  const { theme } = useTheme()

  const max = () => props.max ?? 100
  const width = () => props.width ?? 20
  const percentage = createMemo(() => Math.min(100, Math.max(0, (props.value / max()) * 100)))
  const filledWidth = createMemo(() => Math.round((percentage() / 100) * width()))

  const getColor = (): RGBA => {
    switch (props.variant) {
      case "success":
        return theme.success
      case "warning":
        return theme.warning
      case "error":
        return theme.error
      default:
        return theme.primary
    }
  }

  const renderBar = () => {
    const style = props.style ?? "bar"
    const filled = filledWidth()
    const empty = width() - filled

    switch (style) {
      case "blocks": {
        const fullBlock = "\u2588"
        const emptyBlock = "\u2591"
        return fullBlock.repeat(filled) + emptyBlock.repeat(empty)
      }
      case "dots": {
        const fullDot = "\u25CF"
        const emptyDot = "\u25CB"
        return fullDot.repeat(filled) + emptyDot.repeat(empty)
      }
      default: {
        const fullChar = "\u2501"
        const emptyChar = "\u2500"
        return fullChar.repeat(filled) + emptyChar.repeat(empty)
      }
    }
  }

  return (
    <box flexDirection="row" gap={1}>
      <text fg={getColor()}>{renderBar()}</text>
      {props.showValue && <text fg={theme.textMuted}>{Math.round(percentage())}%</text>}
    </box>
  )
}

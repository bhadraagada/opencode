import { createSignal, onMount, onCleanup, Show } from "solid-js"
import { useTheme } from "@tui/context/theme"
import type { RGBA } from "@opentui/core"

export type SpinnerVariant = "dots" | "line" | "arc" | "circle" | "bounce" | "braille"

export interface SpinnerProps {
  variant?: SpinnerVariant
  label?: string
  color?: RGBA
  size?: "sm" | "md" | "lg"
  interval?: number
}

const SPINNER_FRAMES: Record<SpinnerVariant, string[]> = {
  dots: ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"],
  line: ["|", "/", "-", "\\"],
  arc: ["\u25DC", "\u25E0", "\u25DD", "\u25DE", "\u25E1", "\u25DF"],
  circle: ["\u25D0", "\u25D3", "\u25D1", "\u25D2"],
  bounce: ["\u2801", "\u2802", "\u2804", "\u2840", "\u2880", "\u2820", "\u2810", "\u2808"],
  braille: [
    "\u2840",
    "\u2844",
    "\u2846",
    "\u2847",
    "\u28C7",
    "\u28E7",
    "\u28F7",
    "\u28FF",
    "\u28FE",
    "\u28FC",
    "\u28F8",
    "\u28F0",
    "\u28E0",
    "\u28C0",
    "\u2880",
    "\u2800",
  ],
}

export function Spinner(props: SpinnerProps) {
  const { theme } = useTheme()
  const variant = () => props.variant ?? "dots"
  const interval = () => props.interval ?? 80
  const color = () => props.color ?? theme.primary

  const [frameIndex, setFrameIndex] = createSignal(0)

  onMount(() => {
    const timer = setInterval(() => {
      const frames = SPINNER_FRAMES[variant()]
      setFrameIndex((prev) => (prev + 1) % frames.length)
    }, interval())

    onCleanup(() => clearInterval(timer))
  })

  const currentFrame = () => SPINNER_FRAMES[variant()][frameIndex()]

  const getSize = () => {
    switch (props.size) {
      case "sm":
        return 1
      case "lg":
        return 3
      default:
        return 1
    }
  }

  return (
    <box flexDirection="row" gap={1}>
      <text fg={color()}>{currentFrame()}</text>
      <Show when={props.label}>
        <text fg={theme.textMuted}>{props.label}</text>
      </Show>
    </box>
  )
}

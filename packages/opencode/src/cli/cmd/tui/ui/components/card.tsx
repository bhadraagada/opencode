import { type RGBA, TextAttributes } from "@opentui/core"
import type { JSX, ParentProps } from "solid-js"
import { Show } from "solid-js"
import { useTheme } from "@tui/context/theme"

export type BorderStyle = "single" | "double" | "rounded" | "bold" | "none"

export interface CardProps {
  title?: string | JSX.Element
  footer?: string | JSX.Element
  borderStyle?: BorderStyle
  borderColor?: RGBA
  width?: number
  padding?: number
}

const BORDER_CHARS: Record<
  BorderStyle,
  {
    topLeft: string
    topRight: string
    bottomLeft: string
    bottomRight: string
    horizontal: string
    vertical: string
  }
> = {
  single: {
    topLeft: "\u250C",
    topRight: "\u2510",
    bottomLeft: "\u2514",
    bottomRight: "\u2518",
    horizontal: "\u2500",
    vertical: "\u2502",
  },
  double: {
    topLeft: "\u2554",
    topRight: "\u2557",
    bottomLeft: "\u255A",
    bottomRight: "\u255D",
    horizontal: "\u2550",
    vertical: "\u2551",
  },
  rounded: {
    topLeft: "\u256D",
    topRight: "\u256E",
    bottomLeft: "\u2570",
    bottomRight: "\u256F",
    horizontal: "\u2500",
    vertical: "\u2502",
  },
  bold: {
    topLeft: "\u250F",
    topRight: "\u2513",
    bottomLeft: "\u2517",
    bottomRight: "\u251B",
    horizontal: "\u2501",
    vertical: "\u2503",
  },
  none: {
    topLeft: " ",
    topRight: " ",
    bottomLeft: " ",
    bottomRight: " ",
    horizontal: " ",
    vertical: " ",
  },
}

export function Card(props: ParentProps<CardProps>) {
  const { theme } = useTheme()
  const style = () => props.borderStyle ?? "single"
  const padding = () => props.padding ?? 1
  const borderColor = () => props.borderColor ?? theme.border

  return (
    <box
      border="all"
      borderColor={borderColor()}
      customBorderChars={{
        ...BORDER_CHARS[style()],
        bottomT: "",
        topT: "",
        cross: "",
        leftT: "",
        rightT: "",
      }}
      width={props.width}
      backgroundColor={theme.backgroundPanel}
    >
      <Show when={props.title}>
        <box paddingLeft={padding()} paddingRight={padding()} paddingBottom={1}>
          {typeof props.title === "string" ? (
            <text fg={theme.text} attributes={TextAttributes.BOLD}>
              {props.title}
            </text>
          ) : (
            props.title
          )}
        </box>
      </Show>
      <box
        paddingLeft={padding()}
        paddingRight={padding()}
        paddingTop={props.title ? 0 : padding()}
        paddingBottom={props.footer ? 0 : padding()}
      >
        {props.children}
      </box>
      <Show when={props.footer}>
        <box paddingLeft={padding()} paddingRight={padding()} paddingTop={1}>
          {typeof props.footer === "string" ? <text fg={theme.textMuted}>{props.footer}</text> : props.footer}
        </box>
      </Show>
    </box>
  )
}

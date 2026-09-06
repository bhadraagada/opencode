import { TextAttributes, type RGBA } from "@opentui/core"
import type { ParentProps } from "solid-js"
import { useTheme } from "@tui/context/theme"

export type TypographyVariant = "h1" | "h2" | "h3" | "body" | "caption" | "code" | "quote"

export interface TypographyProps {
  variant?: TypographyVariant
  color?: RGBA
  muted?: boolean
  bold?: boolean
  italic?: boolean
}

export function Typography(props: ParentProps<TypographyProps>) {
  const { theme } = useTheme()
  const variant = () => props.variant ?? "body"

  const getStyle = (): { fg: RGBA; attributes?: TextAttributes; prefix?: string } => {
    const baseColor = props.color ?? (props.muted ? theme.textMuted : theme.text)

    switch (variant()) {
      case "h1":
        return {
          fg: theme.text,
          attributes: TextAttributes.BOLD,
          prefix: "# ",
        }
      case "h2":
        return {
          fg: theme.text,
          attributes: TextAttributes.BOLD,
          prefix: "## ",
        }
      case "h3":
        return {
          fg: theme.text,
          attributes: TextAttributes.BOLD,
          prefix: "### ",
        }
      case "caption":
        return {
          fg: theme.textMuted,
        }
      case "code":
        return {
          fg: theme.syntaxString,
        }
      case "quote":
        return {
          fg: theme.textMuted,
          attributes: TextAttributes.ITALIC,
          prefix: "\u2502 ",
        }
      default:
        return {
          fg: baseColor,
          attributes: props.bold ? TextAttributes.BOLD : props.italic ? TextAttributes.ITALIC : undefined,
        }
    }
  }

  const style = () => getStyle()

  return (
    <text fg={style().fg} attributes={style().attributes}>
      {style().prefix}
      {props.children}
    </text>
  )
}

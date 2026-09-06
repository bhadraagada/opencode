import type { RGBA } from "@opentui/core"
import { useTheme } from "@tui/context/theme"

export interface AvatarProps {
  name?: string
  initials?: string
  size?: "sm" | "md" | "lg"
  color?: RGBA
}

export function Avatar(props: AvatarProps) {
  const { theme } = useTheme()
  const color = () => props.color ?? theme.primary

  const getInitials = (): string => {
    if (props.initials) return props.initials.slice(0, 2).toUpperCase()
    if (props.name) {
      const parts = props.name.trim().split(/\s+/)
      if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase()
      }
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return "??"
  }

  const getDisplay = () => {
    const initials = getInitials()
    switch (props.size) {
      case "sm":
        return initials[0] ?? "?"
      case "lg":
        return `[${initials}]`
      default:
        return initials
    }
  }

  return (
    <box paddingLeft={props.size === "lg" ? 1 : 0} paddingRight={props.size === "lg" ? 1 : 0} backgroundColor={color()}>
      <text fg={theme.background}>{getDisplay()}</text>
    </box>
  )
}

export interface AvatarGroupProps {
  avatars: AvatarProps[]
  max?: number
  size?: "sm" | "md" | "lg"
}

export function AvatarGroup(props: AvatarGroupProps) {
  const { theme } = useTheme()
  const max = () => props.max ?? 3
  const size = () => props.size ?? "md"

  const visibleAvatars = () => props.avatars.slice(0, max())
  const overflow = () => props.avatars.length - max()

  return (
    <box flexDirection="row" gap={0}>
      {visibleAvatars().map((avatar) => (
        <Avatar {...avatar} size={size()} />
      ))}
      {overflow() > 0 && (
        <box paddingLeft={1}>
          <text fg={theme.textMuted}>+{overflow()}</text>
        </box>
      )}
    </box>
  )
}

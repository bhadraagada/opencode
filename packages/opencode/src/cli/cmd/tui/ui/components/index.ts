/**
 * haukTUI-inspired UI Components for OpenCode TUI
 *
 * A collection of shadcn-style terminal UI components built with SolidJS and @opentui/solid.
 * These components provide consistent, keyboard-first, and themeable building blocks
 * for terminal user interfaces.
 *
 * ## Primitives
 * - Button: Focusable button with keyboard activation and multiple variants
 * - Badge: Small status indicator labels
 * - Kbd: Keyboard shortcut display
 * - Typography: Text styling variants (headings, body, code, quote)
 * - Avatar: User avatar with initials
 * - Separator: Visual divider (horizontal/vertical)
 *
 * ## Input
 * - Toggle/Checkbox/Radio: Form toggle components
 * - ButtonGroup: Group of toggle buttons
 *
 * ## Layout
 * - Card: Container card with border styles
 * - Accordion: Collapsible sections
 * - List: Scrollable list with selection
 *
 * ## Navigation
 * - Tabs: Tab navigation with horizontal/vertical layouts
 *
 * ## Feedback
 * - Alert: Alert messages with variants (info, success, warning, error)
 * - Progress: Progress bar with multiple styles
 * - Spinner: Animated loading spinner with multiple variants
 * - Empty: Empty state display
 * - Tooltip/HoverCard: Hover information display
 *
 * ## Usage
 *
 * ```tsx
 * import { Button, Card, Alert, Badge } from "@tui/ui/components"
 *
 * function MyComponent() {
 *   return (
 *     <Card title="Welcome">
 *       <Alert variant="info">Press Enter to continue</Alert>
 *       <Button variant="primary" onPress={() => {}}>
 *         Submit <Badge variant="success">New</Badge>
 *       </Button>
 *     </Card>
 *   )
 * }
 * ```
 */

// Primitives
export { Button, type ButtonProps } from "./button"
export { Badge, type BadgeProps, type BadgeVariant } from "./badge"
export { Kbd, type KbdProps } from "./kbd"
export { Typography, type TypographyProps, type TypographyVariant } from "./typography"
export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from "./avatar"
export { Separator, type SeparatorProps, type SeparatorOrientation, type SeparatorStyle } from "./separator"

// Input
export { Toggle, Checkbox, Radio, type ToggleProps, type CheckboxProps, type RadioProps } from "./toggle"
export { ButtonGroup, type ButtonGroupProps, type ButtonGroupItem } from "./button-group"

// Layout
export { Card, type CardProps, type BorderStyle } from "./card"
export { Accordion, type AccordionProps, type AccordionItem } from "./accordion"
export { List, type ListProps, type ListItem } from "./list"

// Navigation
export { Tabs, type TabsProps, type TabItem } from "./tabs"

// Feedback
export { Alert, type AlertProps, type AlertVariant } from "./alert"
export { Progress, type ProgressProps } from "./progress"
export { Spinner, type SpinnerProps, type SpinnerVariant } from "./spinner-basic"
export { Empty, type EmptyProps } from "./empty"
export { Tooltip, HoverCard, type TooltipProps, type HoverCardProps } from "./tooltip"

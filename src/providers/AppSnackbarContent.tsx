import type { CustomContentProps } from 'notistack'
import { forwardRef } from 'react'
import { useTheme } from 'styled-components'

export const AppSnackbarContent = forwardRef<HTMLDivElement, CustomContentProps>(
  function AppSnackbarContent(props, ref) {
    const theme = useTheme()
    const { message, variant, style } = props

    const backgroundColor =
      variant === 'success'
        ? theme.colors.success
        : variant === 'error'
          ? theme.colors.warning
          : theme.colors.inkStrong

    return (
      <div
        ref={ref}
        role="alert"
        style={{
          ...style,
          backgroundColor,
          borderRadius: theme.radii.sm,
          boxShadow: theme.shadows.card,
          fontFamily: theme.typography.body,
          fontSize: '0.875rem',
          fontWeight: 600,
          color: theme.colors.surface,
          padding: '10px 16px',
          maxWidth: '24rem',
        }}
      >
        {message}
      </div>
    )
  },
)

import { SnackbarProvider } from 'notistack'
import type { ReactNode } from 'react'
import { AppSnackbarContent } from './AppSnackbarContent'

export function AppSnackbarProvider({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={4000}
      preventDuplicate
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      Components={{
        success: AppSnackbarContent,
        error: AppSnackbarContent,
      }}
    >
      {children}
    </SnackbarProvider>
  )
}

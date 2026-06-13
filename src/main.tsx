import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import App from './App'
import { GlobalStyles } from './design-system/theme/GlobalStyles'
import { theme } from './design-system/theme/theme'
import { AppSnackbarProvider } from './providers/AppSnackbarProvider'
import { ConfirmDialogProvider } from './components/confirm-dialog/ConfirmDialogProvider'
import { QueryProvider } from './providers/QueryProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <AppSnackbarProvider>
          <ConfirmDialogProvider>
            <GlobalStyles />
            <App />
          </ConfirmDialogProvider>
        </AppSnackbarProvider>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>,
)

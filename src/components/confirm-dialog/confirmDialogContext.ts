import { createContext } from 'react'
import type { ConfirmDialogContextValue } from './confirmDialog.types'

export const ConfirmDialogContext = createContext<
  ConfirmDialogContextValue | undefined
>(undefined)

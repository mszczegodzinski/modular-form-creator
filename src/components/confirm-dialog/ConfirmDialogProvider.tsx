import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { ConfirmDialogContext } from './confirmDialogContext'
import type { ConfirmDialogOptions, ConfirmDialogState } from './confirmDialog.types'

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmDialogState | null>(null)
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const closeDialog = useCallback((result: boolean) => {
    resolveRef.current?.(result)
    resolveRef.current = null
    setDialog(null)
  }, [])

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
      setDialog(options)
    })
  }, [])

  const value = useMemo(() => ({ confirm }), [confirm])

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      <ConfirmDialog
        dialog={dialog}
        onConfirm={() => closeDialog(true)}
        onCancel={() => closeDialog(false)}
      />
    </ConfirmDialogContext.Provider>
  )
}

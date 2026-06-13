import { useEffect } from 'react'
import { Button } from '../../design-system'
import {
  DestructiveButtonWrap,
  DialogActions,
  DialogMessage,
  DialogPanel,
  DialogTitle,
  Overlay,
} from './ConfirmDialog.styles'
import type { ConfirmDialogState } from './confirmDialog.types'

interface ConfirmDialogProps {
  dialog: ConfirmDialogState | null
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ dialog, onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    if (!dialog) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [dialog, onCancel])

  if (!dialog) {
    return null
  }

  const confirmLabel = dialog.confirmLabel ?? 'Confirm'
  const cancelLabel = dialog.cancelLabel ?? 'Cancel'

  return (
    <Overlay onClick={onCancel} aria-hidden={false}>
      <DialogPanel
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={(event) => event.stopPropagation()}
      >
        <DialogTitle id="confirm-dialog-title">{dialog.title}</DialogTitle>
        <DialogMessage id="confirm-dialog-message">{dialog.message}</DialogMessage>
        <DialogActions>
          <Button type="button" variant="ghost" size="small" onClick={onCancel}>
            {cancelLabel}
          </Button>
          {dialog.destructive ? (
            <DestructiveButtonWrap>
              <Button type="button" variant="primary" size="small" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </DestructiveButtonWrap>
          ) : (
            <Button type="button" variant="primary" size="small" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </DialogActions>
      </DialogPanel>
    </Overlay>
  )
}

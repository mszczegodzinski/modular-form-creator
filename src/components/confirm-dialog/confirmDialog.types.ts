export interface ConfirmDialogOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

export type ConfirmDialogState = ConfirmDialogOptions

export interface ConfirmDialogContextValue {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>
}

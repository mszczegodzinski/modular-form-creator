import { useSnackbar } from 'notistack'
import { useCallback } from 'react'
import { getErrorMessage } from '../utils/getErrorMessage'

export function useAppSnackbar() {
  const { enqueueSnackbar } = useSnackbar()

  const showSuccess = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: 'success' })
    },
    [enqueueSnackbar],
  )

  const showError = useCallback(
    (error: unknown, fallback = 'Something went wrong.') => {
      enqueueSnackbar(getErrorMessage(error, fallback), { variant: 'error' })
    },
    [enqueueSnackbar],
  )

  return { showSuccess, showError }
}

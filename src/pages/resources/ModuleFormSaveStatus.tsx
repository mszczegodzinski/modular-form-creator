import { useEffect, useState } from 'react'
import { SaveStatus, SaveStatusIcon } from './BasicInfoPage.styles'

const EDIT_STATUS_DEBOUNCE_MS = 300

type SaveStatusTone = 'success' | 'info' | 'neutral'

interface ModuleFormSaveStatusProps {
  draftSignature: string
  hasUnsavedEdits: boolean
  isCompletedResource: boolean
}

export function ModuleFormSaveStatus({
  draftSignature,
  hasUnsavedEdits,
  isCompletedResource,
}: ModuleFormSaveStatusProps) {
  const [debouncedSignature, setDebouncedSignature] = useState(draftSignature)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSignature(draftSignature)
    }, EDIT_STATUS_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [draftSignature])

  const isEditing = draftSignature !== debouncedSignature

  let tone: SaveStatusTone = 'neutral'
  let message = 'Editing…'

  if (!isEditing) {
    if (hasUnsavedEdits) {
      tone = 'info'
      message = isCompletedResource
        ? 'Unsaved local changes'
        : 'Unsaved changes — use Save module'
    } else {
      tone = 'success'
      message = isCompletedResource ? 'No pending edits' : 'In sync with server'
    }
  }

  return (
    <SaveStatus role="status" aria-live="polite" $tone={tone}>
      {tone === 'success' ? (
        <>
          <SaveStatusIcon aria-hidden="true">✓</SaveStatusIcon>
          {message}
        </>
      ) : (
        message
      )}
    </SaveStatus>
  )
}

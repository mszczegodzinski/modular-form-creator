import { useContext } from 'react'
import { ResourceWorkspaceContext } from './resourceWorkspaceContext'

export function useResourceWorkspace() {
  const context = useContext(ResourceWorkspaceContext)

  if (!context) {
    throw new Error(
      'useResourceWorkspace must be used within ResourceWorkspaceProvider',
    )
  }

  return context
}

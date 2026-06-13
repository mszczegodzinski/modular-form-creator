import { Outlet } from 'react-router-dom'
import { ResourceWorkspaceProvider } from './ResourceWorkspaceProvider'

export function ResourceWorkspaceLayout() {
  return (
    <ResourceWorkspaceProvider>
      <Outlet />
    </ResourceWorkspaceProvider>
  )
}

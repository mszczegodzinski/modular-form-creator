import { useLayoutEffect, type ReactNode } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useResourceQuery } from '../../api'
import { ResourceWorkspaceProvider } from './ResourceWorkspaceProvider'
import { useResourceWorkspace } from './useResourceWorkspace'
import { toWorkspaceResourceId } from './resourceWorkspace.utils'

function ResourceWorkspaceInitializer({ children }: { children: ReactNode }) {
  const { resourceId } = useParams<{ resourceId: string }>()
  const resourceQuery = useResourceQuery(resourceId)
  const {
    basicInfoDrafts,
    projectDetailsDrafts,
    initializeBasicInfoDraft,
    initializeProjectDetailsDraft,
  } = useResourceWorkspace()

  useLayoutEffect(() => {
    if (!resourceId || !resourceQuery.data) {
      return
    }

    initializeBasicInfoDraft(resourceId, resourceQuery.data)
    initializeProjectDetailsDraft(resourceId, resourceQuery.data)
  }, [
    initializeBasicInfoDraft,
    initializeProjectDetailsDraft,
    resourceId,
    resourceQuery.data,
  ])

  if (!resourceId || resourceQuery.isPending) {
    return <>{children}</>
  }

  if (resourceQuery.isError) {
    return <>{children}</>
  }

  const workspaceResourceId = toWorkspaceResourceId(resourceId)
  const draftsReady = Boolean(
    basicInfoDrafts[workspaceResourceId] && projectDetailsDrafts[workspaceResourceId],
  )

  if (!draftsReady) {
    return null
  }

  return <>{children}</>
}

export function ResourceWorkspaceLayout() {
  return (
    <ResourceWorkspaceProvider>
      <ResourceWorkspaceInitializer>
        <Outlet />
      </ResourceWorkspaceInitializer>
    </ResourceWorkspaceProvider>
  )
}

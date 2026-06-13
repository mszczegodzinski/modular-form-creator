import { useParams } from 'react-router-dom'
import type { BasicInfo, ProjectDetails, Resource } from '../../api'
import { buildReplaceResourcePayload, hasBufferedResourceEdits } from './completedResourceSubmit'
import { useResourceWorkspace } from './useResourceWorkspace'
import { toWorkspaceResourceId } from './resourceWorkspace.utils'

export function useResourceSummaryView(resource: Resource | undefined) {
  const { resourceId } = useParams<{ resourceId: string }>()
  const { basicInfoDrafts, projectDetailsDrafts } = useResourceWorkspace()

  if (!resourceId || !resource) {
    return {
      isReady: false,
      displayedBasicInfo: undefined,
      displayedProjectDetails: undefined,
      hasPendingEdits: false,
    }
  }

  const workspaceResourceId = toWorkspaceResourceId(resourceId)
  const basicInfoDraft = basicInfoDrafts[workspaceResourceId]
  const projectDetailsDraft = projectDetailsDrafts[workspaceResourceId]

  if (!basicInfoDraft || !projectDetailsDraft) {
    return {
      isReady: false,
      displayedBasicInfo: undefined,
      displayedProjectDetails: undefined,
      hasPendingEdits: false,
    }
  }

  const summaryData = buildReplaceResourcePayload(
    resource,
    basicInfoDraft,
    projectDetailsDraft,
  )

  return {
    isReady: true,
    displayedBasicInfo: summaryData.basicInfo,
    displayedProjectDetails: summaryData.projectDetails,
    hasPendingEdits: hasBufferedResourceEdits(
      resource,
      basicInfoDraft,
      projectDetailsDraft,
    ),
  }
}

export type ResourceSummaryView = {
  isReady: boolean
  displayedBasicInfo: BasicInfo | undefined
  displayedProjectDetails: ProjectDetails | undefined
  hasPendingEdits: boolean
}

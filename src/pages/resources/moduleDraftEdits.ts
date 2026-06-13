import type { BasicInfo, ProjectDetails, Resource } from '../../api'
import { toBasicInfoPayload } from './basicInfoValidation'
import { toProjectDetailsPayload } from './projectDetailsValidation'
import {
  createBasicInfoDraftFromResource,
  createProjectDetailsDraftFromResource,
} from './resourceWorkspace.utils'

export function hasBasicInfoDraftEdits(
  resource: Resource,
  draft: BasicInfo,
): boolean {
  const savedDraft = createBasicInfoDraftFromResource(resource)

  return (
    JSON.stringify(toBasicInfoPayload(draft)) !==
    JSON.stringify(toBasicInfoPayload(savedDraft))
  )
}

export function hasProjectDetailsDraftEdits(
  resource: Resource,
  draft: ProjectDetails,
): boolean {
  const savedDraft = createProjectDetailsDraftFromResource(resource)

  return (
    JSON.stringify(toProjectDetailsPayload(draft)) !==
    JSON.stringify(toProjectDetailsPayload(savedDraft))
  )
}

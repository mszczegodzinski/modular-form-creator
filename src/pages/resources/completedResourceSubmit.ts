import type { BasicInfo, ProjectDetails, ReplaceResourcePayload, Resource } from '../../api'
import { toBasicInfoPayload, validateBasicInfo } from './basicInfoValidation'
import {
  toProjectDetailsPayload,
  validateProjectDetails,
} from './projectDetailsValidation'
import {
  createBasicInfoDraftFromResource,
  createProjectDetailsDraftFromResource,
} from './resourceWorkspace.utils'

export function buildReplaceResourcePayload(
  resource: Resource,
  basicInfoDraft: BasicInfo | undefined,
  projectDetailsDraft: ProjectDetails | undefined,
): ReplaceResourcePayload {
  const basicInfo = toBasicInfoPayload(
    basicInfoDraft ?? createBasicInfoDraftFromResource(resource),
  )
  const projectDetails = toProjectDetailsPayload(
    projectDetailsDraft ?? createProjectDetailsDraftFromResource(resource),
  )

  return {
    name: basicInfo.resourceName,
    basicInfo,
    projectDetails,
  }
}

export function hasBufferedResourceEdits(
  resource: Resource,
  basicInfoDraft: BasicInfo | undefined,
  projectDetailsDraft: ProjectDetails | undefined,
): boolean {
  const currentPayload = buildReplaceResourcePayload(
    resource,
    basicInfoDraft,
    projectDetailsDraft,
  )
  const savedPayload = buildReplaceResourcePayload(resource, undefined, undefined)

  return JSON.stringify(currentPayload) !== JSON.stringify(savedPayload)
}

export function validateReplaceResourcePayload(
  payload: ReplaceResourcePayload,
): string | undefined {
  const basicInfoErrors = validateBasicInfo(payload.basicInfo)
  const projectDetailsErrors = validateProjectDetails(payload.projectDetails)

  const messages = [
    ...Object.values(basicInfoErrors),
    ...Object.values(projectDetailsErrors),
  ]

  if (messages.length === 0) {
    return undefined
  }

  return messages[0]
}

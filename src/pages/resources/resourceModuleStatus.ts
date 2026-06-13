import type { BasicInfo, ProjectDetails, Resource } from '../../api'

export function isBasicInfoComplete(basicInfo: BasicInfo): boolean {
  return Boolean(
    basicInfo.resourceName &&
      basicInfo.owner &&
      basicInfo.email &&
      basicInfo.description &&
      basicInfo.priority,
  )
}

export function isProjectDetailsComplete(projectDetails: ProjectDetails): boolean {
  return Boolean(
    projectDetails.projectName &&
      projectDetails.budget &&
      projectDetails.category &&
      projectDetails.options.length > 0,
  )
}

export function canAccessProjectDetails(resource: Resource): boolean {
  if (resource.status === 'completed') {
    return true
  }

  return isBasicInfoComplete(resource.basicInfo)
}

export function canProvisionResource(resource: Resource): boolean {
  if (resource.status === 'completed') {
    return false
  }

  return (
    isBasicInfoComplete(resource.basicInfo) &&
    isProjectDetailsComplete(resource.projectDetails)
  )
}

import type { BasicInfo, ProjectDetails, Resource } from '../../api'

export const PRIORITY_OPTIONS = [
  { value: '', label: 'Select priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const

export const CATEGORY_OPTIONS = [
  { value: '', label: 'Select category' },
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
  { value: 'vendor', label: 'Vendor' },
] as const

export const TEAM_MEMBER_OPTIONS = [
  'FE devs',
  'BE devs',
  'Designer',
  'Data Eng',
  'Product Owner',
] as const

export function getResourceName(resource: Resource): string {
  return resource.basicInfo.resourceName.trim() || resource.name
}

export function createBasicInfoDraftFromResource(resource: Resource): BasicInfo {
  return {
    resourceName: getResourceName(resource),
    owner: resource.basicInfo.owner,
    email: resource.basicInfo.email,
    description: resource.basicInfo.description,
    priority: resource.basicInfo.priority,
  }
}

export function createEmptyBasicInfoDraft(resourceName: string): BasicInfo {
  return {
    resourceName,
    owner: '',
    email: '',
    description: '',
    priority: '',
  }
}

export function createProjectDetailsDraftFromResource(
  resource: Resource,
): ProjectDetails {
  return {
    projectName: resource.projectDetails.projectName,
    budget: resource.projectDetails.budget,
    category: resource.projectDetails.category,
    options: [...resource.projectDetails.options],
  }
}

export function createEmptyProjectDetailsDraft(): ProjectDetails {
  return {
    projectName: '',
    budget: '',
    category: '',
    options: [],
  }
}

export function toWorkspaceResourceId(resourceId: string | number): string {
  return String(resourceId)
}

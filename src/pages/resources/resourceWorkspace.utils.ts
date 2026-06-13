import type { BasicInfo, Resource } from '../../api'

export const PRIORITY_OPTIONS = [
  { value: '', label: 'Select priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
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

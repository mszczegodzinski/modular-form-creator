import { createContext } from 'react'
import type { BasicInfo, ProjectDetails, Resource } from '../../api'

export interface ResourceWorkspaceContextValue {
  getBasicInfoDraft: (resourceId: string) => BasicInfo | undefined
  initializeBasicInfoDraft: (resourceId: string, resource: Resource) => void
  updateBasicInfoField: (
    resourceId: string,
    field: keyof BasicInfo,
    value: string,
  ) => void
  clearBasicInfoDraft: (resourceId: string, resourceName: string) => void
  syncBasicInfoDraft: (resourceId: string, resource: Resource) => void
  getProjectDetailsDraft: (resourceId: string) => ProjectDetails | undefined
  initializeProjectDetailsDraft: (resourceId: string, resource: Resource) => void
  updateProjectDetailsField: (
    resourceId: string,
    field: 'projectName' | 'budget' | 'category',
    value: string,
  ) => void
  updateProjectDetailsOptions: (resourceId: string, options: string[]) => void
  clearProjectDetailsDraft: (resourceId: string) => void
  syncProjectDetailsDraft: (resourceId: string, resource: Resource) => void
}

export const ResourceWorkspaceContext = createContext<
  ResourceWorkspaceContextValue | undefined
>(undefined)

import { createContext } from 'react'
import type { BasicInfo, Resource } from '../../api'

export interface ResourceWorkspaceContextValue {
  getBasicInfoDraft: (resourceId: string) => BasicInfo | undefined
  initializeBasicInfoDraft: (resourceId: string, resource: Resource) => void
  updateBasicInfoField: (
    resourceId: string,
    field: keyof BasicInfo,
    value: string,
  ) => void
  clearBasicInfoDraft: (resourceId: string, resourceName: string) => void
}

export const ResourceWorkspaceContext = createContext<
  ResourceWorkspaceContextValue | undefined
>(undefined)

import type { BasicInfo, ProjectDetails, Resource } from '../../api'

export interface ResourceWorkspaceContextValue {
  basicInfoDrafts: Record<string, BasicInfo>
  projectDetailsDrafts: Record<string, ProjectDetails>
  getBasicInfoDraft: (resourceId: string | number) => BasicInfo | undefined
  initializeBasicInfoDraft: (resourceId: string | number, resource: Resource) => void
  updateBasicInfoField: (
    resourceId: string | number,
    field: keyof BasicInfo,
    value: string,
  ) => void
  clearBasicInfoDraft: (resourceId: string | number, resourceName: string) => void
  syncBasicInfoDraft: (resourceId: string | number, resource: Resource) => void
  getProjectDetailsDraft: (resourceId: string | number) => ProjectDetails | undefined
  initializeProjectDetailsDraft: (
    resourceId: string | number,
    resource: Resource,
  ) => void
  updateProjectDetailsField: (
    resourceId: string | number,
    field: 'projectName' | 'budget' | 'category',
    value: string,
  ) => void
  updateProjectDetailsOptions: (resourceId: string | number, options: string[]) => void
  clearProjectDetailsDraft: (resourceId: string | number) => void
  syncProjectDetailsDraft: (resourceId: string | number, resource: Resource) => void
}

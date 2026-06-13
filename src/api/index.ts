export { API_BASE_URL } from './config'
export { apiClient } from './client'
export { ApiRequestError } from './types/api-error'
export type { ApiErrorBody } from './types/api-error'
export type {
  BasicInfo,
  CreateResourcePayload,
  ListResourcesParams,
  ListResourcesResponse,
  ProjectDetails,
  ReplaceResourcePayload,
  Resource,
  ResourceStatus,
} from './types/resource'
export {
  createResource,
  deleteResource,
  fetchResource,
  fetchResources,
  provisionResource,
  replaceResource,
  resourcesKeys,
  updateBasicInfo,
  updateProjectDetails,
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useProvisionResourceMutation,
  useReplaceResourceMutation,
  useResourceQuery,
  useResourcesQuery,
  useUpdateBasicInfoMutation,
  useUpdateProjectDetailsMutation,
} from './resources'

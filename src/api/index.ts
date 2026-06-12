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
  Resource,
  ResourceStatus,
} from './types/resource'
export {
  createResource,
  fetchResources,
  resourcesKeys,
  useCreateResourceMutation,
  useResourcesQuery,
} from './resources'

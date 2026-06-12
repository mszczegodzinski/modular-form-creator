import { apiClient } from '../client'
import type {
  CreateResourcePayload,
  ListResourcesParams,
  ListResourcesResponse,
  Resource,
} from '../types/resource'

function buildListResourcesParams(params: ListResourcesParams = {}) {
  const { name, ...rest } = params

  return {
    ...rest,
    ...(name?.trim() ? { name: name.trim() } : {}),
  }
}

export async function fetchResources(params?: ListResourcesParams) {
  const { data } = await apiClient.get<ListResourcesResponse>('/api/resources', {
    params: buildListResourcesParams(params),
  })

  return data
}

export async function createResource(payload: CreateResourcePayload) {
  const { data } = await apiClient.post<Resource>('/api/resources', payload)

  return data
}

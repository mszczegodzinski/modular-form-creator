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

export async function fetchResource(id: string) {
  const { data } = await apiClient.get<Resource>(`/api/resources/${id}`)

  return data
}

export async function deleteResource(resourceId: number) {
  const { data } = await apiClient.delete<Resource>(
    `/api/resources/${resourceId}`,
  )

  return data
}

export async function provisionResource(id: string) {
  const { data } = await apiClient.patch<Resource>(
    `/api/resources/${id}/provisioning`,
  )

  return data
}

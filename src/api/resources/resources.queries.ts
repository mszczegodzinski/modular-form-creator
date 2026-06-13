import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  BasicInfo,
  CreateResourcePayload,
  ListResourcesParams,
  ProjectDetails,
} from '../types/resource'
import {
  createResource,
  deleteResource,
  fetchResource,
  fetchResources,
  provisionResource,
  updateBasicInfo,
  updateProjectDetails,
} from './resources.api'
import { resourcesKeys } from './resources.keys'

export function useResourcesQuery(params: ListResourcesParams = {}) {
  return useQuery({
    queryKey: resourcesKeys.list(params),
    queryFn: () => fetchResources(params),
  })
}

export function useCreateResourceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateResourcePayload) => createResource(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourcesKeys.lists() })
    },
  })
}

export function useDeleteResourceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (resourceId: number) => deleteResource(resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourcesKeys.lists() })
    },
  })
}

export function useResourceQuery(id: string | undefined) {
  return useQuery({
    queryKey: resourcesKeys.detail(id ?? ''),
    queryFn: () => fetchResource(id!),
    enabled: Boolean(id),
  })
}

export function useProvisionResourceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => provisionResource(id),
    onSuccess: (resource, id) => {
      queryClient.setQueryData(resourcesKeys.detail(id), resource)
      queryClient.invalidateQueries({ queryKey: resourcesKeys.lists() })
    },
  })
}

export function useUpdateBasicInfoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BasicInfo }) =>
      updateBasicInfo(id, payload),
    onSuccess: (resource, { id }) => {
      queryClient.setQueryData(resourcesKeys.detail(id), resource)
      queryClient.invalidateQueries({ queryKey: resourcesKeys.lists() })
    },
  })
}

export function useUpdateProjectDetailsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProjectDetails }) =>
      updateProjectDetails(id, payload),
    onSuccess: (resource, { id }) => {
      queryClient.setQueryData(resourcesKeys.detail(id), resource)
      queryClient.invalidateQueries({ queryKey: resourcesKeys.lists() })
    },
  })
}

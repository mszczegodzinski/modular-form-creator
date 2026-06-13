import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  CreateResourcePayload,
  ListResourcesParams,
} from '../types/resource'
import { createResource, deleteResource, fetchResources } from './resources.api'
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

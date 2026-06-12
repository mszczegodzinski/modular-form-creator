import type { ListResourcesParams } from '../types/resource'

export const resourcesKeys = {
  all: ['resources'] as const,
  lists: () => [...resourcesKeys.all, 'list'] as const,
  list: (params: ListResourcesParams = {}) =>
    [...resourcesKeys.lists(), params] as const,
}

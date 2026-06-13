import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { BasicInfo, Resource } from '../../api'
import { ResourceWorkspaceContext } from './resourceWorkspaceContext'
import {
  createBasicInfoDraftFromResource,
  createEmptyBasicInfoDraft,
} from './resourceWorkspace.utils'

export function ResourceWorkspaceProvider({ children }: { children: ReactNode }) {
  const [basicInfoDrafts, setBasicInfoDrafts] = useState<
    Record<string, BasicInfo>
  >({})

  const getBasicInfoDraft = useCallback(
    (resourceId: string) => basicInfoDrafts[resourceId],
    [basicInfoDrafts],
  )

  const initializeBasicInfoDraft = useCallback(
    (resourceId: string, resource: Resource) => {
      setBasicInfoDrafts((current) => {
        if (current[resourceId]) {
          return current
        }

        return {
          ...current,
          [resourceId]: createBasicInfoDraftFromResource(resource),
        }
      })
    },
    [],
  )

  const updateBasicInfoField = useCallback(
    (resourceId: string, field: keyof BasicInfo, value: string) => {
      setBasicInfoDrafts((current) => {
        const draft = current[resourceId]
        if (!draft) {
          return current
        }

        return {
          ...current,
          [resourceId]: {
            ...draft,
            [field]: value,
          },
        }
      })
    },
    [],
  )

  const clearBasicInfoDraft = useCallback(
    (resourceId: string, resourceName: string) => {
      setBasicInfoDrafts((current) => ({
        ...current,
        [resourceId]: createEmptyBasicInfoDraft(resourceName),
      }))
    },
    [],
  )

  const syncBasicInfoDraft = useCallback((resourceId: string, resource: Resource) => {
    setBasicInfoDrafts((current) => ({
      ...current,
      [resourceId]: createBasicInfoDraftFromResource(resource),
    }))
  }, [])

  const value = useMemo(
    () => ({
      getBasicInfoDraft,
      initializeBasicInfoDraft,
      updateBasicInfoField,
      clearBasicInfoDraft,
      syncBasicInfoDraft,
    }),
    [
      clearBasicInfoDraft,
      getBasicInfoDraft,
      initializeBasicInfoDraft,
      syncBasicInfoDraft,
      updateBasicInfoField,
    ],
  )

  return (
    <ResourceWorkspaceContext.Provider value={value}>
      {children}
    </ResourceWorkspaceContext.Provider>
  )
}

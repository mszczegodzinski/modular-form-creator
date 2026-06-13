import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { BasicInfo, ProjectDetails, Resource } from '../../api'
import { ResourceWorkspaceContext } from './resourceWorkspaceContext'
import {
  createBasicInfoDraftFromResource,
  createEmptyBasicInfoDraft,
  createEmptyProjectDetailsDraft,
  createProjectDetailsDraftFromResource,
} from './resourceWorkspace.utils'

export function ResourceWorkspaceProvider({ children }: { children: ReactNode }) {
  const [basicInfoDrafts, setBasicInfoDrafts] = useState<
    Record<string, BasicInfo>
  >({})
  const [projectDetailsDrafts, setProjectDetailsDrafts] = useState<
    Record<string, ProjectDetails>
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

  const getProjectDetailsDraft = useCallback(
    (resourceId: string) => projectDetailsDrafts[resourceId],
    [projectDetailsDrafts],
  )

  const initializeProjectDetailsDraft = useCallback(
    (resourceId: string, resource: Resource) => {
      setProjectDetailsDrafts((current) => {
        if (current[resourceId]) {
          return current
        }

        return {
          ...current,
          [resourceId]: createProjectDetailsDraftFromResource(resource),
        }
      })
    },
    [],
  )

  const updateProjectDetailsField = useCallback(
    (
      resourceId: string,
      field: 'projectName' | 'budget' | 'category',
      value: string,
    ) => {
      setProjectDetailsDrafts((current) => {
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

  const updateProjectDetailsOptions = useCallback(
    (resourceId: string, options: string[]) => {
      setProjectDetailsDrafts((current) => {
        const draft = current[resourceId]
        if (!draft) {
          return current
        }

        return {
          ...current,
          [resourceId]: {
            ...draft,
            options,
          },
        }
      })
    },
    [],
  )

  const clearProjectDetailsDraft = useCallback((resourceId: string) => {
    setProjectDetailsDrafts((current) => ({
      ...current,
      [resourceId]: createEmptyProjectDetailsDraft(),
    }))
  }, [])

  const syncProjectDetailsDraft = useCallback(
    (resourceId: string, resource: Resource) => {
      setProjectDetailsDrafts((current) => ({
        ...current,
        [resourceId]: createProjectDetailsDraftFromResource(resource),
      }))
    },
    [],
  )

  const value = useMemo(
    () => ({
      getBasicInfoDraft,
      initializeBasicInfoDraft,
      updateBasicInfoField,
      clearBasicInfoDraft,
      syncBasicInfoDraft,
      getProjectDetailsDraft,
      initializeProjectDetailsDraft,
      updateProjectDetailsField,
      updateProjectDetailsOptions,
      clearProjectDetailsDraft,
      syncProjectDetailsDraft,
    }),
    [
      clearBasicInfoDraft,
      clearProjectDetailsDraft,
      getBasicInfoDraft,
      getProjectDetailsDraft,
      initializeBasicInfoDraft,
      initializeProjectDetailsDraft,
      syncBasicInfoDraft,
      syncProjectDetailsDraft,
      updateBasicInfoField,
      updateProjectDetailsField,
      updateProjectDetailsOptions,
    ],
  )

  return (
    <ResourceWorkspaceContext.Provider value={value}>
      {children}
    </ResourceWorkspaceContext.Provider>
  )
}

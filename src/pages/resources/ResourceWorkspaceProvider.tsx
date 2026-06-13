import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { BasicInfo, ProjectDetails, Resource } from '../../api'
import { ResourceWorkspaceContext } from './resourceWorkspaceContext'
import {
  createBasicInfoDraftFromResource,
  createEmptyBasicInfoDraft,
  createEmptyProjectDetailsDraft,
  createProjectDetailsDraftFromResource,
  toWorkspaceResourceId,
} from './resourceWorkspace.utils'

export function ResourceWorkspaceProvider({ children }: { children: ReactNode }) {
  const [basicInfoDrafts, setBasicInfoDrafts] = useState<
    Record<string, BasicInfo>
  >({})
  const [projectDetailsDrafts, setProjectDetailsDrafts] = useState<
    Record<string, ProjectDetails>
  >({})

  const getBasicInfoDraft = useCallback(
    (resourceId: string | number) => basicInfoDrafts[toWorkspaceResourceId(resourceId)],
    [basicInfoDrafts],
  )

  const initializeBasicInfoDraft = useCallback(
    (resourceId: string | number, resource: Resource) => {
      const workspaceResourceId = toWorkspaceResourceId(resourceId)

      setBasicInfoDrafts((current) => {
        if (current[workspaceResourceId]) {
          return current
        }

        return {
          ...current,
          [workspaceResourceId]: createBasicInfoDraftFromResource(resource),
        }
      })
    },
    [],
  )

  const updateBasicInfoField = useCallback(
    (resourceId: string | number, field: keyof BasicInfo, value: string) => {
      const workspaceResourceId = toWorkspaceResourceId(resourceId)

      setBasicInfoDrafts((current) => {
        const draft = current[workspaceResourceId]
        if (!draft) {
          return current
        }

        return {
          ...current,
          [workspaceResourceId]: {
            ...draft,
            [field]: value,
          },
        }
      })
    },
    [],
  )

  const clearBasicInfoDraft = useCallback(
    (resourceId: string | number, resourceName: string) => {
      const workspaceResourceId = toWorkspaceResourceId(resourceId)

      setBasicInfoDrafts((current) => ({
        ...current,
        [workspaceResourceId]: createEmptyBasicInfoDraft(resourceName),
      }))
    },
    [],
  )

  const syncBasicInfoDraft = useCallback(
    (resourceId: string | number, resource: Resource) => {
      const workspaceResourceId = toWorkspaceResourceId(resourceId)

      setBasicInfoDrafts((current) => ({
        ...current,
        [workspaceResourceId]: createBasicInfoDraftFromResource(resource),
      }))
    },
    [],
  )

  const getProjectDetailsDraft = useCallback(
    (resourceId: string | number) =>
      projectDetailsDrafts[toWorkspaceResourceId(resourceId)],
    [projectDetailsDrafts],
  )

  const initializeProjectDetailsDraft = useCallback(
    (resourceId: string | number, resource: Resource) => {
      const workspaceResourceId = toWorkspaceResourceId(resourceId)

      setProjectDetailsDrafts((current) => {
        if (current[workspaceResourceId]) {
          return current
        }

        return {
          ...current,
          [workspaceResourceId]: createProjectDetailsDraftFromResource(resource),
        }
      })
    },
    [],
  )

  const updateProjectDetailsField = useCallback(
    (
      resourceId: string | number,
      field: 'projectName' | 'budget' | 'category',
      value: string,
    ) => {
      const workspaceResourceId = toWorkspaceResourceId(resourceId)

      setProjectDetailsDrafts((current) => {
        const draft = current[workspaceResourceId]
        if (!draft) {
          return current
        }

        return {
          ...current,
          [workspaceResourceId]: {
            ...draft,
            [field]: value,
          },
        }
      })
    },
    [],
  )

  const updateProjectDetailsOptions = useCallback(
    (resourceId: string | number, options: string[]) => {
      const workspaceResourceId = toWorkspaceResourceId(resourceId)

      setProjectDetailsDrafts((current) => {
        const draft = current[workspaceResourceId]
        if (!draft) {
          return current
        }

        return {
          ...current,
          [workspaceResourceId]: {
            ...draft,
            options,
          },
        }
      })
    },
    [],
  )

  const clearProjectDetailsDraft = useCallback((resourceId: string | number) => {
    const workspaceResourceId = toWorkspaceResourceId(resourceId)

    setProjectDetailsDrafts((current) => ({
      ...current,
      [workspaceResourceId]: createEmptyProjectDetailsDraft(),
    }))
  }, [])

  const syncProjectDetailsDraft = useCallback(
    (resourceId: string | number, resource: Resource) => {
      const workspaceResourceId = toWorkspaceResourceId(resourceId)

      setProjectDetailsDrafts((current) => ({
        ...current,
        [workspaceResourceId]: createProjectDetailsDraftFromResource(resource),
      }))
    },
    [],
  )

  const value = useMemo(
    () => ({
      basicInfoDrafts,
      projectDetailsDrafts,
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
      basicInfoDrafts,
      projectDetailsDrafts,
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

import { useEffect, useState, type ChangeEvent, type SubmitEventHandler } from 'react'
import { useParams } from 'react-router-dom'
import {
  useResourceQuery,
  useUpdateProjectDetailsMutation,
  type ProjectDetails,
} from '../../api'
import { Button, Card, CheckboxGroup, Input, Select } from '../../design-system'
import { paths } from '../../routes/paths'
import {
  hasProjectDetailsFieldErrors,
  toProjectDetailsPayload,
  validateProjectDetails,
  type ProjectDetailsFieldErrors,
} from './projectDetailsValidation'
import {
  BackLink,
  CardIntro,
  DraftHint,
  ErrorText,
  Form,
  FormActions,
  FormActionsEnd,
  Header,
  LockedLink,
  Page,
  SaveStatus,
  SaveStatusIcon,
  StatusText,
  Title,
} from './BasicInfoPage.styles'
import { canAccessProjectDetails } from './resourceModuleStatus'
import { useResourceWorkspace } from './useResourceWorkspace'
import {
  CATEGORY_OPTIONS,
  TEAM_MEMBER_OPTIONS,
} from './resourceWorkspace.utils'

const SAVE_STATUS_DEBOUNCE_MS = 300

function ProjectDetailsSaveStatus({ draft }: { draft: ProjectDetails }) {
  const draftSignature = JSON.stringify(draft)
  const [debouncedSignature, setDebouncedSignature] = useState(draftSignature)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSignature(draftSignature)
    }, SAVE_STATUS_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [draftSignature])

  const isSaved = draftSignature === debouncedSignature

  return (
    <SaveStatus role="status" aria-live="polite" $isSaved={isSaved}>
      {isSaved ? (
        <>
          <SaveStatusIcon aria-hidden="true">✓</SaveStatusIcon>
          All changes saved
        </>
      ) : (
        'Saving…'
      )}
    </SaveStatus>
  )
}

export function ProjectDetailsPage() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const resourceQuery = useResourceQuery(resourceId)
  const updateProjectDetailsMutation = useUpdateProjectDetailsMutation()
  const {
    clearProjectDetailsDraft,
    getProjectDetailsDraft,
    initializeProjectDetailsDraft,
    syncProjectDetailsDraft,
    updateProjectDetailsField,
    updateProjectDetailsOptions,
  } = useResourceWorkspace()
  const draft = resourceId ? getProjectDetailsDraft(resourceId) : undefined
  const [fieldErrors, setFieldErrors] = useState<ProjectDetailsFieldErrors>({})

  useEffect(() => {
    if (!resourceId || !resourceQuery.data) {
      return
    }

    initializeProjectDetailsDraft(resourceId, resourceQuery.data)
  }, [initializeProjectDetailsDraft, resourceId, resourceQuery.data])

  const handleSave: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    if (!resourceId || !draft || resourceQuery.data?.status === 'completed') {
      return
    }

    const validationErrors = validateProjectDetails(draft)
    setFieldErrors(validationErrors)

    if (hasProjectDetailsFieldErrors(validationErrors)) {
      return
    }

    updateProjectDetailsMutation.mutate(
      {
        id: resourceId,
        payload: toProjectDetailsPayload(draft),
      },
      {
        onSuccess: (resource) => {
          syncProjectDetailsDraft(resourceId, resource)
          setFieldErrors({})
        },
      },
    )
  }

  const handleClear = () => {
    if (!resourceId) {
      return
    }

    const confirmed = window.confirm('Clear all Project Details fields?')
    if (!confirmed) {
      return
    }

    clearProjectDetailsDraft(resourceId)
    setFieldErrors({})
  }

  const saveError =
    updateProjectDetailsMutation.error instanceof Error
      ? updateProjectDetailsMutation.error.message
      : undefined

  if (!resourceId) {
    return (
      <Page>
        <ErrorText>Invalid resource URL.</ErrorText>
      </Page>
    )
  }

  if (resourceQuery.isPending) {
    return (
      <Page>
        <StatusText>Loading resource…</StatusText>
      </Page>
    )
  }

  if (resourceQuery.isError) {
    return (
      <Page>
        <Header>
          <BackLink to={paths.resourceOverview(resourceId)}>
            ← Back to overview
          </BackLink>
          <Title>Project Details</Title>
        </Header>
        <ErrorText>
          {resourceQuery.error instanceof Error
            ? resourceQuery.error.message
            : 'Failed to load resource.'}
        </ErrorText>
      </Page>
    )
  }

  const resource = resourceQuery.data
  const isCompleted = resource.status === 'completed'
  const isAccessible = canAccessProjectDetails(resource)

  if (!isAccessible) {
    return (
      <Page>
        <Header>
          <BackLink to={paths.resourceOverview(resourceId)}>
            ← Back to overview
          </BackLink>
          <Title>Project Details</Title>
        </Header>
        <Card variant="elevated">
          <DraftHint>
            Complete Basic Info and save the module before editing Project Details.
          </DraftHint>
          <LockedLink to={paths.basicInfo(resource.resourceId)}>
            Go to Basic Info
          </LockedLink>
        </Card>
      </Page>
    )
  }

  if (!draft) {
    return (
      <Page>
        <StatusText>Preparing form…</StatusText>
      </Page>
    )
  }

  return (
    <Page>
      <Header>
        <BackLink to={paths.resourceOverview(resourceId)}>← Back to overview</BackLink>
        <Title>Project Details</Title>
      </Header>

      <Card variant="elevated">
        <CardIntro>
          <ProjectDetailsSaveStatus key={resourceId} draft={draft} />
          <DraftHint>
            {isCompleted
              ? 'Submit your changes explicitly to save them permanently.'
              : 'Use Save module to store Project Details on the server. To finish the resource, complete both modules and choose Complete resource on the overview page.'}
          </DraftHint>
        </CardIntro>

        <Form onSubmit={handleSave}>
          {saveError && <ErrorText>{saveError}</ErrorText>}
          <Input
            label="Project name"
            placeholder="Customer onboarding"
            value={draft.projectName}
            error={fieldErrors.projectName}
            onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              updateProjectDetailsField(resourceId, 'projectName', event.target.value)
              if (fieldErrors.projectName) {
                setFieldErrors((current) => ({ ...current, projectName: undefined }))
              }
            }}
          />
          <Input
            label="Budget"
            placeholder="50000"
            value={draft.budget}
            error={fieldErrors.budget}
            onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              updateProjectDetailsField(resourceId, 'budget', event.target.value)
              if (fieldErrors.budget) {
                setFieldErrors((current) => ({ ...current, budget: undefined }))
              }
            }}
          />
          <Select
            label="Category"
            value={draft.category}
            options={[...CATEGORY_OPTIONS]}
            error={fieldErrors.category}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              updateProjectDetailsField(resourceId, 'category', event.target.value)
              if (fieldErrors.category) {
                setFieldErrors((current) => ({ ...current, category: undefined }))
              }
            }}
          />
          <CheckboxGroup
            label="Team members needed"
            tooltip="Select all roles required for this project."
            options={[...TEAM_MEMBER_OPTIONS]}
            value={draft.options}
            error={fieldErrors.options}
            onChange={(next) => {
              updateProjectDetailsOptions(resourceId, next)
              if (fieldErrors.options) {
                setFieldErrors((current) => ({ ...current, options: undefined }))
              }
            }}
          />

          <FormActions>
            <FormActionsEnd>
              <Button type="button" variant="ghost" size="small" onClick={handleClear}>
                Clear form
              </Button>
              {!isCompleted && (
                <Button
                  type="submit"
                  size="small"
                  disabled={updateProjectDetailsMutation.isPending}
                >
                  {updateProjectDetailsMutation.isPending
                    ? 'Saving module…'
                    : 'Save module'}
                </Button>
              )}
            </FormActionsEnd>
          </FormActions>
        </Form>
      </Card>
    </Page>
  )
}

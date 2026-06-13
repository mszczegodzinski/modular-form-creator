import { useEffect, useState, type ChangeEvent, type SubmitEventHandler } from 'react'
import { useParams } from 'react-router-dom'
import { useResourceQuery, useUpdateBasicInfoMutation } from '../../api'
import { Button, Card, Input, Select } from '../../design-system'
import { useAppSnackbar } from '../../hooks/useAppSnackbar'
import { paths } from '../../routes/paths'
import {
  hasBasicInfoFieldErrors,
  toBasicInfoPayload,
  validateBasicInfo,
  type BasicInfoFieldErrors,
} from './basicInfoValidation'
import {
  BackLink,
  CardIntro,
  DraftHint,
  ErrorText,
  Form,
  FormActions,
  FormActionsEnd,
  Header,
  Page,
  StatusText,
  Title,
} from './BasicInfoPage.styles'
import { hasBasicInfoDraftEdits } from './moduleDraftEdits'
import { ModuleFormSaveStatus } from './ModuleFormSaveStatus'
import { useResourceWorkspace } from './useResourceWorkspace'
import { canPatchModuleForms } from './resourceModuleStatus'
import { getResourceName, PRIORITY_OPTIONS } from './resourceWorkspace.utils'

export function BasicInfoPage() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const resourceQuery = useResourceQuery(resourceId)
  const updateBasicInfoMutation = useUpdateBasicInfoMutation()
  const { showError, showSuccess } = useAppSnackbar()
  const {
    clearBasicInfoDraft,
    getBasicInfoDraft,
    initializeBasicInfoDraft,
    syncBasicInfoDraft,
    updateBasicInfoField,
  } = useResourceWorkspace()
  const draft = resourceId ? getBasicInfoDraft(resourceId) : undefined
  const [fieldErrors, setFieldErrors] = useState<BasicInfoFieldErrors>({})

  useEffect(() => {
    if (!resourceId || !resourceQuery.data) {
      return
    }

    initializeBasicInfoDraft(resourceId, resourceQuery.data)
  }, [initializeBasicInfoDraft, resourceId, resourceQuery.data])

  const handleSave: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    if (!resourceId || !draft || !resourceQuery.data) {
      return
    }

    if (!canPatchModuleForms(resourceQuery.data)) {
      return
    }

    const validationErrors = validateBasicInfo(draft)
    setFieldErrors(validationErrors)

    if (hasBasicInfoFieldErrors(validationErrors)) {
      return
    }

    updateBasicInfoMutation.mutate(
      {
        id: resourceId,
        payload: toBasicInfoPayload(draft),
      },
      {
        onSuccess: (resource) => {
          syncBasicInfoDraft(resourceId, resource)
          setFieldErrors({})
          showSuccess('Basic Info saved successfully.')
        },
        onError: (error) => {
          showError(error, 'Failed to save Basic Info.')
        },
      },
    )
  }

  const handleClear = () => {
    if (!resourceId || !resourceQuery.data) {
      return
    }

    const confirmed = window.confirm(
      'Clear all Basic Info fields? Resource name will stay unchanged.',
    )
    if (!confirmed) {
      return
    }

    clearBasicInfoDraft(resourceId, getResourceName(resourceQuery.data))
    setFieldErrors({})
  }

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
          <BackLink to={paths.resourceOverview(resourceId)}>← Back to overview</BackLink>
          <Title>Basic Info</Title>
        </Header>
        <ErrorText>
          {resourceQuery.error instanceof Error
            ? resourceQuery.error.message
            : 'Failed to load resource.'}
        </ErrorText>
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

  const canPatchModule = canPatchModuleForms(resourceQuery.data)
  const hasUnsavedEdits = hasBasicInfoDraftEdits(resourceQuery.data, draft)

  return (
    <Page>
      <Header>
        <BackLink to={paths.resourceOverview(resourceId)}>← Back to overview</BackLink>
        <Title>Basic Info</Title>
      </Header>

      <Card variant="elevated">
        <CardIntro>
          <ModuleFormSaveStatus
            key={resourceId}
            draftSignature={JSON.stringify(draft)}
            hasUnsavedEdits={hasUnsavedEdits}
            isCompletedResource={!canPatchModule}
          />
          <DraftHint>
            {canPatchModule
              ? 'Use Save module to store Basic Info on the server. To finish the resource, complete both modules and choose Complete resource on the overview page.'
              : 'This resource is completed. Partial saves are disabled — edit your changes here, then submit the full resource from the overview page.'}
          </DraftHint>
        </CardIntro>

        <Form onSubmit={handleSave}>
          <Input
            label="Resource name"
            value={draft.resourceName}
            state="locked"
            tooltip="Resource name is immutable after creation."
            helperText="This value cannot be changed."
            error={fieldErrors.resourceName}
            readOnly
          />
          <Input
            label="Owner"
            placeholder="Jane Doe"
            value={draft.owner}
            error={fieldErrors.owner}
            onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              updateBasicInfoField(resourceId, 'owner', event.target.value)
              if (fieldErrors.owner) {
                setFieldErrors((current) => ({ ...current, owner: undefined }))
              }
            }}
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane.doe@example.com"
            value={draft.email}
            error={fieldErrors.email}
            onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              updateBasicInfoField(resourceId, 'email', event.target.value)
              if (fieldErrors.email) {
                setFieldErrors((current) => ({ ...current, email: undefined }))
              }
            }}
          />
          <Input
            label="Description"
            placeholder="Describe this resource…"
            value={draft.description}
            multiline
            rows={4}
            error={fieldErrors.description}
            onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              updateBasicInfoField(resourceId, 'description', event.target.value)
              if (fieldErrors.description) {
                setFieldErrors((current) => ({ ...current, description: undefined }))
              }
            }}
          />
          <Select
            label="Priority"
            value={draft.priority}
            options={[...PRIORITY_OPTIONS]}
            error={fieldErrors.priority}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              updateBasicInfoField(resourceId, 'priority', event.target.value)
              if (fieldErrors.priority) {
                setFieldErrors((current) => ({ ...current, priority: undefined }))
              }
            }}
          />

          <FormActions>
            <FormActionsEnd>
              <Button type="button" variant="ghost" size="small" onClick={handleClear}>
                Clear form
              </Button>
              {!canPatchModule ? null : (
                <Button
                  type="submit"
                  size="small"
                  disabled={updateBasicInfoMutation.isPending}
                >
                  {updateBasicInfoMutation.isPending ? 'Saving module…' : 'Save module'}
                </Button>
              )}
            </FormActionsEnd>
          </FormActions>
        </Form>
      </Card>
    </Page>
  )
}

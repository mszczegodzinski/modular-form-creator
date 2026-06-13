import { useEffect, useState, type ChangeEvent, type SubmitEventHandler } from 'react'
import { useParams } from 'react-router-dom'
import { useResourceQuery, useUpdateBasicInfoMutation, type BasicInfo } from '../../api'
import { Button, Card, Input, Select } from '../../design-system'
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
  SaveStatus,
  SaveStatusIcon,
  StatusText,
  Title,
} from './BasicInfoPage.styles'
import { useResourceWorkspace } from './useResourceWorkspace'
import { getResourceName, PRIORITY_OPTIONS } from './resourceWorkspace.utils'

const SAVE_STATUS_DEBOUNCE_MS = 300

function BasicInfoSaveStatus({ draft }: { draft: BasicInfo }) {
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

export function BasicInfoPage() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const resourceQuery = useResourceQuery(resourceId)
  const updateBasicInfoMutation = useUpdateBasicInfoMutation()
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

    if (!resourceId || !draft || resourceQuery.data?.status === 'completed') {
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

  const saveError =
    updateBasicInfoMutation.error instanceof Error
      ? updateBasicInfoMutation.error.message
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

  const isCompleted = resourceQuery.data.status === 'completed'

  return (
    <Page>
      <Header>
        <BackLink to={paths.resourceOverview(resourceId)}>← Back to overview</BackLink>
        <Title>Basic Info</Title>
      </Header>

      <Card variant="elevated">
        <CardIntro>
          <BasicInfoSaveStatus key={resourceId} draft={draft} />
          <DraftHint>
            {isCompleted
              ? 'Submit your changes explicitly to save them permanently.'
              : 'Use Save module to store Basic Info on the server. To finish the resource, complete both modules and choose Complete resource on the overview page.'}
          </DraftHint>
        </CardIntro>

        <Form onSubmit={handleSave}>
          {saveError && <ErrorText>{saveError}</ErrorText>}
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
              {!isCompleted && (
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

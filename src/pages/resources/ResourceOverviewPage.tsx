import { Link, useParams } from 'react-router-dom'
import { useProvisionResourceMutation, useReplaceResourceMutation, useResourceQuery } from '../../api'
import { Badge, Button, Card } from '../../design-system'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import { paths } from '../../routes/paths'
import {
  buildReplaceResourcePayload,
  hasBufferedResourceEdits,
  validateReplaceResourcePayload,
} from './completedResourceSubmit'
import {
  canAccessProjectDetails,
  canProvisionResource,
  isBasicInfoComplete,
  isProjectDetailsComplete,
} from './resourceModuleStatus'
import {
  ActionHint,
  ActionList,
  BackLink,
  ErrorText,
  Header,
  ModuleActions,
  ModuleHint,
  ModuleInfo,
  ModuleLink,
  ModuleList,
  ModuleName,
  ModuleRow,
  NavLink,
  Page,
  ProvisionButton,
  SectionTitle,
  StatusText,
  SubmitChangesButton,
  Title,
  TitleRow,
} from './ResourceOverviewPage.styles'
import { useResourceWorkspace } from './useResourceWorkspace'

export function ResourceOverviewPage() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const resourceQuery = useResourceQuery(resourceId)
  const provisionMutation = useProvisionResourceMutation()
  const replaceMutation = useReplaceResourceMutation()
  const {
    getBasicInfoDraft,
    getProjectDetailsDraft,
    syncBasicInfoDraft,
    syncProjectDetailsDraft,
  } = useResourceWorkspace()
  const confirmDialog = useConfirmDialog()

  const handleProvision = async () => {
    if (!resourceId || !resourceQuery.data) {
      return
    }

    const confirmed = await confirmDialog({
      title: 'Complete resource',
      message: `Complete resource "${resourceQuery.data.name}"? This will mark it as completed.`,
      confirmLabel: 'Complete resource',
    })
    if (!confirmed) {
      return
    }

    provisionMutation.mutate(resourceId)
  }

  const handleSubmitChanges = async () => {
    if (!resourceId || !resourceQuery.data) {
      return
    }

    const resource = resourceQuery.data
    const payload = buildReplaceResourcePayload(
      resource,
      getBasicInfoDraft(resourceId),
      getProjectDetailsDraft(resourceId),
    )
    const validationError = validateReplaceResourcePayload(payload)

    if (validationError) {
      return
    }

    const confirmed = await confirmDialog({
      title: 'Submit changes',
      message: `Submit all changes to "${resource.name}"? This will replace the saved resource data.`,
      confirmLabel: 'Submit changes',
    })
    if (!confirmed) {
      return
    }

    replaceMutation.mutate(
      { id: resourceId, payload },
      {
        onSuccess: (updatedResource) => {
          syncBasicInfoDraft(resourceId, updatedResource)
          syncProjectDetailsDraft(resourceId, updatedResource)
        },
      },
    )
  }

  const provisionError =
    provisionMutation.error instanceof Error ? provisionMutation.error.message : undefined

  const replaceError =
    replaceMutation.error instanceof Error ? replaceMutation.error.message : undefined

  if (!resourceId) {
    return (
      <Page>
        <ErrorText>Invalid resource URL.</ErrorText>
        <Link to={paths.resources}>Back to resources</Link>
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
          <BackLink to={paths.resources}>← Back to resources</BackLink>
          <Title>Resource overview</Title>
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
  const basicInfoComplete = isBasicInfoComplete(resource.basicInfo)
  const projectDetailsComplete = isProjectDetailsComplete(resource.projectDetails)
  const projectDetailsAccessible = canAccessProjectDetails(resource)
  const provisioningAllowed = canProvisionResource(resource)
  const basicInfoDraft = getBasicInfoDraft(resourceId)
  const projectDetailsDraft = getProjectDetailsDraft(resourceId)
  const hasBufferedEdits = hasBufferedResourceEdits(
    resource,
    basicInfoDraft,
    projectDetailsDraft,
  )
  const replacePayload = buildReplaceResourcePayload(
    resource,
    basicInfoDraft,
    projectDetailsDraft,
  )
  const replaceValidationError = validateReplaceResourcePayload(replacePayload)
  const submitChangesAllowed =
    resource.status === 'completed' && hasBufferedEdits && !replaceValidationError

  return (
    <Page>
      <Header>
        <BackLink to={paths.resources}>← Back to resources</BackLink>
        <TitleRow>
          <Title>{resource.name}</Title>
          <Badge variant={resource.status === 'completed' ? 'success' : 'neutral'}>
            {resource.status}
          </Badge>
        </TitleRow>
      </Header>

      <Card variant="elevated">
        <SectionTitle>Modules</SectionTitle>
        <ModuleList>
          <ModuleRow>
            <ModuleInfo>
              <ModuleName>Basic Info</ModuleName>
              <ModuleHint>Owner, contact details, description, and priority.</ModuleHint>
            </ModuleInfo>
            <ModuleActions>
              <Badge variant={basicInfoComplete ? 'success' : 'warning'}>
                {basicInfoComplete ? 'Complete' : 'Incomplete'}
              </Badge>
              <ModuleLink to={paths.basicInfo(resource.resourceId)}>
                {basicInfoComplete ? 'Review' : 'Complete module'}
              </ModuleLink>
            </ModuleActions>
          </ModuleRow>

          <ModuleRow>
            <ModuleInfo>
              <ModuleName>Project Details</ModuleName>
              <ModuleHint>
                {projectDetailsAccessible
                  ? 'Project name, budget, category, and options.'
                  : 'Complete Basic Info first to unlock this module.'}
              </ModuleHint>
            </ModuleInfo>
            <ModuleActions>
              <Badge
                variant={
                  !projectDetailsAccessible
                    ? 'neutral'
                    : projectDetailsComplete
                      ? 'success'
                      : 'warning'
                }
              >
                {!projectDetailsAccessible
                  ? 'Locked'
                  : projectDetailsComplete
                    ? 'Complete'
                    : 'Incomplete'}
              </Badge>
              {projectDetailsAccessible ? (
                <ModuleLink to={paths.projectDetails(resource.resourceId)}>
                  {projectDetailsComplete ? 'Review' : 'Complete module'}
                </ModuleLink>
              ) : (
                <Button type="button" variant="ghost" size="small" state="locked">
                  Complete module
                </Button>
              )}
            </ModuleActions>
          </ModuleRow>
        </ModuleList>
      </Card>

      <Card variant="elevated">
        <SectionTitle>Actions</SectionTitle>
        <ActionList>
          <NavLink to={paths.resourceDetails(resource.resourceId)}>
            View resource summary
          </NavLink>

          {resource.status === 'completed' ? (
            <>
              <ActionHint>
                This resource is completed. Partial saves are disabled — edit modules,
                then submit all changes here.
              </ActionHint>
              {replaceError && <ErrorText>{replaceError}</ErrorText>}
              {replaceValidationError && hasBufferedEdits && (
                <ErrorText>{replaceValidationError}</ErrorText>
              )}
              <SubmitChangesButton
                type="button"
                size="small"
                disabled={!submitChangesAllowed || replaceMutation.isPending}
                onClick={handleSubmitChanges}
              >
                {replaceMutation.isPending ? 'Submitting…' : 'Submit changes'}
              </SubmitChangesButton>
              {!hasBufferedEdits && (
                <ActionHint>No pending edits in module forms.</ActionHint>
              )}
            </>
          ) : (
            <>
              {provisionError && <ErrorText>{provisionError}</ErrorText>}
              <ProvisionButton
                type="button"
                size="small"
                disabled={!provisioningAllowed || provisionMutation.isPending}
                onClick={handleProvision}
              >
                {provisionMutation.isPending ? 'Completing…' : 'Complete resource'}
              </ProvisionButton>
              {!provisioningAllowed && (
                <ActionHint>
                  Complete both modules before marking this resource as completed.
                </ActionHint>
              )}
            </>
          )}
        </ActionList>
      </Card>
    </Page>
  )
}

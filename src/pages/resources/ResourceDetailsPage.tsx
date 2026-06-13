import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useResourceQuery } from '../../api'
import { Badge, Card } from '../../design-system'
import { paths } from '../../routes/paths'
import { hasBufferedResourceEdits } from './completedResourceSubmit'
import {
  canAccessProjectDetails,
  isBasicInfoComplete,
  isProjectDetailsComplete,
} from './resourceModuleStatus'
import {
  BackLink,
  EditLink,
  ErrorText,
  FieldLabel,
  FieldList,
  FieldValue,
  Header,
  LockedMessage,
  OptionsList,
  Page,
  PendingHint,
  SectionHeader,
  SectionTitle,
  StatusText,
  Subtitle,
  Title,
  TitleRow,
} from './ResourceDetailsPage.styles'
import { useResourceWorkspace } from './useResourceWorkspace'
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from './resourceWorkspace.utils'

function formatText(value: string): string {
  const trimmed = value.trim()
  return trimmed || '—'
}

function formatSelectValue(
  value: string,
  options: readonly { value: string; label: string }[],
): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return '—'
  }

  return options.find((option) => option.value === trimmed)?.label ?? trimmed
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <>
      <FieldLabel>{label}</FieldLabel>
      <FieldValue>{value}</FieldValue>
    </>
  )
}

export function ResourceDetailsPage() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const resourceQuery = useResourceQuery(resourceId)
  const {
    getBasicInfoDraft,
    getProjectDetailsDraft,
    initializeBasicInfoDraft,
    initializeProjectDetailsDraft,
  } = useResourceWorkspace()

  useEffect(() => {
    if (!resourceId || !resourceQuery.data) {
      return
    }

    initializeBasicInfoDraft(resourceId, resourceQuery.data)
    initializeProjectDetailsDraft(resourceId, resourceQuery.data)
  }, [
    initializeBasicInfoDraft,
    initializeProjectDetailsDraft,
    resourceId,
    resourceQuery.data,
  ])

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
        <StatusText>Loading resource summary…</StatusText>
      </Page>
    )
  }

  if (resourceQuery.isError) {
    return (
      <Page>
        <Header>
          <BackLink to={paths.resourceOverview(resourceId)}>← Back to overview</BackLink>
          <Title>Resource summary</Title>
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
  const { basicInfo, projectDetails } = resource
  const basicInfoComplete = isBasicInfoComplete(basicInfo)
  const projectDetailsAccessible = canAccessProjectDetails(resource)
  const projectDetailsComplete = isProjectDetailsComplete(projectDetails)
  const hasPendingEdits = hasBufferedResourceEdits(
    resource,
    getBasicInfoDraft(resourceId),
    getProjectDetailsDraft(resourceId),
  )

  return (
    <Page>
      <Header>
        <BackLink to={paths.resourceOverview(resourceId)}>← Back to overview</BackLink>
        <TitleRow>
          <Title>Resource summary</Title>
          <Badge variant={resource.status === 'completed' ? 'success' : 'neutral'}>
            {resource.status}
          </Badge>
        </TitleRow>
        <Subtitle>Saved data for {resource.name}</Subtitle>
      </Header>

      {hasPendingEdits && (
        <PendingHint role="status" aria-live="polite">
          Module forms contain unsaved changes that are not reflected below.
          {resource.status === 'completed'
            ? ' Submit changes from the overview page to update this summary.'
            : ' Save each module to update this summary.'}
        </PendingHint>
      )}

      <Card variant="elevated">
        <SectionHeader>
          <SectionTitle>Basic Info</SectionTitle>
          <Badge variant={basicInfoComplete ? 'success' : 'warning'}>
            {basicInfoComplete ? 'Complete' : 'Incomplete'}
          </Badge>
        </SectionHeader>

        <FieldList>
          <SummaryField
            label="Resource name"
            value={formatText(basicInfo.resourceName)}
          />
          <SummaryField label="Owner" value={formatText(basicInfo.owner)} />
          <SummaryField label="Email" value={formatText(basicInfo.email)} />
          <SummaryField label="Description" value={formatText(basicInfo.description)} />
          <SummaryField
            label="Priority"
            value={formatSelectValue(basicInfo.priority, PRIORITY_OPTIONS)}
          />
        </FieldList>

        <EditLink to={paths.basicInfo(resource.resourceId)}>Edit Basic Info</EditLink>
      </Card>

      <Card variant="elevated">
        <SectionHeader>
          <SectionTitle>Project Details</SectionTitle>
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
        </SectionHeader>

        {!projectDetailsAccessible ? (
          <LockedMessage>
            Complete Basic Info before Project Details can be filled in.
          </LockedMessage>
        ) : (
          <>
            <FieldList>
              <SummaryField
                label="Project name"
                value={formatText(projectDetails.projectName)}
              />
              <SummaryField label="Budget" value={formatText(projectDetails.budget)} />
              <SummaryField
                label="Category"
                value={formatSelectValue(projectDetails.category, CATEGORY_OPTIONS)}
              />
              <FieldLabel>Team members needed</FieldLabel>
              <FieldValue>
                {projectDetails.options.length > 0 ? (
                  <OptionsList>
                    {projectDetails.options.map((option) => (
                      <li key={option}>{option}</li>
                    ))}
                  </OptionsList>
                ) : (
                  '—'
                )}
              </FieldValue>
            </FieldList>

            <EditLink to={paths.projectDetails(resource.resourceId)}>
              Edit Project Details
            </EditLink>
          </>
        )}
      </Card>
    </Page>
  )
}

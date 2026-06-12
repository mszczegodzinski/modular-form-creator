import { useState, type ChangeEvent, type SubmitEventHandler } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useCreateResourceMutation, useResourcesQuery } from '../../api'
import { Badge, Button, Card, Input } from '../../design-system'
import { paths } from '../../routes/paths'

export function ResourcesListPage() {
  const [resourceName, setResourceName] = useState('')
  const resourcesQuery = useResourcesQuery()
  const createResourceMutation = useCreateResourceMutation()

  const handleCreate: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const trimmedName = resourceName.trim()
    if (!trimmedName) {
      return
    }

    createResourceMutation.mutate(
      { resourceName: trimmedName },
      {
        onSuccess: () => {
          setResourceName('')
        },
      },
    )
  }

  const createError =
    createResourceMutation.error instanceof Error
      ? createResourceMutation.error.message
      : undefined

  return (
    <Page>
      <Header>
        <Title>Resources</Title>
        <Description>
          Create and manage resources through the module workflow.
        </Description>
      </Header>

      <Card variant="elevated">
        <SectionTitle>Create resource</SectionTitle>
        <CreateForm onSubmit={handleCreate}>
          <Input
            label="Resource name"
            placeholder="My new resource"
            value={resourceName}
            onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
              setResourceName(e.target.value)
            }
            error={createError}
          />
          <Button
            type="submit"
            size="small"
            disabled={!resourceName.trim() || createResourceMutation.isPending}
          >
            {createResourceMutation.isPending ? 'Creating…' : 'Create resource'}
          </Button>
        </CreateForm>
      </Card>

      <Card variant="elevated">
        <SectionTitle>Resource list</SectionTitle>

        {resourcesQuery.isPending && <StatusText>Loading resources…</StatusText>}
        {resourcesQuery.isError && (
          <ErrorText>
            {resourcesQuery.error instanceof Error
              ? resourcesQuery.error.message
              : 'Failed to load resources.'}
          </ErrorText>
        )}

        {resourcesQuery.isSuccess && resourcesQuery.data.items.length === 0 && (
          <StatusText>No resources yet. Create your first one above.</StatusText>
        )}

        {resourcesQuery.isSuccess && resourcesQuery.data.items.length > 0 && (
          <ResourceList>
            {resourcesQuery.data.items.map((resource) => (
              <ResourceRow key={resource._id}>
                <ResourceInfo>
                  <ResourceLink to={paths.resourceOverview(resource.resourceId)}>
                    {resource.name}
                  </ResourceLink>
                  <ResourceMeta>ID {resource.resourceId}</ResourceMeta>
                </ResourceInfo>
                <Badge variant={resource.status === 'completed' ? 'success' : 'neutral'}>
                  {resource.status}
                </Badge>
              </ResourceRow>
            ))}
          </ResourceList>
        )}
      </Card>
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Title = styled.h1`
  font-size: 2rem;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`

const StatusText = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.warning};
`

const ResourceList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const ResourceRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`

const ResourceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const ResourceLink = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    text-decoration: underline;
  }
`

const ResourceMeta = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`

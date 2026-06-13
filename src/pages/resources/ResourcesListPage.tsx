import { useState, type ChangeEvent, type SubmitEventHandler } from 'react'
import {
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useResourcesQuery,
} from '../../api'
import { Badge, Button, Card, Input } from '../../design-system'
import { paths } from '../../routes/paths'
import {
  CreateForm,
  DeleteButton,
  Description,
  ErrorText,
  Header,
  Page,
  ResourceActions,
  ResourceInfo,
  ResourceLink,
  ResourceList,
  ResourceMeta,
  ResourceRow,
  SectionTitle,
  StatusText,
  Title,
} from './ResourcesListPage.styles'

export function ResourcesListPage() {
  const [resourceName, setResourceName] = useState('')
  const resourcesQuery = useResourcesQuery()
  const createResourceMutation = useCreateResourceMutation()
  const deleteResourceMutation = useDeleteResourceMutation()

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

  const handleDelete = (id: number, name: string) => {
    const confirmed = window.confirm(
      `Delete resource "${name}"? This action cannot be undone.`,
    )
    if (!confirmed) {
      return
    }

    deleteResourceMutation.mutate(id)
  }

  const createError =
    createResourceMutation.error instanceof Error
      ? createResourceMutation.error.message
      : undefined

  const deleteError =
    deleteResourceMutation.error instanceof Error
      ? deleteResourceMutation.error.message
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

        {deleteError && <ErrorText>{deleteError}</ErrorText>}
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
            {resourcesQuery.data.items.map((resource) => {
              const isDeleting =
                deleteResourceMutation.isPending &&
                deleteResourceMutation.variables === resource.resourceId

              return (
                <ResourceRow key={resource._id}>
                  <ResourceInfo>
                    <ResourceLink to={paths.resourceOverview(resource.resourceId)}>
                      {resource.name}
                    </ResourceLink>
                    <ResourceMeta>ID {resource.resourceId}</ResourceMeta>
                  </ResourceInfo>
                  <ResourceActions>
                    <Badge
                      variant={resource.status === 'completed' ? 'success' : 'neutral'}
                    >
                      {resource.status}
                    </Badge>
                    <DeleteButton
                      type="button"
                      variant="ghost"
                      size="small"
                      disabled={deleteResourceMutation.isPending}
                      onClick={() => handleDelete(resource.resourceId, resource.name)}
                      state={isDeleting ? 'disabled' : 'normal'}
                    >
                      {isDeleting ? 'Deleting…' : 'Delete'}
                    </DeleteButton>
                  </ResourceActions>
                </ResourceRow>
              )
            })}
          </ResourceList>
        )}
      </Card>
    </Page>
  )
}

import { useEffect, useState, type ChangeEvent, type SubmitEventHandler } from 'react'
import {
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useResourcesQuery,
} from '../../api'
import { Badge, Button, Card, Input, Select } from '../../design-system'
import { useAppSnackbar } from '../../hooks/useAppSnackbar'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
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
  PageSizeControl,
  PaginationBar,
  PaginationControls,
  PaginationInfo,
  ResourceList,
  ResourceRow,
  SectionTitle,
  StatusText,
  Title,
} from './ResourcesListPage.styles'

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 per page' },
  { value: '25', label: '25 per page' },
  { value: '50', label: '50 per page' },
  { value: '100', label: '100 per page' },
] as const

export function ResourcesListPage() {
  const [resourceName, setResourceName] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const resourcesQuery = useResourcesQuery({ page, pageSize })
  const createResourceMutation = useCreateResourceMutation()
  const deleteResourceMutation = useDeleteResourceMutation()
  const { showError } = useAppSnackbar()
  const confirmDialog = useConfirmDialog()

  useEffect(() => {
    if (!resourcesQuery.isError) {
      return
    }

    showError(resourcesQuery.error, 'Failed to load resources.')
  }, [resourcesQuery.error, resourcesQuery.isError, showError])

  useEffect(() => {
    if (!resourcesQuery.isSuccess) {
      return
    }

    const { totalPages } = resourcesQuery.data.pagination
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, resourcesQuery.data, resourcesQuery.isSuccess])

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
        onError: (error) => {
          showError(error, 'Failed to create resource.')
        },
      },
    )
  }

  const handleDelete = async (id: number, name: string) => {
    const confirmed = await confirmDialog({
      title: 'Delete resource',
      message: `Delete resource "${name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
    })
    if (!confirmed) {
      return
    }

    deleteResourceMutation.mutate(id)
  }

  const deleteError =
    deleteResourceMutation.error instanceof Error
      ? deleteResourceMutation.error.message
      : undefined

  const pagination = resourcesQuery.isSuccess ? resourcesQuery.data.pagination : null
  const paginationSummary = pagination
    ? (() => {
        const rangeStart = (pagination.page - 1) * pagination.pageSize + 1
        const rangeEnd = Math.min(pagination.page * pagination.pageSize, pagination.totalItems)

        return `Showing ${rangeStart}–${rangeEnd} of ${pagination.totalItems} · Page ${pagination.page} of ${pagination.totalPages}`
      })()
    : null

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
          <StatusText>Unable to display resources.</StatusText>
        )}

        {resourcesQuery.isSuccess && resourcesQuery.data.pagination.totalItems === 0 && (
          <StatusText>No resources yet. Create your first one above.</StatusText>
        )}

        {resourcesQuery.isSuccess && resourcesQuery.data.pagination.totalItems > 0 && (
          <>
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

            <PaginationBar>
              <PageSizeControl>
                <Select
                  label="Items per page"
                  value={String(pageSize)}
                  options={[...PAGE_SIZE_OPTIONS]}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    setPageSize(Number(event.target.value))
                    setPage(1)
                  }}
                />
              </PageSizeControl>

              <PaginationInfo>{paginationSummary}</PaginationInfo>

              <PaginationControls>
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  disabled={page <= 1 || resourcesQuery.isFetching}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  disabled={
                    (pagination?.totalPages ?? 1) <= page || resourcesQuery.isFetching
                  }
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </PaginationControls>
            </PaginationBar>
          </>
        )}
      </Card>
    </Page>
  )
}

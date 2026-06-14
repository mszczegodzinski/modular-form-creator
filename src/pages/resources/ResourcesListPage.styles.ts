import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../../design-system'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Title = styled.h1`
  font-size: 2rem;
`

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const SectionTitle = styled.h2`
  font-size: 1.125rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`

export const StatusText = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.warning};
`

export const ResourceList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const ResourceRow = styled.li`
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

export const ResourceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const ResourceLink = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    text-decoration: underline;
  }
`

export const ResourceActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const PaginationBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

export const PageSizeControl = styled.div`
  min-width: 10rem;
`

export const PaginationInfo = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const DeleteButton = styled(Button)`
  && {
    color: ${({ theme }) => theme.colors.warning};
    border-color: transparent;

    &:hover {
      color: ${({ theme }) => theme.colors.warning};
      border-color: ${({ theme }) => theme.colors.warning};
      background: rgba(180, 71, 27, 0.1);
    }
  }
`

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

export const BackLink = styled(Link)`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};
  width: fit-content;

  &:hover {
    text-decoration: underline;
  }
`

export const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Title = styled.h1`
  font-size: 2rem;
`

export const Meta = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const SectionTitle = styled.h2`
  font-size: 1.125rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const StatusText = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.warning};
`

export const ModuleList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const ModuleRow = styled.li`
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

export const ModuleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const ModuleName = styled.span`
  font-weight: 600;
`

export const ModuleHint = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const ModuleActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`

export const ActionHint = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.inkMuted};
  margin: 0;
`

export const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`

export const ModuleLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radii.pill};
  text-decoration: none;
  transition: all 0.2s ease;
  background: transparent;
  color: ${({ theme }) => theme.colors.primaryStrong};
  border: 1px solid transparent;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(31, 122, 140, 0.08);
    text-decoration: none;
  }
`

export const ProvisionButton = styled(Button)`
  && {
    min-width: 10rem;
  }
`

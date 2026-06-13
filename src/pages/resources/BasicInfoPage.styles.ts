import { Link } from 'react-router-dom'
import styled from 'styled-components'

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

export const LockedLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  width: fit-content;

  &:hover {
    text-decoration: underline;
  }
`

export const Title = styled.h1`
  font-size: 2rem;
`

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const FormActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  width: 100%;
`

export const FormActionsEnd = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: auto;
`

export const StatusText = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.warning};
`

export const DraftHint = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.inkMuted};
  margin: 0;
`

export const CardIntro = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const SaveStatus = styled.p<{ $tone: 'success' | 'info' | 'neutral' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 1rem;
  font-size: 0.875rem;
  font-weight: ${({ $tone }) => ($tone === 'success' ? 600 : 500)};
  color: ${({ theme, $tone }) => {
    if ($tone === 'success') {
      return theme.colors.success
    }

    if ($tone === 'info') {
      return theme.colors.info
    }

    return theme.colors.inkMuted
  }};
  margin: 0;
  width: fit-content;
`

export const SaveStatusIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: rgba(46, 139, 87, 0.16);
  font-size: 0.75rem;
  line-height: 1;
`

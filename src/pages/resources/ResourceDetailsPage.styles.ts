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

export const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Title = styled.h1`
  font-size: 2rem;
`

export const Subtitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const SectionHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const SectionTitle = styled.h2`
  font-size: 1.125rem;
  margin: 0;
`

export const FieldList = styled.dl`
  display: grid;
  grid-template-columns: minmax(8rem, 12rem) 1fr;
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin: 0;
`

export const FieldLabel = styled.dt`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const FieldValue = styled.dd`
  margin: 0;
  word-break: break-word;
`

export const OptionsList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};
`

export const LockedMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const EditLink = styled(Link)`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    text-decoration: underline;
  }
`

export const PendingHint = styled.div`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.info};
  background: rgba(60, 90, 137, 0.08);
  border-left: 3px solid ${({ theme }) => theme.colors.info};
  border-radius: ${({ theme }) => theme.radii.sm};
`

export const StatusText = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.warning};
`

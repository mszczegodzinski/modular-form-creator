import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Card } from '../../design-system'
import { paths } from '../../routes/paths'

export function ResourceOverviewPage() {
  const { resourceId } = useParams<{ resourceId: string }>()

  return (
    <Page>
      <Title>Resource overview</Title>
      <Description>Resource ID: {resourceId}</Description>
      <Card variant="elevated">
        <NavList>
          <li>
            <Link to={paths.resources}>Back to list</Link>
          </li>
          <li>
            <Link to={paths.resourceDetails(resourceId ?? '')}>Details</Link>
          </li>
          <li>
            <Link to={paths.basicInfo(resourceId ?? '')}>Basic Info</Link>
          </li>
          <li>
            <Link to={paths.projectDetails(resourceId ?? '')}>
              Project Details
            </Link>
          </li>
        </NavList>
      </Card>
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const Title = styled.h1`
  font-size: 2rem;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

const NavList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`

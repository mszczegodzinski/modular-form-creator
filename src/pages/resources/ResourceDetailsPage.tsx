import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Card } from '../../design-system'
import { paths } from '../../routes/paths'

export function ResourceDetailsPage() {
  const { resourceId } = useParams<{ resourceId: string }>()

  return (
    <Page>
      <Title>Resource details</Title>
      <Card variant="elevated">
        <NavList>
          <li>
            <Link to={paths.resourceOverview(resourceId ?? '')}>Back to overview</Link>
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

const NavList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`

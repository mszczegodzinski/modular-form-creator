import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Card } from '../../design-system'
import { paths } from '../../routes/paths'

export function ResourcesListPage() {
  return (
    <Page>
      <Title>Resources</Title>
      <Description>Main resources list page.</Description>
      <Card variant="elevated">
        <CardTitle>Preview navigation</CardTitle>
        <NavList>
          <li>
            <Link to={paths.resourceOverview(1)}>Resource #1 overview</Link>
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

const CardTitle = styled.h2`
  font-size: 1.125rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const NavList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`

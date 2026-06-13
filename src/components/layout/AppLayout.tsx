import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

export function AppLayout() {
  return (
    <Shell>
      <Main>
        <Outlet />
      </Main>
    </Shell>
  )
}

const Shell = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
`

const Main = styled.main`
  max-width: 960px;
  margin: 0 auto;
`

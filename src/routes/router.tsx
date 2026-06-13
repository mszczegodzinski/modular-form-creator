import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import {
  BasicInfoPage,
  ProjectDetailsPage,
  ResourceDetailsPage,
  ResourceOverviewPage,
  ResourcesListPage,
  ResourceWorkspaceLayout,
} from '../pages/resources'
import { paths } from './paths'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={paths.resources} replace />} />
        <Route element={<AppLayout />}>
          <Route path={paths.resources} element={<ResourcesListPage />} />
          <Route path="/resources/:resourceId" element={<ResourceWorkspaceLayout />}>
            <Route index element={<ResourceOverviewPage />} />
            <Route path="details" element={<ResourceDetailsPage />} />
            <Route path="basic-info" element={<BasicInfoPage />} />
            <Route path="project-details" element={<ProjectDetailsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={paths.resources} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

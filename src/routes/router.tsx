import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import {
  BasicInfoPage,
  ProjectDetailsPage,
  ResourceDetailsPage,
  ResourceOverviewPage,
  ResourcesListPage,
} from '../pages/resources'
import { paths } from './paths'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={paths.resources} replace />} />
        <Route element={<AppLayout />}>
          <Route path={paths.resources} element={<ResourcesListPage />} />
          <Route
            path="/resources/:resourceId/details"
            element={<ResourceDetailsPage />}
          />
          <Route
            path="/resources/:resourceId/basic-info"
            element={<BasicInfoPage />}
          />
          <Route
            path="/resources/:resourceId/project-details"
            element={<ProjectDetailsPage />}
          />
          <Route
            path="/resources/:resourceId"
            element={<ResourceOverviewPage />}
          />
        </Route>
        <Route path="*" element={<Navigate to={paths.resources} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

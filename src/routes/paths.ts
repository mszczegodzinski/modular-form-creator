export const paths = {
  resources: '/resources',
  resourceOverview: (resourceId: string | number) => `/resources/${resourceId}`,
  resourceDetails: (resourceId: string | number) =>
    `/resources/${resourceId}/details`,
  basicInfo: (resourceId: string | number) =>
    `/resources/${resourceId}/basic-info`,
  projectDetails: (resourceId: string | number) =>
    `/resources/${resourceId}/project-details`,
} as const

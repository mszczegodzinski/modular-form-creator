import type { ProjectDetails } from '../../api'
import { TEAM_MEMBER_OPTIONS } from './resourceWorkspace.utils'

const NAME_REGEX = /^[A-Za-z0-9 -]+$/
const INTEGER_REGEX = /^\d+$/
const PROJECT_CATEGORY_VALUES = ['internal', 'external', 'vendor'] as const

export type ProjectDetailsFieldErrors = Partial<
  Record<keyof ProjectDetails, string>
>

export function toProjectDetailsPayload(draft: ProjectDetails): ProjectDetails {
  return {
    projectName: draft.projectName.trim(),
    budget: draft.budget.trim(),
    category: draft.category,
    options: draft.options,
  }
}

export function validateProjectDetails(
  projectDetails: ProjectDetails,
): ProjectDetailsFieldErrors {
  const errors: ProjectDetailsFieldErrors = {}
  const projectName = projectDetails.projectName.trim()

  if (!projectName) {
    errors.projectName = 'Project name is required'
  } else if (projectName.length > 255) {
    errors.projectName = 'Project name must be at most 255 characters long'
  } else if (!NAME_REGEX.test(projectName)) {
    errors.projectName =
      'Project name can contain only letters, numbers, spaces, and hyphens'
  }

  const budget = projectDetails.budget.trim()
  if (!budget) {
    errors.budget = 'Budget is required'
  } else if (!INTEGER_REGEX.test(budget)) {
    errors.budget = 'Budget must contain only integers'
  }

  if (
    !PROJECT_CATEGORY_VALUES.includes(
      projectDetails.category as (typeof PROJECT_CATEGORY_VALUES)[number],
    )
  ) {
    errors.category = 'Category must be one of: internal, external, vendor'
  }

  if (!Array.isArray(projectDetails.options) || projectDetails.options.length === 0) {
    errors.options = 'At least one team member is required'
  } else {
    const invalid = projectDetails.options.find(
      (value) =>
        !TEAM_MEMBER_OPTIONS.includes(
          value as (typeof TEAM_MEMBER_OPTIONS)[number],
        ),
    )

    if (invalid) {
      errors.options = `Unsupported team member option: ${invalid}`
    }
  }

  return errors
}

export function hasProjectDetailsFieldErrors(
  errors: ProjectDetailsFieldErrors,
): boolean {
  return Object.keys(errors).length > 0
}

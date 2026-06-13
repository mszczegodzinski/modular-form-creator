import type { BasicInfo } from '../../api'

const NAME_REGEX = /^[A-Za-z0-9 -]+$/
const OWNER_REGEX = /^[A-Za-z ]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PRIORITY_VALUES = ['low', 'medium', 'high'] as const

export type BasicInfoFieldErrors = Partial<Record<keyof BasicInfo, string>>

export function toBasicInfoPayload(draft: BasicInfo): BasicInfo {
  return {
    resourceName: draft.resourceName.trim(),
    owner: draft.owner.trim(),
    email: draft.email.trim(),
    description: draft.description.trim(),
    priority: draft.priority,
  }
}

export function validateBasicInfo(basicInfo: BasicInfo): BasicInfoFieldErrors {
  const errors: BasicInfoFieldErrors = {}
  const resourceName = basicInfo.resourceName.trim()

  if (!resourceName) {
    errors.resourceName = 'Resource name is required'
  } else if (resourceName.length > 255) {
    errors.resourceName = 'Resource name must be at most 255 characters long'
  } else if (!NAME_REGEX.test(resourceName)) {
    errors.resourceName =
      'Resource name can contain only letters, numbers, spaces, and hyphens'
  }

  const owner = basicInfo.owner.trim()
  if (!owner) {
    errors.owner = 'Owner is required'
  } else if (owner.length > 255) {
    errors.owner = 'Owner must be at most 255 characters long'
  } else if (!OWNER_REGEX.test(owner)) {
    errors.owner = 'Owner can contain only letters and spaces'
  }

  const email = basicInfo.email.trim()
  if (!email) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Email must be a valid email format'
  }

  const description = basicInfo.description.trim()
  if (!description) {
    errors.description = 'Description is required'
  } else if (description.length > 1000) {
    errors.description = 'Description must be at most 1000 characters long'
  }

  if (
    !PRIORITY_VALUES.includes(basicInfo.priority as (typeof PRIORITY_VALUES)[number])
  ) {
    errors.priority = 'Priority must be one of: low, medium, high'
  }

  return errors
}

export function hasBasicInfoFieldErrors(errors: BasicInfoFieldErrors): boolean {
  return Object.keys(errors).length > 0
}

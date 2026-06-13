import { createContext } from 'react'
import type { ResourceWorkspaceContextValue } from './resourceWorkspaceContext.types'

export const ResourceWorkspaceContext = createContext<
  ResourceWorkspaceContextValue | undefined
>(undefined)

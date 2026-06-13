import axios, { isAxiosError } from 'axios'
import { API_BASE_URL } from './config'
import { ApiRequestError, type ApiErrorBody } from './types/api-error'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response) {
      const data = error.response.data as Partial<ApiErrorBody> | undefined

      throw new ApiRequestError(error.response.status, {
        message: data?.message ?? error.message,
        details: data?.details,
      })
    }

    throw error
  },
)

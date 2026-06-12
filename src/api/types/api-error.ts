export interface ApiErrorBody {
  message: string
  details?: Record<string, unknown>
}

export class ApiRequestError extends Error {
  status: number
  body: ApiErrorBody

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.name = 'ApiRequestError'
    this.status = status
    this.body = body
  }
}

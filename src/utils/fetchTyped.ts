export interface DatasetResponse<T> {
  total_count: number;
  results: T;
}

interface SuccessResponse<T> {
  code: number;
  success: true;
  data: T;
}

interface BadRequestError {
  message: string;
  error_code: string;
}

interface RateLimitError {
  errorcode: number;
  reset_time: string;
  limit_time_unit: string;
  call_limit: number;
  error: string;
}

type ErrorResponsePayload = BadRequestError | RateLimitError;

interface ErrorResponse {
  code: number;
  success: false;
  data: ErrorResponsePayload;
}

export type ResponseTyped<T> = SuccessResponse<T> | ErrorResponse;

export async function fetchTyped<T>(url: string, options?: RequestInit): Promise<ResponseTyped<T>> {
  const response = await fetch(url, options);
  const data = await response.json();

  return {
    code: response.status,
    success: response.ok,
    data,
  };
}

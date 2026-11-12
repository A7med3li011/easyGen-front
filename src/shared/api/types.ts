// The backend wraps every response in an envelope (except 204 No Content, which has no body).

/** Successful response: the payload is in `data`. */
export type ApiSuccess<T> = {
  success: true;
  statusCode: number;
  data: T;
};

/** Error response. `message` is one sentence that is safe to show to the user. */
export type ApiError = {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  /** One entry per failed validation rule, when there are any. */
  details?: string[];
  path: string;
  timestamp: string;
};

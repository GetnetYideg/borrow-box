/** Generic API error shape returned by backend */
export interface ApiError {
  message: string;
  statusCode?: number;
}

/** Standard API response wrapper. @template T - Response data type */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

/** API error response with validation errors */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/** Paginated API response. @template T - Item type */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

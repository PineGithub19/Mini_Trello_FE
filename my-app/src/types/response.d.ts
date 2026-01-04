export type ApiResponse<T> = {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ErrorResponse = {
  success: false;
  message: string;
  statusCode: number;
  data: T | null;
};

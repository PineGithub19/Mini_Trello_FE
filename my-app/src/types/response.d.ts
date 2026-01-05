export type ApiResponse<T> = {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ErrorResponse = {
  success: false;
  message: string;
  statusCode: number;
  data: T | null;
};

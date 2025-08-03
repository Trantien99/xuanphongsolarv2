export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationData;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  category?: string;
  status?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}
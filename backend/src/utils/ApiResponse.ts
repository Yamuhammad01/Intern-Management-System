export interface ApiResponseMeta {
  timestamp: string;
  requestId?: string;
  page?: number;
  limit?: number;
  totalItems?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data?: T;
  public readonly error?: {
    type: string;
    details?: unknown[];
  };
  public readonly meta: ApiResponseMeta;

  constructor(
    statusCode: number,
    message: string,
    data?: T,
    meta?: Partial<ApiResponseMeta>,
  ) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = {
      timestamp: new Date().toISOString(),
      ...meta,
    };
  }

  static success<T>(data: T, message = 'Success', meta?: Partial<ApiResponseMeta>): ApiResponse<T> {
    return new ApiResponse(200, message, data, meta);
  }

  static created<T>(data: T, message = 'Created successfully'): ApiResponse<T> {
    return new ApiResponse(201, message, data);
  }

  static noContent(message = 'Deleted successfully'): ApiResponse<void> {
    return new ApiResponse(204, message);
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message = 'Retrieved successfully',
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    return new ApiResponse(200, message, data, {
      page,
      limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  }
}
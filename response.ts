import { Response } from "express";

interface ApiResponse<T = any> {
  success: number;
  message: string;
  data?: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export class ResponseUtil {
  /**
   * Success (200 / 201)
   */
  static success<T>(
    res: Response,
    message = "success",
    data?: T,
    statusCode = 200
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: statusCode,
      message,
      ...(data !== undefined && { data }),
    });
  }

  /**
   * Success with pagination
   */
  static successWithPagination<T>(
    res: Response,
    message: string,
    data: T,
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    },
    statusCode = 200
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: statusCode,
      message,
      data,
      meta: { pagination },
    });
  }

  /**
   * Error response
   */
  static error(
    res: Response,
    message: string,
    statusCode = 400
  ): Response<ApiResponse> {
    return res.status(statusCode).json({
      success: statusCode,
      message,
    });
  }

  /**
   * Created (201)
   */
  static created<T>(
    res: Response,
    message: string,
    data?: T
  ): Response<ApiResponse<T>> {
    return this.success(res, message, data, 201);
  }

  /**
   * No Content (204) — NO BODY
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}

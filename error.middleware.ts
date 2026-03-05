import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { MESSAGES } from "../constants/messages";
import { HTTP_STATUS } from "../constants";

/**
 * Global Error Handler
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  let statusCode =
    error.statusCode || error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = error.message || MESSAGES.SERVER_ERROR;

  /**
   * Joi Validation Error
   */
  if (error?.isJoi === true && error.details?.length) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = error.details[0].message.replace(/"/g, "");
  } else if (error.name === "SequelizeUniqueConstraintError") {
    /**
     * Sequelize Errors
     */
    statusCode = HTTP_STATUS.CONFLICT;
    message = "Duplicate entry found";
  } else if (error.name === "SequelizeValidationError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = error.errors?.[0]?.message || MESSAGES.ERROR;
  } else if (error.name === "SequelizeForeignKeyConstraintError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = "Invalid reference";
  } else if (error.name === "JsonWebTokenError") {
    /**
     * JWT Errors
     */
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = MESSAGES.TOKEN_INVALID;
  } else if (error.name === "TokenExpiredError") {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = MESSAGES.TOKEN_EXPIRED;
  }

  /**
   * Internal logging (always)
   */
  logger.error(
    {
      err: error,
      url: req.originalUrl,
      method: req.method,
    },
    "Request failed"
  );

  /**
   * Strict API response format
   */
  return res.status(statusCode).json({
    success: statusCode,
    message,
  });
};

/**
 * 404 Handler
 */
export const notFoundHandler = (_req: Request, res: Response): Response => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: HTTP_STATUS.NOT_FOUND,
    message: MESSAGES.NOT_FOUND,
  });
};




// import { errorHandler, notFoundHandler } from "errorHandler./middlewares/error.middleware";
// app.use(notFoundHandler);
// app.use(errorHandler);
//import { v4 as uuid } from "uuid";
// app.disable("x-powered-by");
// app.use((req: any, res, next) => {
//   const requestId = uuid();
//   req.requestId = requestId;
//   res.setHeader("X-Request-Id", requestId);
//   next();
// });
/**
 * ===============================
 * CORS
 * ===============================
 */
// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );


/**
 * ===============================
 * Security: Helmet
 * ===============================
 */
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         scriptSrc: ["'self'"],
//         imgSrc: ["'self'", "data:", "https:"],
//       },
//     },
//     hsts: {
//       maxAge: 31536000,
//       includeSubDomains: true,
//       preload: true,
//     },
//   })
// );

// /**
//  * ===============================
//  * CORS
//  * ===============================
//  */
// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// /**
//  * ===============================
//  * Rate Limiting
//  * ===============================
//  */
// app.use(
//   rateLimit({
//     windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
//     max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: {
//       success: false,
//       message: "Too many requests from this IP, please try again later.",
//     },
//   })
// );

// /**
//  * ===============================
//  * Body Parsing
//  * ===============================
//  */
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

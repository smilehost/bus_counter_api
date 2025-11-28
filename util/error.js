import { Prisma } from '@prisma/client'


export class AppError extends Error {
  constructor(message, statusCode, detail = null, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.name = AppError.getHttpErrorName(statusCode);
    this.detail = detail;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static getHttpErrorName(code) {
    const map = {
      400: "Validation Failed",
      401: "Unauthorized Access",
      403: "Permission Denied",
      404: "Resource Not Found",
      409: "Conflict",
      429: "Too Many Requests",
      500: "Internal Server Error",
      502: "Bad Gateway",
      503: "Service Unavailable",
    };
    return map[code] ?? "Error";
  }

  static BadRequest(detail, msg = null, errors = null) {
    const message = msg || "Validation Failed";
    return new AppError(message, 400, detail, errors);
  }

  static Unauthorized(detail, msg = null) {
    const message = msg || "Unauthorized Access";
    return new AppError(message, 401, detail);
  }

  static Forbidden(detail, msg = null) {
    const message = msg || "Permission Denied";
    return new AppError(message, 403, detail);
  }

  static NotFound(detail, msg = null) {
    const message = msg || "Resource Not Found";
    return new AppError(message, 404, detail);
  }

  static Conflict(detail, msg = null) {
    const message = msg || "Conflict";
    return new AppError(message, 409, detail);
  }

  static TooManyRequests(detail, msg = null) {
    const message = msg || "Too Many Requests";
    return new AppError(message, 429, detail);
  }

  static Internal(detail, msg = null) {
    const message = msg || "Internal Server Error";
    return new AppError(message, 500, detail);
  }

  static BadGateway(detail, msg = null) {
    const message = msg || "Bad Gateway";
    return new AppError(message, 502, detail);
  }

  static ServiceUnavailable(detail, msg = null) {
    const message = msg || "Service Unavailable";
    return new AppError(message, 503, detail);
  }

  static fromPrismaError(error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      // Check for missing field errors
      const missingFieldMatch = RegExp(/Argument `(\w+)` is missing/).exec(
        error.message
      );

      if (missingFieldMatch) {
        const missingField = missingFieldMatch[1];
        return AppError.BadRequest(
          `The request body contains invalid data for the '${missingField}' field.`,
          `Missing required field: ${missingField}`,
          [{ field: missingField, message: `Missing required field: ${missingField}` }]
        );
      }
      
      // Check for invalid value type errors
      const invalidValueMatch = RegExp(/Argument `(\w+)`: Invalid value provided\. Expected (\w+), provided (\w+)/).exec(
        error.message
      );

      if (invalidValueMatch) {
        const fieldName = invalidValueMatch[1];
        const expectedType = invalidValueMatch[2];
        const providedType = invalidValueMatch[3];
        return AppError.BadRequest(
          `The request body contains invalid data for the '${fieldName}' field.`,
          `Invalid type for field '${fieldName}'. Expected ${expectedType}, but received ${providedType}.`,
          [{ field: fieldName, message: `Expected ${expectedType}, but received ${providedType}` }]
        );
      }
      return AppError.BadRequest(
        "The request body contains invalid data.",
        "Invalid input data"
      );
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          const targetFields = (error.meta?.target) || [];
          return AppError.Conflict(
            `Duplicate value for unique field(s): ${targetFields.join(", ")}`
          );
        case "P2025":
          return AppError.NotFound(
            error.message || "The requested resource could not be found.",
            error.message || "Record not found"
          );
      }

      return AppError.BadRequest(
        "The request to the database is invalid.",
        "Invalid request to database"
      );
    }
    return AppError.Internal(
      "An unexpected error occurred while processing your request.",
      "Unexpected database error"
    );
  }

  static sendError(res, error) {
    if (!(error instanceof AppError)) {
      return ExceptionHandler.internalServerError(res, error);
    }

    const response = ExceptionHandler.createErrorResponse(
      error.statusCode,
      error.message,
      error.detail,
      error.errors
    );
    
    res.status(error.statusCode).json(response);
  }

  static handleError(res, error) {
    if (error instanceof AppError) {
      AppError.sendError(res, error)
    }else{
      const newErr = AppError.Internal(error);
      AppError.sendError(res, newErr);
    }
  }
}

export class ExceptionHandler {
  static extractMessage(error) {
    if (!error) return "Unknown error";
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return JSON.stringify(error);
  }

  static createErrorResponse(statusCode, message, detail = null, errors = null) {
    return {
      success: false,
      message,
      ...(detail && { detail }),
      ...(errors && { errors })
    };
  }

}
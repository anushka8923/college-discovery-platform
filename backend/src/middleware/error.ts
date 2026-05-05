import type { NextFunction, Request, Response } from "express";
import type { Prisma } from "@prisma/client";

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function asyncHandler(handler: AsyncRequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
}

function isPrismaConnectionError(err: Error) {
  const prismaError = err as Prisma.PrismaClientKnownRequestError;
  return (
    err.name === "PrismaClientInitializationError" ||
    err.name === "PrismaClientRustPanicError" ||
    prismaError.code === "P1000" ||
    prismaError.code === "P1001" ||
    prismaError.code === "P1002" ||
    prismaError.code === "P1003"
  );
}

export function errorHandler(err: Error | ApiError, _req: Request, res: Response, _next: NextFunction) {
  const isDbConnectionError = !(err instanceof ApiError) && isPrismaConnectionError(err);
  const statusCode = isDbConnectionError ? 503 : err instanceof ApiError ? err.statusCode : 500;
  const message = isDbConnectionError ? "Database connection failed" : statusCode === 500 ? "Internal server error" : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: message
  });
}

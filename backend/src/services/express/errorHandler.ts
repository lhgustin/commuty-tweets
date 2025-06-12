import type { Request, Response, NextFunction } from "express";
import { type ApiError } from "../../../../common/index.ts";

export type AppError = Error & {
  status?: number;
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response<ApiError>,
  next: NextFunction,
) => {
  console.error(err);
  // If the headers have already been sent (streaming), delegate to the default error handler
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};

import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("API ERROR:", err);

  const status =
    err.status || err.code || (err.name === "ValidationError" ? 400 : 500);

  const message =
    err.message ||
    (status === 500 ? "Internal server error" : "Request failed");

    // Uniform error response format
  res.status(status).json({
    success: false,
    message,
    // details can be given in dev mode
    // details: process.env.NODE_ENV === "development" ? err : undefined,
  });
}

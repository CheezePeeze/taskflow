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

  // Единый формат ответа об ошибке
  res.status(status).json({
    success: false,
    message,
    // details можно отдавать в dev-режиме
    // details: process.env.NODE_ENV === "development" ? err : undefined,
  });
}

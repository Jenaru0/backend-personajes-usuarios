// src/middlewares/error.middleware.ts

import { Request, Response, NextFunction } from "express";

/**
 * Middleware global para manejo de errores.
 * Captura el error, lo loguea y envía una respuesta coherente al cliente.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || "Error interno del servidor",
  });
};

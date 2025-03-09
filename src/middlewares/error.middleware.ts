// c:\Users\jonna\OneDrive\Escritorio\backend + frontend\backend\src\middlewares\error.middleware.ts
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

/**
 * Middleware global para manejo de errores.
 * Captura el error, lo loguea y envía una respuesta coherente al cliente.
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Más información sobre el error en desarrollo
  console.error(`[ERROR] ${new Date().toISOString()}: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error(`Request: ${req.method} ${req.path}`);

  // Determinar tipo de error para respuesta apropiada
  if (err.name === "ValidationError") {
    res.status(400).json({
      error: "Error de validación",
      details: err.message,
    });
    return;
  }

  if (err.name === "PrismaClientKnownRequestError") {
    res.status(400).json({
      error: "Error en la base de datos",
      details:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Error de operación en base de datos",
    });
    return;
  }

  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      error: "Error de autenticación",
      details: "Token inválido",
    });
    return;
  }

  // Error genérico
  res.status(500).json({
    error: "Error interno del servidor",
    details:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Ocurrió un error en el servidor",
  });
};

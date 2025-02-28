// src/middlewares/role.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Middleware para validar que el usuario tenga un rol específico.
 * @param requiredRole Rol requerido (ej. "ADMIN")
 */
export const roleMiddleware = (requiredRole: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user || user.rol !== requiredRole) {
      // Se envía la respuesta de error y se retorna sin devolver ningún valor
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    next();
  };
};

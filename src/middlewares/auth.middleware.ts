// c:\Users\jonna\OneDrive\Escritorio\backend + frontend\backend\src\middlewares\auth.middleware.ts
// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";

/**
 * Middleware para validar el token JWT en las peticiones.
 * Si es válido, añade la información del usuario a req.user.
 */
export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No se proporcionó token" });
    return;
  }

  // Mejor manejo del formato de token
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ error: "Formato de token inválido" });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    (req as any).user = decoded; // Se agrega la info del usuario a la petición
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};

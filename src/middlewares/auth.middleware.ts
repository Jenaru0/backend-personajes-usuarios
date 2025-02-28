// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

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
  const token = authHeader.split(" ")[1]; // Se espera formato "Bearer token"
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; // Se agrega la info del usuario a la petición
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};

// c:\Users\jonna\OneDrive\Escritorio\backend + frontend\backend\src\routes\auth.ts
// src/routes/auth.ts

import { Router } from "express";
import { AuthController } from "../auth/auth.controller";
import {
  validateCrearUsuario,
  validateCrearUsuarioAdmin,
} from "../validators/usuario.validator";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Ruta para registro normal de usuarios
router.post("/register", validateCrearUsuario, AuthController.register);

// Ruta para registro de admin (protegida)
router.post(
  "/register/admin",
  authMiddleware, // Requiere autenticación
  roleMiddleware("ADMIN"), // Requiere rol ADMIN
  validateCrearUsuarioAdmin,
  AuthController.register
);

// Ruta para login
router.post("/login", AuthController.login);

// Ruta para refrescar token
router.post("/refresh", AuthController.refreshToken);

export default router;

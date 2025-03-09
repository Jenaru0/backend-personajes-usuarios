// c:\Users\jonna\OneDrive\Escritorio\backend + frontend\backend\src\routes\usuario.ts
// src/routes/usuario.ts

import express from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validateActualizarUsuario } from "../validators/usuario.validator";

const router = express.Router();

// Solo usuarios ADMIN pueden acceder a estas rutas
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  UsuarioController.listar
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateActualizarUsuario,
  UsuarioController.actualizar
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  UsuarioController.eliminar
);

export default router;

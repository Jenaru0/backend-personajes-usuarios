// src/routes/personaje.ts

import express from "express";
import { PersonajeController } from "../controllers/personaje.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Listar personajes (GET /personajes/list)
router.get("/list", PersonajeController.listar);

// Obtener un personaje por ID (GET /personajes/only/:id)
router.get("/only/:id", PersonajeController.obtener);

// Crear un personaje (POST /personajes)
router.post("/", PersonajeController.crear);

// Actualizar un personaje (PUT /personajes/:id)
router.put("/:id", PersonajeController.actualizar);

// Eliminar un personaje (DELETE /personajes/:id)
router.delete("/:id", PersonajeController.eliminar);

export default router;

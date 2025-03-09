// c:\Users\jonna\OneDrive\Escritorio\backend + frontend\backend\src\routes\personaje.ts
// src/routes/personaje.ts

import express from "express";
import { PersonajeController } from "../controllers/personaje.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware"; // Faltaba este import
import {
  validateCrearPersonaje,
  validateActualizarPersonaje,
} from "../validators/personaje.validator";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// RUTAS GENERALES
// Listar personajes del usuario (GET /personajes/list)
router.get("/list", PersonajeController.listar);

// Obtener un personaje por ID (GET /personajes/only/:id)
router.get("/only/:id", PersonajeController.obtener);

// Crear un personaje (POST /personajes)
router.post("/", validateCrearPersonaje, PersonajeController.crear);

// Actualizar un personaje (PUT /personajes/:id)
router.put("/:id", validateActualizarPersonaje, PersonajeController.actualizar);

// Eliminar un personaje (DELETE /personajes/:id)
router.delete("/:id", PersonajeController.eliminar);

// RUTAS ADMIN - Las rutas estaban mal formadas
// ADMIN: Obtener todos los personajes (GET /personajes/admin)
router.get(
  "/admin", // Corregido: esta URL será /personajes/admin
  roleMiddleware("ADMIN"), // Ya tenemos authMiddleware global
  PersonajeController.listarTodos
);

// ADMIN: Actualizar cualquier personaje (PUT /personajes/admin/:id)
router.put(
  "/admin/:id", // Corregido: esta URL será /personajes/admin/:id
  roleMiddleware("ADMIN"),
  validateActualizarPersonaje,
  PersonajeController.actualizarCualquiera
);

// ADMIN: Eliminar cualquier personaje (DELETE /personajes/admin/:id)
router.delete(
  "/admin/:id", // Corregido: esta URL será /personajes/admin/:id
  roleMiddleware("ADMIN"),
  PersonajeController.eliminarCualquiera
);

export default router;

// src/routes/auth.ts

import express from "express";
import { AuthController } from "../auth/auth.controller";

const router = express.Router();

// Ruta para registrar usuario
router.post("/register", AuthController.register);

// Ruta para login
router.post("/login", AuthController.login);

export default router;

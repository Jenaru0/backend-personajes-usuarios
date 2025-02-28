// src/app.ts

// IMPORTANTE: La importación de "express-async-errors" se hace al inicio para capturar errores en funciones async.
import "express-async-errors";
import express from "express";

// Importación de rutas
import authRoutes from "./routes/auth";
import usuarioRoutes from "./routes/usuario";
import personajeRoutes from "./routes/personaje";

// Middleware global de manejo de errores
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Rutas de la API
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/personajes", personajeRoutes);

// Middleware global para manejar errores
app.use(errorHandler);

// Iniciar servidor en el puerto configurado (o 3000 por defecto)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

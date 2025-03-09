// c:\Users\jonna\OneDrive\Escritorio\backend + frontend\backend\src\app.ts
// src/app.ts
import "express-async-errors";
import express from "express";
import cors from "cors";
import env from "./config/env";

// Importación de rutas
import authRoutes from "./routes/auth";
import usuarioRoutes from "./routes/usuario";
import personajeRoutes from "./routes/personaje";

// Middleware global de manejo de errores
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Configuración de CORS mejorada
const allowedOrigins = [
  "https://frontend-personajes-usuarios-mcw7-9buoqbhv7.vercel.app", // URL de Vercel
  "http://localhost:3000", // URL de desarrollo local
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir solicitudes sin origen (como Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Origen bloqueado por CORS:", origin);
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Rutas de la API
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/personajes", personajeRoutes);

// Middleware global para manejar errores
app.use(errorHandler);

// Iniciar servidor en el puerto configurado desde config
app.listen(env.PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${env.PORT}`);
  console.log(`📊 Modo: ${env.NODE_ENV}`);
});

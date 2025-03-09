// c:\Users\jonna\OneDrive\Escritorio\backend + frontend\backend\src\config\env.ts
import dotenv from "dotenv";
import path from "path";

// Cargar variables de entorno
dotenv.config();

// Objeto centralizado de variables de entorno con tipado
interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  NODE_ENV: string;
  FRONTEND_URL: string;
}

// Configuración con validaciones
const env: EnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};

// Validar variables requeridas
if (!env.JWT_SECRET) {
  console.error("⚠️ Variable JWT_SECRET no definida en .env");
  console.error("Por favor, define JWT_SECRET en tu archivo .env");
  process.exit(1);
}

if (!env.DATABASE_URL) {
  console.error("⚠️ Variable DATABASE_URL no definida en .env");
  console.error("Por favor, define DATABASE_URL en tu archivo .env");
  process.exit(1);
}

export default env;

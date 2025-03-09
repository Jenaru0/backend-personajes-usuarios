import { Router } from "express";
import { readdirSync } from "fs";

const PATH_ROUTER = `${__dirname}`;
const router = Router();

// Ruta base para verificar que el servidor funciona
router.get("/", (req, res) => {
  res.json({ message: "¡Servidor funcionando correctamente!" });
});

// Carga dinámica de rutas
const cleanFileName = (fileName: string) => fileName.split(".").shift();

readdirSync(PATH_ROUTER).forEach((filename) => {
  const cleanName = cleanFileName(filename);
  if (cleanName && cleanName !== "index") {
    import(`./${cleanName}`).then((moduleRouter) => {
      // Corregido: usar .default en lugar de .router
      router.use(`/${cleanName}`, moduleRouter.default);
    });
  }
});

export { router };

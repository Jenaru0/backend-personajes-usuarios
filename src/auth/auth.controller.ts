// c:\Users\jonna\OneDrive\Escritorio\backend + frontend\backend\src\auth\auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { UsuarioService } from "../services/usuario.service";

export class AuthController {
  // Registrar usuario
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extraer datos del body incluyendo campos opcionales
      const { nombre, correo, contraseña, rol, isActive } = req.body;

      // Determinar si es admin basado en el usuario O en la ruta
      const isAdminUser = (req as any).user?.rol === "ADMIN";
      const isAdminRoute = req.originalUrl.includes("/register/admin");
      const isAdmin = isAdminUser || isAdminRoute;

      // Verificar si el correo ya está registrado
      const existingUser = await UsuarioService.buscarPorCorreo(correo);
      if (existingUser) {
        res.status(400).json({ error: "El correo ya está registrado" });
        return;
      }

      // Registrar el usuario con los datos proporcionados
      const nuevoUsuario = await UsuarioService.registrar(
        nombre,
        correo,
        contraseña,
        isAdmin ? rol : undefined, // Permitir rol si es admin o ruta admin
        isAdmin ? isActive : undefined // Permitir estado si es admin o ruta admin
      );

      // Responder sin incluir la contraseña
      res.status(201).json({
        message: "Usuario registrado exitosamente",
        usuario: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          correo: nuevoUsuario.correo,
          rol: nuevoUsuario.rol,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Iniciar sesión (login)
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { correo, contraseña } = req.body;
      const result = await AuthService.login(correo, contraseña);
      res.json({
        message: "Login exitoso",
        token: result.accessToken,
        refreshToken: result.refreshToken,
        usuario: result.usuario,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  // Renovar token de acceso usando refresh token
  static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ error: "Refresh token requerido" });
        return;
      }

      const result = await AuthService.refreshToken(refreshToken);
      res.json({ token: result.accessToken });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}

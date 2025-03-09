// c:\Users\jonna\OneDrive\Escritorio\backend + frontend\backend\src\auth\auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UsuarioService } from "../services/usuario.service";
import env from "../config/env";

// Duración de tokens
const ACCESS_TOKEN_EXPIRY = "24h";
const REFRESH_TOKEN_EXPIRY = "7d";

export class AuthService {
  // Generar token de acceso
  static generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, rol: role }, env.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  // Generar refresh token (para renovar el token de acceso)
  static generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, env.JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });
  }

  // Verificar credenciales y generar tokens
  static async login(correo: string, contraseña: string) {
    // Buscar usuario por correo
    const usuario = await UsuarioService.buscarPorCorreo(correo);

    // Validar existencia y comparar la contraseña
    if (!usuario || !(await bcrypt.compare(contraseña, usuario.contraseña))) {
      throw new Error("Credenciales inválidas");
    }

    // Verificar si el usuario está activo
    if (!usuario.isActive) {
      throw new Error("Usuario inactivo");
    }

    // Generar tokens
    const accessToken = this.generateAccessToken(usuario.id, usuario.rol);
    const refreshToken = this.generateRefreshToken(usuario.id);

    return {
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    };
  }

  // Renovar token de acceso usando refresh token
  static async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
      const usuario = await UsuarioService.buscarPorId(decoded.id);

      if (!usuario || !usuario.isActive) {
        throw new Error("Usuario inválido o inactivo");
      }

      return {
        accessToken: this.generateAccessToken(usuario.id, usuario.rol),
      };
    } catch (error) {
      throw new Error("Token de actualización inválido");
    }
  }
}

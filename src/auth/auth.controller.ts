// src/auth/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UsuarioService } from "../services/usuario.service";
import dotenv from "dotenv";

dotenv.config();

// Se obtiene la clave secreta del JWT desde las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

export class AuthController {
  // Registrar usuario
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extraer datos del body
      const { nombre, correo, contraseña } = req.body;
      // Registrar el usuario (la contraseña se encripta en el servicio)
      const nuevoUsuario = await UsuarioService.registrar(
        nombre,
        correo,
        contraseña
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
      // Buscar usuario por correo
      const usuario = await UsuarioService.buscarPorCorreo(correo);
      // Validar existencia y comparar la contraseña
      if (!usuario || !(await bcrypt.compare(contraseña, usuario.contraseña))) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }
      // Generar token JWT con duración de 5 minutos
      const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, {
        expiresIn: "5m",
      });
      res.json({ message: "Login exitoso", token });
    } catch (error) {
      next(error);
    }
  }
}

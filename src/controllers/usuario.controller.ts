// src/controllers/usuario.controller.ts

import { Request, Response, NextFunction } from "express";
import { UsuarioService } from "../services/usuario.service";

export class UsuarioController {
  // Listar todos los usuarios (accesible solo para ADMIN)
  static async listar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const usuarios = await UsuarioService.listarUsuarios();
      res.json({ usuarios });
      return; // Se retorna sin valor, es decir, undefined.
    } catch (error) {
      next(error);
    }
  }

  // Actualizar usuario (por ADMIN)
  static async actualizar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const usuarioActualizado = await UsuarioService.actualizarUsuario(
        id,
        data
      );
      res.json({ message: "Usuario actualizado", usuario: usuarioActualizado });
      return;
    } catch (error) {
      next(error);
    }
  }

  // Soft delete de usuario (por ADMIN)
  static async eliminar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const usuarioEliminado = await UsuarioService.eliminarUsuario(id);
      res.json({
        message: "Usuario eliminado (soft delete)",
        usuario: usuarioEliminado,
      });
      return;
    } catch (error) {
      next(error);
    }
  }
}

// src/controllers/personaje.controller.ts

import { Request, Response, NextFunction } from "express";
import { PersonajeService } from "../services/personaje.service";

export class PersonajeController {
  // Listar personajes del usuario autenticado
  static async listar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Se obtiene la información del usuario autenticado (agregada por el middleware auth)
      const user = (req as any).user;
      // Se listan los personajes del usuario
      const personajes = await PersonajeService.listarPorUsuario(user.id);
      res.json({ personajes });
    } catch (error) {
      next(error);
    }
  }

  // Obtener un personaje específico
  static async obtener(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const personaje = await PersonajeService.obtenerPorId(id, user.id);
      if (!personaje) {
        res.status(404).json({ error: "Personaje no encontrado" });
        return;
      }
      res.json({ personaje });
    } catch (error) {
      next(error);
    }
  }

  // Crear un nuevo personaje
  static async crear(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      const { nombre, foto } = req.body;
      const nuevoPersonaje = await PersonajeService.crear(
        user.id,
        nombre,
        foto
      );
      res
        .status(201)
        .json({ message: "Personaje creado", personaje: nuevoPersonaje });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar un personaje
  static async actualizar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const data = req.body;
      const personajeActualizado = await PersonajeService.actualizar(
        id,
        user.id,
        data
      );
      res.json({
        message: "Personaje actualizado",
        personaje: personajeActualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar un personaje
  static async eliminar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      await PersonajeService.eliminar(id, user.id);
      res.json({ message: "Personaje eliminado" });
    } catch (error) {
      next(error);
    }
  }
}

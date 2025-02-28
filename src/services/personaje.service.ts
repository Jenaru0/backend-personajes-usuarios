// src/services/personaje.service.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PersonajeService {
  // Listar personajes de un usuario
  static async listarPorUsuario(userId: string) {
    return prisma.personaje.findMany({ where: { userId } });
  }

  // Obtener un personaje por ID (verificando que pertenezca al usuario)
  static async obtenerPorId(id: string, userId: string) {
    return prisma.personaje.findFirst({ where: { id, userId } });
  }

  // Crear un personaje para el usuario autenticado
  static async crear(userId: string, nombre: string, foto: string) {
    return prisma.personaje.create({
      data: {
        nombre,
        foto,
        userId,
      },
    });
  }

  // Actualizar un personaje (solo si pertenece al usuario)
  static async actualizar(
    id: string,
    userId: string,
    data: { nombre?: string; foto?: string }
  ) {
    // Validar que el personaje exista y pertenezca al usuario
    const personaje = await prisma.personaje.findFirst({
      where: { id, userId },
    });
    if (!personaje) {
      throw new Error("Personaje no encontrado o no pertenece al usuario");
    }
    return prisma.personaje.update({
      where: { id },
      data,
    });
  }

  // Eliminar un personaje (eliminación física)
  static async eliminar(id: string, userId: string) {
    // Validar que el personaje exista y pertenezca al usuario
    const personaje = await prisma.personaje.findFirst({
      where: { id, userId },
    });
    if (!personaje) {
      throw new Error("Personaje no encontrado o no pertenece al usuario");
    }
    return prisma.personaje.delete({ where: { id } });
  }
}

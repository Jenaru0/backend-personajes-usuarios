// src/services/usuario.service.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export class UsuarioService {
  // Registrar usuario: encripta la contraseña y crea el registro en la BD
  static async registrar(nombre: string, correo: string, contraseña: string) {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await prisma.user.create({
      data: {
        nombre,
        correo,
        contraseña: hashedPassword,
        // El rol se asigna por defecto REGULAR según el schema
      },
    });
    return nuevoUsuario;
  }

  // Buscar usuario por correo
  static async buscarPorCorreo(correo: string) {
    return prisma.user.findUnique({ where: { correo } });
  }

  // Listar todos los usuarios (para uso por ADMIN)
  static async listarUsuarios() {
    return prisma.user.findMany();
  }

  // Actualizar usuario (por ADMIN)
  static async actualizarUsuario(
    id: string,
    data: Partial<{
      nombre: string;
      correo: string;
      rol: "ADMIN" | "REGULAR"; // Especificamos explícitamente los valores permitidos
      contraseña: string;
      isActive: boolean;
    }>
  ) {
    // Encriptar la contraseña si se quiere actualizar
    if (data.contraseña) {
      data.contraseña = await bcrypt.hash(data.contraseña, 10);
    }
    // Convertir el rol a su tipo explícito si se proporciona
    if (data.rol) {
      data.rol = data.rol as "ADMIN" | "REGULAR";
    }
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  // Soft delete: marcar usuario como inactivo
  static async eliminarUsuario(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

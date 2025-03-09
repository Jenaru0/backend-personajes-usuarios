import { check, ValidationChain } from "express-validator";
import { validateResult } from "../middlewares/validate.middleware";
import { Request, Response, NextFunction } from "express";

// Middleware para rechazar campos no permitidos
const rejectUnknownFields = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Lista de campos permitidos
  const allowedFields = ["nombre", "foto"];

  // Verificar si hay campos adicionales
  const extraFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (extraFields.length > 0) {
    res.status(400).json({
      errors: [
        {
          msg: `Campos no permitidos: ${extraFields.join(", ")}`,
          param: extraFields[0],
          location: "body",
        },
      ],
    });
    return; // Solo retornamos sin devolver un valor
  }

  next();
};

// Validaciones para crear personaje
export const validateCrearPersonajeRules: ValidationChain[] = [
  check("nombre")
    .exists()
    .withMessage("El nombre es requerido")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  check("foto")
    .exists()
    .withMessage("La URL de la foto es requerida")
    // Reemplazar la validación estricta por una más flexible
    .isString()
    .withMessage("La foto debe ser texto")
    // Opcionalmente, validar un formato muy básico de URL
    .custom((value) => {
      // Aceptar cualquier string que al menos parezca una URL
      if (value && typeof value === "string" && value.length > 0) {
        return true;
      }
      return false;
    })
    .withMessage("La foto debe ser un texto no vacío"),
];

// Middleware compuesto: primero aplica las reglas, luego valida el resultado
export const validateCrearPersonaje = [
  rejectUnknownFields,
  ...validateCrearPersonajeRules,
  validateResult,
];

// Validaciones para actualizar personaje
export const validateActualizarPersonajeRules: ValidationChain[] = [
  check("nombre")
    .optional()
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  check("foto")
    .optional()
    .isString()
    .withMessage("La foto debe ser texto")
    // Validación más flexible
    .custom((value) => {
      if (value && typeof value === "string" && value.length > 0) {
        return true;
      }
      return false;
    })
    .withMessage("La foto debe ser un texto no vacío"),
];

// Middleware compuesto para actualizar
export const validateActualizarPersonaje = [
  rejectUnknownFields,
  ...validateActualizarPersonajeRules,
  validateResult,
];

import { check, ValidationChain } from "express-validator";
import { validateResult } from "../middlewares/validate.middleware";
import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";

// Separar la lógica por responsabilidades
const getPermittedFields = (isAdmin: boolean): string[] => {
  const baseFields = ["nombre", "correo", "contraseña"];
  return isAdmin ? [...baseFields, "rol", "isActive"] : baseFields;
};

// Middleware mejorado para rechazar campos - solo se enfoca en una cosa
const rejectUnknownFields: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Determinar si es admin basado en el usuario o en la ruta
  const isAdminUser = (req as any).user?.rol === "ADMIN";
  const isAdminRoute = req.originalUrl.includes("/register/admin");
  const isAdmin = isAdminUser || isAdminRoute;

  const allowedFields = getPermittedFields(isAdmin);

  // Verificar campos adicionales
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
    return;
  }

  next();
};

// Validaciones base para datos de usuario (reutilizables)
const nombreRules = [
  check("nombre")
    .exists()
    .withMessage("El nombre es requerido")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres"),
];

const correoRules = [
  check("correo")
    .exists()
    .withMessage("El correo es requerido")
    .isEmail()
    .withMessage("El formato de correo no es válido")
    .normalizeEmail(),
];

const contraseñaRules = [
  check("contraseña")
    .exists()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe incluir al menos un número")
    .matches(/[a-zA-Z]/)
    .withMessage("La contraseña debe incluir al menos una letra"),
];

const rolRules = [
  check("rol")
    .optional()
    .isIn(["ADMIN", "REGULAR"])
    .withMessage("El rol debe ser ADMIN o REGULAR"),
];

const isActiveRules = [
  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive debe ser un valor booleano"),
];

// Crear regulares
export const validateCrearUsuarioRules: ValidationChain[] = [
  ...nombreRules,
  ...correoRules,
  ...contraseñaRules,
];

// Crear para administradores (puede incluir rol e isActive)
export const validateCrearUsuarioAdminRules: ValidationChain[] = [
  ...validateCrearUsuarioRules,
  ...rolRules,
  ...isActiveRules,
];

// Actualizar (todos los campos son opcionales)
export const validateActualizarUsuarioRules: ValidationChain[] = [
  check("nombre")
    .optional()
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres"),

  check("correo")
    .optional()
    .isEmail()
    .withMessage("El formato de correo no es válido")
    .normalizeEmail(),

  check("contraseña")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe incluir al menos un número")
    .matches(/[a-zA-Z]/)
    .withMessage("La contraseña debe incluir al menos una letra"),

  ...rolRules,
  ...isActiveRules,
];

// Middlewares compuestos
export const validateCrearUsuario: RequestHandler[] = [
  rejectUnknownFields,
  ...(validateCrearUsuarioRules as unknown as RequestHandler[]),
  validateResult,
];

export const validateCrearUsuarioAdmin: RequestHandler[] = [
  rejectUnknownFields,
  ...(validateCrearUsuarioAdminRules as unknown as RequestHandler[]),
  validateResult,
];

export const validateActualizarUsuario: RequestHandler[] = [
  rejectUnknownFields,
  ...(validateActualizarUsuarioRules as unknown as RequestHandler[]),
  validateResult,
];

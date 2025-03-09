// src/types.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      rol: string;
      nombre: string;
      [key: string]: any;
    };
  }
}

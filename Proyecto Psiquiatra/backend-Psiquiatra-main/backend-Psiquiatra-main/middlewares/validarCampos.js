import { validationResult } from 'express-validator';

// Middleware que corta la petición si hay errores de validación
export const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
};

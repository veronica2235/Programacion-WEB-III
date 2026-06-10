import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Verifica que el token JWT sea válido
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
};

// Solo permite acceso al rol 'admin'
export const soloAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol administrador.' });
    }
    next();
};

// Permite acceso a admin y recepcionista
export const adminORecepcionista = (req, res, next) => {
    const rolesPermitidos = ['admin', 'recepcionista'];
    if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({ error: 'Acceso denegado. Permisos insuficientes.' });
    }
    next();
};

import { db } from '../config/db.js';

export const obtUsuarioPorEmail = async (email) => {
    const [resultado] = await db.query(
        'SELECT * FROM usuarios WHERE email = ? AND activo = 1',
        [email]
    );
    return resultado[0];
};

export const obtUsuarioPorId = async (id) => {
    const [resultado] = await db.query(
        'SELECT id, nombre, email, rol, activo, created_at FROM usuarios WHERE id = ?',
        [id]
    );
    return resultado[0];
};

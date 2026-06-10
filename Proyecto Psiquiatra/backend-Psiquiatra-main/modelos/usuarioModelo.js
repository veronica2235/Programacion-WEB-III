import { db } from '../config/db.js';

export const obtTodo = async () => {
    const [resultado] = await db.query(
        'SELECT id, nombre, email, rol, activo, created_at FROM usuarios ORDER BY created_at DESC'
    );
    return resultado;
};

export const obtUsuario = async (id) => {
    const [resultado] = await db.query(
        'SELECT id, nombre, email, rol, activo, created_at FROM usuarios WHERE id = ?', [id]
    );
    return resultado[0];
};

export const obtPorEmail = async (email) => {
    const [resultado] = await db.query(
        'SELECT * FROM usuarios WHERE email = ?', [email]
    );
    return resultado[0];
};

export const inserta = async (usuario) => {
    const { nombre, email, password, rol } = usuario;
    const [resultado] = await db.query(
        'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
        [nombre, email, password, rol || 'recepcionista']
    );
    return { id: resultado.insertId, nombre, email, rol };
};

export const actualiza = async (id, usuario) => {
    const { nombre, email, rol } = usuario;
    await db.query(
        'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?',
        [nombre, email, rol, id]
    );
    return { id, nombre, email, rol };
};

export const actualizaPassword = async (id, passwordHash) => {
    await db.query(
        'UPDATE usuarios SET password = ? WHERE id = ?',
        [passwordHash, id]
    );
    return id;
};

export const eliminaLogico = async (id) => {
    await db.query('UPDATE usuarios SET activo = 0 WHERE id = ?', [id]);
    return id;
};

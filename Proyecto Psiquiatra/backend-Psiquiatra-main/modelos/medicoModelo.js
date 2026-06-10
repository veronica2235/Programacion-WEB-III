import { db } from '../config/db.js';

export const obtTodo = async () => {
    const [resultado] = await db.query(
        'SELECT * FROM medicos WHERE activo = 1 ORDER BY apellido ASC'
    );
    return resultado;
};

export const obtMedico = async (id) => {
    const [resultado] = await db.query(
        'SELECT * FROM medicos WHERE id = ?', [id]
    );
    return resultado[0];
};

export const inserta = async (medico) => {
    const { nombre, apellido, especialidad, telefono, email } = medico;
    const [resultado] = await db.query(
        'INSERT INTO medicos (nombre, apellido, especialidad, telefono, email) VALUES (?, ?, ?, ?, ?)',
        [nombre, apellido, especialidad, telefono, email]
    );
    return { id: resultado.insertId, ...medico };
};

export const actualiza = async (id, medico) => {
    const { nombre, apellido, especialidad, telefono, email } = medico;
    await db.query(
        'UPDATE medicos SET nombre = ?, apellido = ?, especialidad = ?, telefono = ?, email = ? WHERE id = ?',
        [nombre, apellido, especialidad, telefono, email, id]
    );
    return { id, ...medico };
};

export const eliminaLogico = async (id) => {
    await db.query('UPDATE medicos SET activo = 0 WHERE id = ?', [id]);
    return id;
};

import { db } from '../config/db.js';

export const obtTodo = async () => {
    const [resultado] = await db.query(`
        SELECT p.*, CONCAT(m.nombre, ' ', m.apellido) AS medico_nombre
        FROM pacientes p
        LEFT JOIN medicos m ON p.medico_id = m.id
        WHERE p.activo = 1
        ORDER BY p.created_at DESC
    `);
    return resultado;
};

export const obtTodoIncluyendoInactivos = async () => {
    const [resultado] = await db.query(`
        SELECT p.*, CONCAT(m.nombre, ' ', m.apellido) AS medico_nombre
        FROM pacientes p
        LEFT JOIN medicos m ON p.medico_id = m.id
        ORDER BY p.created_at DESC
    `);
    return resultado;
};

export const obtPaciente = async (id) => {
    const [resultado] = await db.query(`
        SELECT p.*, CONCAT(m.nombre, ' ', m.apellido) AS medico_nombre
        FROM pacientes p
        LEFT JOIN medicos m ON p.medico_id = m.id
        WHERE p.id = ?
    `, [id]);
    return resultado[0];
};

export const inserta = async (paciente) => {
    const {
        nombre, apellido, ci, fecha_nacimiento, genero,
        telefono, direccion, contacto_emergencia,
        telefono_emergencia, diagnostico_inicial, medico_id
    } = paciente;

    const [resultado] = await db.query(
        `INSERT INTO pacientes
         (nombre, apellido, ci, fecha_nacimiento, genero, telefono, direccion,
          contacto_emergencia, telefono_emergencia, diagnostico_inicial, medico_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, apellido, ci, fecha_nacimiento, genero, telefono, direccion,
         contacto_emergencia, telefono_emergencia, diagnostico_inicial, medico_id]
    );
    return { id: resultado.insertId, ...paciente };
};

export const actualiza = async (id, paciente) => {
    const {
        nombre, apellido, ci, fecha_nacimiento, genero,
        telefono, direccion, contacto_emergencia,
        telefono_emergencia, diagnostico_inicial, medico_id
    } = paciente;

    await db.query(
        `UPDATE pacientes SET
         nombre = ?, apellido = ?, ci = ?, fecha_nacimiento = ?, genero = ?,
         telefono = ?, direccion = ?, contacto_emergencia = ?,
         telefono_emergencia = ?, diagnostico_inicial = ?, medico_id = ?
         WHERE id = ?`,
        [nombre, apellido, ci, fecha_nacimiento, genero, telefono, direccion,
         contacto_emergencia, telefono_emergencia, diagnostico_inicial, medico_id, id]
    );
    return { id, ...paciente };
};

// Eliminación lógica — solo cambia activo = 0
export const eliminaLogico = async (id) => {
    await db.query('UPDATE pacientes SET activo = 0 WHERE id = ?', [id]);
    return id;
};

// Reactivar paciente
export const reactiva = async (id) => {
    await db.query('UPDATE pacientes SET activo = 1 WHERE id = ?', [id]);
    return id;
};

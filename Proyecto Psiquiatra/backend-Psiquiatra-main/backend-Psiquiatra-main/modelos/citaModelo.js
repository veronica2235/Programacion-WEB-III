import { db } from '../config/db.js';

export const obtTodo = async () => {
    const [resultado] = await db.query(`
        SELECT c.*,
               CONCAT(p.nombre, ' ', p.apellido) AS paciente_nombre,
               CONCAT(m.nombre, ' ', m.apellido) AS medico_nombre
        FROM citas c
        INNER JOIN pacientes p ON c.paciente_id = p.id
        INNER JOIN medicos   m ON c.medico_id   = m.id
        ORDER BY c.fecha DESC, c.hora ASC
    `);
    return resultado;
};

export const obtCita = async (id) => {
    const [resultado] = await db.query(`
        SELECT c.*,
               CONCAT(p.nombre, ' ', p.apellido) AS paciente_nombre,
               CONCAT(m.nombre, ' ', m.apellido) AS medico_nombre
        FROM citas c
        INNER JOIN pacientes p ON c.paciente_id = p.id
        INNER JOIN medicos   m ON c.medico_id   = m.id
        WHERE c.id = ?
    `, [id]);
    return resultado[0];
};

export const obtCitasHoy = async () => {
    const [resultado] = await db.query(`
        SELECT c.*,
               CONCAT(p.nombre, ' ', p.apellido) AS paciente_nombre,
               CONCAT(m.nombre, ' ', m.apellido) AS medico_nombre
        FROM citas c
        INNER JOIN pacientes p ON c.paciente_id = p.id
        INNER JOIN medicos   m ON c.medico_id   = m.id
        WHERE c.fecha = CURDATE()
        ORDER BY c.hora ASC
    `);
    return resultado;
};

export const obtCitasPorMedico = async (medico_id) => {
    const [resultado] = await db.query(`
        SELECT c.*,
               CONCAT(p.nombre, ' ', p.apellido) AS paciente_nombre
        FROM citas c
        INNER JOIN pacientes p ON c.paciente_id = p.id
        WHERE c.medico_id = ?
        ORDER BY c.fecha DESC, c.hora ASC
    `, [medico_id]);
    return resultado;
};

export const inserta = async (cita) => {
    const { paciente_id, medico_id, fecha, hora, motivo, estado, notas } = cita;
    const [resultado] = await db.query(
        `INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, notas)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [paciente_id, medico_id, fecha, hora, motivo, estado || 'pendiente', notas]
    );
    return { id: resultado.insertId, ...cita };
};

export const actualiza = async (id, cita) => {
    const { paciente_id, medico_id, fecha, hora, motivo, estado, notas } = cita;
    await db.query(
        `UPDATE citas SET
         paciente_id = ?, medico_id = ?, fecha = ?, hora = ?,
         motivo = ?, estado = ?, notas = ?
         WHERE id = ?`,
        [paciente_id, medico_id, fecha, hora, motivo, estado, notas, id]
    );
    return { id, ...cita };
};

export const eliminaCita = async (id) => {
    await db.query('DELETE FROM citas WHERE id = ?', [id]);
    return id;
};

// --- Estadísticas ---
export const estadisticasPorMes = async () => {
    const [resultado] = await db.query(`
        SELECT DATE_FORMAT(fecha, '%Y-%m') AS mes, COUNT(*) AS total
        FROM citas
        GROUP BY mes
        ORDER BY mes ASC
        LIMIT 12
    `);
    return resultado;
};

export const estadisticasPorEstado = async () => {
    const [resultado] = await db.query(`
        SELECT estado, COUNT(*) AS total
        FROM citas
        GROUP BY estado
    `);
    return resultado;
};

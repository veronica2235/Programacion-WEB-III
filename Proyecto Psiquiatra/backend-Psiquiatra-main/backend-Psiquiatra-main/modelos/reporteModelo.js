import { db } from '../config/db.js';

export const obtPacientesActivos = async () => {
    const [resultado] = await db.query(`
        SELECT p.id, p.nombre, p.apellido, p.ci, p.fecha_nacimiento,
               p.genero, p.telefono, p.diagnostico_inicial,
               CONCAT(m.nombre, ' ', m.apellido) AS medico_asignado,
               p.created_at
        FROM pacientes p
        LEFT JOIN medicos m ON p.medico_id = m.id
        WHERE p.activo = 1
        ORDER BY p.apellido ASC
    `);
    return resultado;
};

export const obtCitasPorRango = async (fechaInicio, fechaFin) => {
    const [resultado] = await db.query(`
        SELECT c.id, c.fecha, c.hora, c.motivo, c.estado, c.notas,
               CONCAT(p.nombre, ' ', p.apellido) AS paciente,
               p.ci,
               CONCAT(m.nombre, ' ', m.apellido) AS medico,
               m.especialidad
        FROM citas c
        INNER JOIN pacientes p ON c.paciente_id = p.id
        INNER JOIN medicos   m ON c.medico_id   = m.id
        WHERE c.fecha BETWEEN ? AND ?
        ORDER BY c.fecha ASC, c.hora ASC
    `, [fechaInicio, fechaFin]);
    return resultado;
};

export const obtResumenEstadisticas = async () => {
    const [[{ total_pacientes }]] = await db.query(
        'SELECT COUNT(*) AS total_pacientes FROM pacientes WHERE activo = 1'
    );
    const [[{ total_citas_hoy }]] = await db.query(
        'SELECT COUNT(*) AS total_citas_hoy FROM citas WHERE fecha = CURDATE()'
    );
    const [[{ total_medicos }]] = await db.query(
        'SELECT COUNT(*) AS total_medicos FROM medicos WHERE activo = 1'
    );
    const [[{ citas_pendientes }]] = await db.query(
        "SELECT COUNT(*) AS citas_pendientes FROM citas WHERE estado = 'pendiente'"
    );

    return { total_pacientes, total_citas_hoy, total_medicos, citas_pendientes };
};

export const estadisticasDiagnosticos = async () => {
    const [resultado] = await db.query(`
        SELECT diagnostico_inicial AS diagnostico, COUNT(*) AS total
        FROM pacientes
        WHERE activo = 1 AND diagnostico_inicial IS NOT NULL AND diagnostico_inicial != ''
        GROUP BY diagnostico_inicial
        ORDER BY total DESC
        LIMIT 10
    `);
    return resultado;
};

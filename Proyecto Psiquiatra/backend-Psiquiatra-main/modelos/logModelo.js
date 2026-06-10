import { db } from '../config/db.js';

export const registraLog = async (datos) => {
    const { usuario_id, ip, evento, browser } = datos;
    const [resultado] = await db.query(
        'INSERT INTO log_acceso (usuario_id, ip, evento, browser) VALUES (?, ?, ?, ?)',
        [usuario_id, ip, evento, browser]
    );
    return resultado.insertId;
};

export const obtLogs = async () => {
    const [resultado] = await db.query(`
        SELECT l.id, u.nombre, u.email, l.ip, l.evento, l.browser, l.fecha_hora
        FROM log_acceso l
        INNER JOIN usuarios u ON l.usuario_id = u.id
        ORDER BY l.fecha_hora DESC
    `);
    return resultado;
};

export const obtLogsPorUsuario = async (usuario_id) => {
    const [resultado] = await db.query(`
        SELECT l.id, u.nombre, u.email, l.ip, l.evento, l.browser, l.fecha_hora
        FROM log_acceso l
        INNER JOIN usuarios u ON l.usuario_id = u.id
        WHERE l.usuario_id = ?
        ORDER BY l.fecha_hora DESC
    `, [usuario_id]);
    return resultado;
};

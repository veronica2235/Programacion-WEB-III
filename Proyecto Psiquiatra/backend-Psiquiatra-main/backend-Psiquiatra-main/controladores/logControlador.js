import { obtLogs, obtLogsPorUsuario } from '../modelos/logModelo.js';

export const muestraLogs = async (req, res) => {
    try {
        const resultado = await obtLogs();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const muestraLogsPorUsuario = async (req, res) => {
    try {
        const resultado = await obtLogsPorUsuario(req.params.usuarioId);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

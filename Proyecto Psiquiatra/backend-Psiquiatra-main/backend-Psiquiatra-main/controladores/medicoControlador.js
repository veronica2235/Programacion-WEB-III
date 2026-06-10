import {
    obtTodo, obtMedico, inserta, actualiza, eliminaLogico
} from '../modelos/medicoModelo.js';

export const muestraMedicos = async (req, res) => {
    try {
        const resultado = await obtTodo();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const muestraMedico = async (req, res) => {
    try {
        const resultado = await obtMedico(req.params.id);
        if (!resultado) {
            return res.status(404).json({ error: 'Médico no encontrado.' });
        }
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const insertaMedico = async (req, res) => {
    try {
        const resultado = await inserta(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizaMedico = async (req, res) => {
    try {
        const resultado = await actualiza(req.params.id, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminaMedico = async (req, res) => {
    try {
        await eliminaLogico(req.params.id);
        res.json({ message: 'Médico dado de baja correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

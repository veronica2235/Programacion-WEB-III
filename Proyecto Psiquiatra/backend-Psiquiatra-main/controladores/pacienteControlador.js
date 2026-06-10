import {
    obtTodo, obtTodoIncluyendoInactivos,
    obtPaciente, inserta, actualiza,
    eliminaLogico, reactiva
} from '../modelos/pacienteModelo.js';

export const muestraPacientes = async (req, res) => {
    try {
        const resultado = await obtTodo();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const muestraTodosPacientes = async (req, res) => {
    try {
        const resultado = await obtTodoIncluyendoInactivos();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const muestraPaciente = async (req, res) => {
    try {
        const resultado = await obtPaciente(req.params.id);
        if (!resultado) {
            return res.status(404).json({ error: 'Paciente no encontrado.' });
        }
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const insertaPaciente = async (req, res) => {
    try {
        const resultado = await inserta(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizaPaciente = async (req, res) => {
    try {
        const resultado = await actualiza(req.params.id, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminación lógica (activo = 0)
export const eliminaPaciente = async (req, res) => {
    try {
        await eliminaLogico(req.params.id);
        res.json({ message: 'Paciente dado de baja correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reactivar paciente dado de baja
export const reactivaPaciente = async (req, res) => {
    try {
        await reactiva(req.params.id);
        res.json({ message: 'Paciente reactivado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

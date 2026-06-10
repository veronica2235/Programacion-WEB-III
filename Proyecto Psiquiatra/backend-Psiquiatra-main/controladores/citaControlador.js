import {
    obtTodo, obtCita, obtCitasHoy, obtCitasPorMedico,
    inserta, actualiza, eliminaCita,
    estadisticasPorMes, estadisticasPorEstado
} from '../modelos/citaModelo.js';

export const muestraCitas = async (req, res) => {
    try {
        const resultado = await obtTodo();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const muestraCita = async (req, res) => {
    try {
        const resultado = await obtCita(req.params.id);
        if (!resultado) {
            return res.status(404).json({ error: 'Cita no encontrada.' });
        }
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const muestraCitasHoy = async (req, res) => {
    try {
        const resultado = await obtCitasHoy();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const muestraCitasPorMedico = async (req, res) => {
    try {
        const resultado = await obtCitasPorMedico(req.params.medicoId);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const insertaCita = async (req, res) => {
    try {
        const resultado = await inserta(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizaCita = async (req, res) => {
    try {
        const resultado = await actualiza(req.params.id, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminaUnaCita = async (req, res) => {
    try {
        await eliminaCita(req.params.id);
        res.json({ message: 'Cita eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const muestraEstadisticasMes = async (req, res) => {
    try {
        const resultado = await estadisticasPorMes();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const muestraEstadisticasEstado = async (req, res) => {
    try {
        const resultado = await estadisticasPorEstado();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

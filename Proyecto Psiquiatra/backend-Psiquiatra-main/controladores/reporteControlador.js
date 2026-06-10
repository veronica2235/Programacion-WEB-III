import {
    obtPacientesActivos, obtCitasPorRango,
    obtResumenEstadisticas, estadisticasDiagnosticos
} from '../modelos/reporteModelo.js';

export const reportePacientes = async (req, res) => {
    try {
        const resultado = await obtPacientesActivos();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const reporteCitas = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ error: 'Debe proporcionar fechaInicio y fechaFin.' });
        }
        const resultado = await obtCitasPorRango(fechaInicio, fechaFin);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const resumenEstadisticas = async (req, res) => {
    try {
        const resultado = await obtResumenEstadisticas();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const diagnosticosEstadisticas = async (req, res) => {
    try {
        const resultado = await estadisticasDiagnosticos();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

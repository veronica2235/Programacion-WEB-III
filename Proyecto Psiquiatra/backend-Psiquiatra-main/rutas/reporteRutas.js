import express from 'express';
import {
    reportePacientes, reporteCitas,
    resumenEstadisticas, diagnosticosEstadisticas
} from '../controladores/reporteControlador.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const rutas = express.Router();

rutas.get('/pacientes',      verificarToken, reportePacientes);
rutas.get('/citas',          verificarToken, reporteCitas);
rutas.get('/resumen',        verificarToken, resumenEstadisticas);
rutas.get('/diagnosticos',   verificarToken, diagnosticosEstadisticas);

export default rutas;

import express from 'express';
import { muestraLogs, muestraLogsPorUsuario } from '../controladores/logControlador.js';
import { verificarToken, soloAdmin } from '../middlewares/authMiddleware.js';

const rutas = express.Router();

rutas.get('/',                  verificarToken, soloAdmin, muestraLogs);
rutas.get('/:usuarioId',        verificarToken, soloAdmin, muestraLogsPorUsuario);

export default rutas;

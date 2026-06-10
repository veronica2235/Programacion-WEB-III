import express from 'express';
import { body } from 'express-validator';
import {
    muestraCitas, muestraCita, muestraCitasHoy, muestraCitasPorMedico,
    insertaCita, actualizaCita, eliminaUnaCita,
    muestraEstadisticasMes, muestraEstadisticasEstado
} from '../controladores/citaControlador.js';
import { verificarToken, adminORecepcionista } from '../middlewares/authMiddleware.js';
import { validarCampos } from '../middlewares/validarCampos.js';

const rutas = express.Router();

const validacionesCita = [
    body('paciente_id').isInt({ min: 1 }).withMessage('Paciente inválido.'),
    body('medico_id').isInt({ min: 1 }).withMessage('Médico inválido.'),
    body('fecha').isDate().withMessage('Fecha inválida.'),
    body('hora').matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('Hora inválida (HH:MM).'),
    body('motivo').notEmpty().withMessage('El motivo es requerido.')
                  .isLength({ max: 255 }).withMessage('Motivo máximo 255 caracteres.'),
    body('estado').optional().isIn(['pendiente','confirmada','cancelada','completada'])
                  .withMessage('Estado inválido.'),
    validarCampos
];

rutas.get('/',                          verificarToken, muestraCitas);
rutas.get('/hoy',                       verificarToken, muestraCitasHoy);
rutas.get('/estadisticas/mes',          verificarToken, muestraEstadisticasMes);
rutas.get('/estadisticas/estado',       verificarToken, muestraEstadisticasEstado);
rutas.get('/medico/:medicoId',          verificarToken, muestraCitasPorMedico);
rutas.get('/:id',                       verificarToken, muestraCita);
rutas.post('/',                         verificarToken, adminORecepcionista, validacionesCita, insertaCita);
rutas.put('/:id',                       verificarToken, adminORecepcionista, validacionesCita, actualizaCita);
rutas.delete('/:id',                    verificarToken, adminORecepcionista, eliminaUnaCita);

export default rutas;

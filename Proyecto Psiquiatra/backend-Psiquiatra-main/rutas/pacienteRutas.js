import express from 'express';
import { body } from 'express-validator';
import {
    muestraPacientes, muestraTodosPacientes, muestraPaciente,
    insertaPaciente, actualizaPaciente,
    eliminaPaciente, reactivaPaciente
} from '../controladores/pacienteControlador.js';
import { verificarToken, adminORecepcionista } from '../middlewares/authMiddleware.js';
import { validarCampos } from '../middlewares/validarCampos.js';

const rutas = express.Router();

const validacionesPaciente = [
    body('nombre').notEmpty().withMessage('El nombre es requerido.')
                  .isLength({ max: 100 }).withMessage('Nombre máximo 100 caracteres.'),
    body('apellido').notEmpty().withMessage('El apellido es requerido.'),
    body('ci').notEmpty().withMessage('El CI es requerido.'),
    body('fecha_nacimiento').isDate().withMessage('Fecha de nacimiento inválida.'),
    body('genero').isIn(['masculino','femenino','otro']).withMessage('Género inválido.'),
    body('telefono').optional().isMobilePhone('any').withMessage('Teléfono inválido.'),
    validarCampos
];

rutas.get('/',         verificarToken, muestraPacientes);
rutas.get('/todos',    verificarToken, adminORecepcionista, muestraTodosPacientes);
rutas.get('/:id',      verificarToken, muestraPaciente);
rutas.post('/',        verificarToken, adminORecepcionista, validacionesPaciente, insertaPaciente);
rutas.put('/:id',      verificarToken, adminORecepcionista, validacionesPaciente, actualizaPaciente);
rutas.delete('/:id',   verificarToken, adminORecepcionista, eliminaPaciente);
rutas.patch('/:id/reactivar', verificarToken, adminORecepcionista, reactivaPaciente);

export default rutas;

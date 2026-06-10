import express from 'express';
import { body } from 'express-validator';
import {
    muestraMedicos, muestraMedico,
    insertaMedico, actualizaMedico, eliminaMedico
} from '../controladores/medicoControlador.js';
import { verificarToken, soloAdmin } from '../middlewares/authMiddleware.js';
import { validarCampos } from '../middlewares/validarCampos.js';

const rutas = express.Router();

const validacionesMedico = [
    body('nombre').notEmpty().withMessage('El nombre es requerido.'),
    body('apellido').notEmpty().withMessage('El apellido es requerido.'),
    body('especialidad').notEmpty().withMessage('La especialidad es requerida.'),
    body('email').optional().isEmail().withMessage('Email inválido.'),
    validarCampos
];

rutas.get('/',       verificarToken, muestraMedicos);
rutas.get('/:id',    verificarToken, muestraMedico);
rutas.post('/',      verificarToken, soloAdmin, validacionesMedico, insertaMedico);
rutas.put('/:id',    verificarToken, soloAdmin, validacionesMedico, actualizaMedico);
rutas.delete('/:id', verificarToken, soloAdmin, eliminaMedico);

export default rutas;

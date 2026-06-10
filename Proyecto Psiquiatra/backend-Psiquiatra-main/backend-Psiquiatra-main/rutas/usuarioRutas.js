import express from 'express';
import { body } from 'express-validator';
import {
    muestraUsuarios, muestraUsuario,
    insertaUsuario, actualizaUsuario,
    cambiaPassword, eliminaUsuario
} from '../controladores/usuarioControlador.js';
import { verificarToken, soloAdmin } from '../middlewares/authMiddleware.js';
import { validarCampos } from '../middlewares/validarCampos.js';

const rutas = express.Router();

const validacionesUsuario = [
    body('nombre').notEmpty().withMessage('El nombre es requerido.'),
    body('email').isEmail().withMessage('Email inválido.'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres.')
        .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula.')
        .matches(/[0-9]/).withMessage('Debe contener al menos un número.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Debe contener al menos un carácter especial.'),
    body('rol').isIn(['admin','recepcionista','medico']).withMessage('Rol inválido.'),
    validarCampos
];

const validacionesPassword = [
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres.')
        .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula.')
        .matches(/[0-9]/).withMessage('Debe contener al menos un número.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Debe contener al menos un carácter especial.'),
    validarCampos
];

rutas.get('/',                   verificarToken, soloAdmin, muestraUsuarios);
rutas.get('/:id',                verificarToken, soloAdmin, muestraUsuario);
rutas.post('/',                  verificarToken, soloAdmin, validacionesUsuario, insertaUsuario);
rutas.put('/:id',                verificarToken, soloAdmin, actualizaUsuario);
rutas.patch('/:id/password',     verificarToken, soloAdmin, validacionesPassword, cambiaPassword);
rutas.delete('/:id',             verificarToken, soloAdmin, eliminaUsuario);

export default rutas;

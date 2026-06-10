import express from 'express';
import { body } from 'express-validator';
import { login, logout, perfil } from '../controladores/authControlador.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { validarCampos } from '../middlewares/validarCampos.js';

const rutas = express.Router();

rutas.post('/login',
    [
        body('email').isEmail().withMessage('Email inválido.'),
        body('password').notEmpty().withMessage('La contraseña es requerida.'),
        validarCampos
    ],
    login
);

rutas.post('/logout', verificarToken, logout);

rutas.get('/perfil', verificarToken, perfil);

export default rutas;

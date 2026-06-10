import bcrypt from 'bcryptjs';
import {
    obtTodo, obtUsuario, obtPorEmail,
    inserta, actualiza, actualizaPassword, eliminaLogico
} from '../modelos/usuarioModelo.js';

export const muestraUsuarios = async (req, res) => {
    try {
        const resultado = await obtTodo();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const muestraUsuario = async (req, res) => {
    try {
        const resultado = await obtUsuario(req.params.id);
        if (!resultado) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const insertaUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar email duplicado
        const existe = await obtPorEmail(email);
        if (existe) {
            return res.status(400).json({ error: 'El email ya está registrado.' });
        }

        // Encriptar contraseña
        const salt        = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const resultado = await inserta({ nombre, email, password: passwordHash, rol });
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizaUsuario = async (req, res) => {
    try {
        const resultado = await actualiza(req.params.id, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const cambiaPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const salt         = await bcrypt.genSalt(10);
        const passwordHash  = await bcrypt.hash(password, salt);
        await actualizaPassword(req.params.id, passwordHash);
        res.json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminaUsuario = async (req, res) => {
    try {
        await eliminaLogico(req.params.id);
        res.json({ message: 'Usuario desactivado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

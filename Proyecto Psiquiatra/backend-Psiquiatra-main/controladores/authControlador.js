import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { obtUsuarioPorEmail, obtUsuarioPorId } from '../modelos/authModelo.js';
import { registraLog } from '../modelos/logModelo.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar que el usuario exista
        const usuario = await obtUsuarioPorEmail(email);
        if (!usuario) {
            return res.status(401).json({ error: 'email inválidas.' });
        }

        // Verificar contraseña

        console.log("Usuario:", usuario.email);
console.log("Password recibida:", password);
console.log("Hash BD:", usuario.password);

const passwordValida = await bcrypt.compare(
    password,
    usuario.password
);



        // Generar JWT
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        // Registrar log de ingreso
        const ip      = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const browser = req.headers['user-agent'] || 'Desconocido';
        await registraLog({ usuario_id: usuario.id, ip, evento: 'ingreso', browser });

        res.json({
            token,
            usuario: {
                id:     usuario.id,
                nombre: usuario.nombre,
                email:  usuario.email,
                rol:    usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const ip      = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const browser = req.headers['user-agent'] || 'Desconocido';
        await registraLog({ usuario_id: req.usuario.id, ip, evento: 'salida', browser });

        res.json({ message: 'Sesión cerrada correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const perfil = async (req, res) => {
    try {
        const usuario = await obtUsuarioPorId(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

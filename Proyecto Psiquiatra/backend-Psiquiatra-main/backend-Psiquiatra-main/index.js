import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRutas      from './rutas/authRutas.js';
import pacienteRutas  from './rutas/pacienteRutas.js';
import citaRutas      from './rutas/citaRutas.js';
import medicoRutas    from './rutas/medicoRutas.js';
import usuarioRutas   from './rutas/usuarioRutas.js';
import reporteRutas   from './rutas/reporteRutas.js';
import logRutas       from './rutas/logRutas.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',      authRutas);
app.use('/api/pacientes', pacienteRutas);
app.use('/api/citas',     citaRutas);
app.use('/api/medicos',   medicoRutas);
app.use('/api/usuarios',  usuarioRutas);
app.use('/api/reportes',  reporteRutas);
app.use('/api/logs',      logRutas);

const puerto = process.env.PORT || 3001;
app.listen(puerto, () => {
    console.log(`Servidor MindCare en http://localhost:${puerto}`);
});

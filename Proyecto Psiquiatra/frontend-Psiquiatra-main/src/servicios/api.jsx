import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Interceptor: agrega el token JWT automáticamente a cada petición
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ==================== AUTH ====================
export const loginUsuario = async (credenciales) => {
    const respuesta = await axios.post(`${API_URL}/auth/login`, credenciales);
    return respuesta.data;
};

export const logoutUsuario = async () => {
    const respuesta = await axios.post(`${API_URL}/auth/logout`);
    return respuesta.data;
};

export const obtPerfil = async () => {
    const respuesta = await axios.get(`${API_URL}/auth/perfil`);
    return respuesta.data;
};

// ==================== PACIENTES ====================
export const obtPacientes = async () => {
    const respuesta = await axios.get(`${API_URL}/pacientes`);
    return respuesta.data;
};

export const obtTodosPacientes = async () => {
    const respuesta = await axios.get(`${API_URL}/pacientes/todos`);
    return respuesta.data;
};

export const obtPaciente = async (id) => {
    const respuesta = await axios.get(`${API_URL}/pacientes/${id}`);
    return respuesta.data;
};

export const insertaPaciente = async (paciente) => {
    const respuesta = await axios.post(`${API_URL}/pacientes`, paciente);
    return respuesta.data;
};

export const actualizaPaciente = async (id, paciente) => {
    const respuesta = await axios.put(`${API_URL}/pacientes/${id}`, paciente);
    return respuesta.data;
};

export const eliminaPaciente = async (id) => {
    const respuesta = await axios.delete(`${API_URL}/pacientes/${id}`);
    return respuesta.data;
};

export const reactivaPaciente = async (id) => {
    const respuesta = await axios.patch(`${API_URL}/pacientes/${id}/reactivar`);
    return respuesta.data;
};

// ==================== CITAS ====================
export const obtCitas = async () => {
    const respuesta = await axios.get(`${API_URL}/citas`);
    return respuesta.data;
};

export const obtCitasHoy = async () => {
    const respuesta = await axios.get(`${API_URL}/citas/hoy`);
    return respuesta.data;
};

export const obtCita = async (id) => {
    const respuesta = await axios.get(`${API_URL}/citas/${id}`);
    return respuesta.data;
};

export const insertaCita = async (cita) => {
    const respuesta = await axios.post(`${API_URL}/citas`, cita);
    return respuesta.data;
};

export const actualizaCita = async (id, cita) => {
    const respuesta = await axios.put(`${API_URL}/citas/${id}`, cita);
    return respuesta.data;
};

export const eliminaCita = async (id) => {
    const respuesta = await axios.delete(`${API_URL}/citas/${id}`);
    return respuesta.data;
};

export const obtEstadisticasMes = async () => {
    const respuesta = await axios.get(`${API_URL}/citas/estadisticas/mes`);
    return respuesta.data;
};

export const obtEstadisticasEstado = async () => {
    const respuesta = await axios.get(`${API_URL}/citas/estadisticas/estado`);
    return respuesta.data;
};

// ==================== MÉDICOS ====================
export const obtMedicos = async () => {
    const respuesta = await axios.get(`${API_URL}/medicos`);
    return respuesta.data;
};

export const obtMedico = async (id) => {
    const respuesta = await axios.get(`${API_URL}/medicos/${id}`);
    return respuesta.data;
};

export const insertaMedico = async (medico) => {
    const respuesta = await axios.post(`${API_URL}/medicos`, medico);
    return respuesta.data;
};

export const actualizaMedico = async (id, medico) => {
    const respuesta = await axios.put(`${API_URL}/medicos/${id}`, medico);
    return respuesta.data;
};

export const eliminaMedico = async (id) => {
    const respuesta = await axios.delete(`${API_URL}/medicos/${id}`);
    return respuesta.data;
};

// ==================== USUARIOS ====================
export const obtUsuarios = async () => {
    const respuesta = await axios.get(`${API_URL}/usuarios`);
    return respuesta.data;
};

export const obtUsuario = async (id) => {
    const respuesta = await axios.get(`${API_URL}/usuarios/${id}`);
    return respuesta.data;
};

export const insertaUsuario = async (usuario) => {
    const respuesta = await axios.post(`${API_URL}/usuarios`, usuario);
    return respuesta.data;
};

export const actualizaUsuario = async (id, usuario) => {
    const respuesta = await axios.put(`${API_URL}/usuarios/${id}`, usuario);
    return respuesta.data;
};

export const cambiaPassword = async (id, datos) => {
    const respuesta = await axios.patch(`${API_URL}/usuarios/${id}/password`, datos);
    return respuesta.data;
};

export const eliminaUsuario = async (id) => {
    const respuesta = await axios.delete(`${API_URL}/usuarios/${id}`);
    return respuesta.data;
};

// ==================== REPORTES ====================
export const obtReportePacientes = async () => {
    const respuesta = await axios.get(`${API_URL}/reportes/pacientes`);
    return respuesta.data;
};

export const obtReporteCitas = async (fechaInicio, fechaFin) => {
    const respuesta = await axios.get(`${API_URL}/reportes/citas`, {
        params: { fechaInicio, fechaFin }
    });
    return respuesta.data;
};

export const obtResumen = async () => {
    const respuesta = await axios.get(`${API_URL}/reportes/resumen`);
    return respuesta.data;
};

export const obtDiagnosticos = async () => {
    const respuesta = await axios.get(`${API_URL}/reportes/diagnosticos`);
    return respuesta.data;
};

// ==================== LOGS ====================
export const obtLogs = async () => {
    const respuesta = await axios.get(`${API_URL}/logs`);
    return respuesta.data;
};

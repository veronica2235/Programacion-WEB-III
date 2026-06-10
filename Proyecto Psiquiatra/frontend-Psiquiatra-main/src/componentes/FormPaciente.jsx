import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtPaciente, insertaPaciente, actualizaPaciente } from '../servicios/api.jsx';
import { obtMedicos } from '../servicios/api.jsx';

const VACIO = {
    nombre: '', apellido: '', ci: '', fecha_nacimiento: '',
    genero: '', telefono: '', direccion: '',
    contacto_emergencia: '', telefono_emergencia: '',
    diagnostico_inicial: '', medico_id: ''
};

function FormPaciente({ id, volver }) {
    const [paciente, setPaciente]   = useState(VACIO);
    const [medicos, setMedicos]     = useState([]);
    const [errores, setErrores]     = useState({});
    const [cargando, setCargando]   = useState(false);
    const esEdicion = !!id;

    useEffect(() => {
        obtMedicos().then(setMedicos).catch(() => {});
        if (esEdicion) {
            obtPaciente(id).then(datos => setPaciente(datos || VACIO)).catch(() => {});
        }
    }, [id]);

    function lee(e) {
        setPaciente({ ...paciente, [e.target.name]: e.target.value });
        setErrores({ ...errores, [e.target.name]: '' });
    }

    function valida() {
        const err = {};
        if (!paciente.nombre.trim())         err.nombre          = 'El nombre es requerido.';
        if (!paciente.apellido.trim())       err.apellido        = 'El apellido es requerido.';
        if (!paciente.ci.trim())             err.ci              = 'El CI es requerido.';
        if (!paciente.fecha_nacimiento)      err.fecha_nacimiento= 'La fecha de nacimiento es requerida.';
        if (!paciente.genero)                err.genero          = 'El género es requerido.';
        if (paciente.telefono && !/^\+?[\d\s\-()]{7,15}$/.test(paciente.telefono))
            err.telefono = 'Teléfono inválido.';
        setErrores(err);
        return Object.keys(err).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!valida()) return;
        setCargando(true);
        try {
            if (esEdicion) {
                await actualizaPaciente(id, paciente);
                Swal.fire({ title: 'Paciente actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
            } else {
                await insertaPaciente(paciente);
                Swal.fire({ title: 'Paciente registrado', icon: 'success', timer: 1500, showConfirmButton: false });
            }
            volver();
        } catch (error) {
            const msg = error?.response?.data?.error || 'Error al guardar el paciente.';
            Swal.fire('Error', msg, 'error');
        } finally {
            setCargando(false);
        }
    }

    return (
        <>
            <div className="topbar">
                <div>
                    <div className="topbar-titulo">{esEdicion ? 'Editar Paciente' : 'Nuevo Paciente'}</div>
                    <div className="topbar-sub">{esEdicion ? 'Modificar datos del paciente' : 'Registrar un nuevo paciente'}</div>
                </div>
                <button className="btn btn-gris" onClick={volver}>
                    <i className="fas fa-arrow-left" /> Volver
                </button>
            </div>

            <div className="caja-contenido">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="campo">
                            <label>Nombre *</label>
                            <input type="text" name="nombre" placeholder="Nombre" value={paciente.nombre} onChange={lee} className={errores.nombre ? 'error' : ''} />
                            {errores.nombre && <span className="mensaje-error">{errores.nombre}</span>}
                        </div>
                        <div className="campo">
                            <label>Apellido *</label>
                            <input type="text" name="apellido" placeholder="Apellido" value={paciente.apellido} onChange={lee} className={errores.apellido ? 'error' : ''} />
                            {errores.apellido && <span className="mensaje-error">{errores.apellido}</span>}
                        </div>
                        <div className="campo">
                            <label>CI *</label>
                            <input type="text" name="ci" placeholder="Carnet de identidad" value={paciente.ci} onChange={lee} className={errores.ci ? 'error' : ''} />
                            {errores.ci && <span className="mensaje-error">{errores.ci}</span>}
                        </div>
                        <div className="campo">
                            <label>Fecha de Nacimiento *</label>
                            <input type="date" name="fecha_nacimiento" value={paciente.fecha_nacimiento?.substring(0,10) || ''} onChange={lee} className={errores.fecha_nacimiento ? 'error' : ''} />
                            {errores.fecha_nacimiento && <span className="mensaje-error">{errores.fecha_nacimiento}</span>}
                        </div>
                        <div className="campo">
                            <label>Género *</label>
                            <select name="genero" value={paciente.genero} onChange={lee} className={errores.genero ? 'error' : ''}>
                                <option value="">Seleccionar...</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                            </select>
                            {errores.genero && <span className="mensaje-error">{errores.genero}</span>}
                        </div>
                        <div className="campo">
                            <label>Teléfono</label>
                            <input type="text" name="telefono" placeholder="Ej. 70000000" value={paciente.telefono || ''} onChange={lee} className={errores.telefono ? 'error' : ''} />
                            {errores.telefono && <span className="mensaje-error">{errores.telefono}</span>}
                        </div>
                        <div className="campo span-2">
                            <label>Dirección</label>
                            <input type="text" name="direccion" placeholder="Dirección del paciente" value={paciente.direccion || ''} onChange={lee} />
                        </div>
                        <div className="campo">
                            <label>Contacto de Emergencia</label>
                            <input type="text" name="contacto_emergencia" placeholder="Nombre del contacto" value={paciente.contacto_emergencia || ''} onChange={lee} />
                        </div>
                        <div className="campo">
                            <label>Teléfono de Emergencia</label>
                            <input type="text" name="telefono_emergencia" placeholder="Teléfono" value={paciente.telefono_emergencia || ''} onChange={lee} />
                        </div>
                        <div className="campo">
                            <label>Médico Asignado</label>
                            <select name="medico_id" value={paciente.medico_id || ''} onChange={lee}>
                                <option value="">Sin asignar</option>
                                {medicos.map(m => (
                                    <option key={m.id} value={m.id}>{m.nombre} {m.apellido} — {m.especialidad}</option>
                                ))}
                            </select>
                        </div>
                        <div className="campo span-2">
                            <label>Diagnóstico Inicial</label>
                            <textarea name="diagnostico_inicial" placeholder="Descripción del diagnóstico inicial..." value={paciente.diagnostico_inicial || ''} onChange={lee} />
                        </div>
                    </div>

                    <div className="form-acciones">
                        <button type="button" className="btn btn-gris" onClick={volver}>
                            <i className="fas fa-times" /> Cancelar
                        </button>
                        <button type="submit" className="btn btn-verde" disabled={cargando}>
                            {cargando
                                ? <><i className="fas fa-spinner fa-spin" /> Guardando...</>
                                : <><i className="fas fa-save" /> {esEdicion ? 'Actualizar' : 'Registrar Paciente'}</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default FormPaciente;

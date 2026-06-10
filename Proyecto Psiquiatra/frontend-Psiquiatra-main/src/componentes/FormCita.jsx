import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtCita, insertaCita, actualizaCita } from '../servicios/api.jsx';
import { obtPacientes, obtMedicos } from '../servicios/api.jsx';

const VACIO = {
    paciente_id: '', medico_id: '', fecha: '',
    hora: '', motivo: '', estado: 'pendiente', notas: ''
};

function FormCita({ id, volver }) {
    const [cita, setCita]       = useState(VACIO);
    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const esEdicion = !!id;

    useEffect(() => {
        obtPacientes().then(setPacientes).catch(() => {});
        obtMedicos().then(setMedicos).catch(() => {});
        if (esEdicion) {
            obtCita(id).then(datos => {
                if (datos) {
                    setCita({
                        ...datos,
                        fecha: datos.fecha?.substring(0, 10) || '',
                        hora:  datos.hora?.substring(0, 5)   || '',
                    });
                }
            }).catch(() => {});
        }
    }, [id]);

    function lee(e) {
        setCita({ ...cita, [e.target.name]: e.target.value });
        setErrores({ ...errores, [e.target.name]: '' });
    }

    function valida() {
        const err = {};
        if (!cita.paciente_id)  err.paciente_id = 'Seleccione un paciente.';
        if (!cita.medico_id)    err.medico_id   = 'Seleccione un médico.';
        if (!cita.fecha)        err.fecha       = 'La fecha es requerida.';
        if (!cita.hora)         err.hora        = 'La hora es requerida.';
        if (!cita.motivo.trim()) err.motivo     = 'El motivo es requerido.';
        setErrores(err);
        return Object.keys(err).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!valida()) return;
        setCargando(true);
        try {
            if (esEdicion) {
                await actualizaCita(id, cita);
                Swal.fire({ title: 'Cita actualizada', icon: 'success', timer: 1500, showConfirmButton: false });
            } else {
                await insertaCita(cita);
                Swal.fire({ title: 'Cita registrada', icon: 'success', timer: 1500, showConfirmButton: false });
            }
            volver();
        } catch (error) {
            const msg = error?.response?.data?.error || 'Error al guardar la cita.';
            Swal.fire('Error', msg, 'error');
        } finally {
            setCargando(false);
        }
    }

    return (
        <>
            <div className="topbar">
                <div>
                    <div className="topbar-titulo">{esEdicion ? 'Editar Cita' : 'Nueva Cita'}</div>
                    <div className="topbar-sub">{esEdicion ? 'Modificar datos de la cita' : 'Registrar nueva cita médica'}</div>
                </div>
                <button className="btn btn-gris" onClick={volver}>
                    <i className="fas fa-arrow-left" /> Volver
                </button>
            </div>

            <div className="caja-contenido">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="campo">
                            <label>Paciente *</label>
                            <select name="paciente_id" value={cita.paciente_id} onChange={lee} className={errores.paciente_id ? 'error' : ''}>
                                <option value="">Seleccionar paciente...</option>
                                {pacientes.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre} {p.apellido} — CI: {p.ci}</option>
                                ))}
                            </select>
                            {errores.paciente_id && <span className="mensaje-error">{errores.paciente_id}</span>}
                        </div>
                        <div className="campo">
                            <label>Médico *</label>
                            <select name="medico_id" value={cita.medico_id} onChange={lee} className={errores.medico_id ? 'error' : ''}>
                                <option value="">Seleccionar médico...</option>
                                {medicos.map(m => (
                                    <option key={m.id} value={m.id}>{m.nombre} {m.apellido} — {m.especialidad}</option>
                                ))}
                            </select>
                            {errores.medico_id && <span className="mensaje-error">{errores.medico_id}</span>}
                        </div>
                        <div className="campo">
                            <label>Fecha *</label>
                            <input type="date" name="fecha" value={cita.fecha} onChange={lee} className={errores.fecha ? 'error' : ''} />
                            {errores.fecha && <span className="mensaje-error">{errores.fecha}</span>}
                        </div>
                        <div className="campo">
                            <label>Hora *</label>
                            <input type="time" name="hora" value={cita.hora} onChange={lee} className={errores.hora ? 'error' : ''} />
                            {errores.hora && <span className="mensaje-error">{errores.hora}</span>}
                        </div>
                        <div className="campo span-2">
                            <label>Motivo *</label>
                            <input type="text" name="motivo" placeholder="Motivo de la cita..." value={cita.motivo} onChange={lee} className={errores.motivo ? 'error' : ''} />
                            {errores.motivo && <span className="mensaje-error">{errores.motivo}</span>}
                        </div>
                        <div className="campo">
                            <label>Estado</label>
                            <select name="estado" value={cita.estado} onChange={lee}>
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmada">Confirmada</option>
                                <option value="cancelada">Cancelada</option>
                                <option value="completada">Completada</option>
                            </select>
                        </div>
                        <div className="campo span-2">
                            <label>Notas adicionales</label>
                            <textarea name="notas" placeholder="Observaciones o notas adicionales..." value={cita.notas || ''} onChange={lee} />
                        </div>
                    </div>

                    <div className="form-acciones">
                        <button type="button" className="btn btn-gris" onClick={volver}>
                            <i className="fas fa-times" /> Cancelar
                        </button>
                        <button type="submit" className="btn btn-verde" disabled={cargando}>
                            {cargando
                                ? <><i className="fas fa-spinner fa-spin" /> Guardando...</>
                                : <><i className="fas fa-save" /> {esEdicion ? 'Actualizar Cita' : 'Registrar Cita'}</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default FormCita;

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtMedicos, obtMedico, insertaMedico, actualizaMedico, eliminaMedico } from '../servicios/api.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const VACIO = { nombre: '', apellido: '', especialidad: '', telefono: '', email: '' };

function Medicos() {
    const { usuario } = useAuth();
    const [medicos, setMedicos]         = useState([]);
    const [cargando, setCargando]       = useState(true);
    const [modal, setModal]             = useState(false);
    const [medico, setMedico]           = useState(VACIO);
    const [idEditar, setIdEditar]       = useState(null);
    const [errores, setErrores]         = useState({});
    const [guardando, setGuardando]     = useState(false);

    const esAdmin = usuario?.rol === 'admin';

    async function consulta() {
        setCargando(true);
        try { const datos = await obtMedicos(); setMedicos(datos); } catch (_) {}
        setCargando(false);
    }

    useEffect(() => { consulta(); }, []);

    function abrirNuevo() {
        setMedico(VACIO);
        setIdEditar(null);
        setErrores({});
        setModal(true);
    }

    async function abrirEditar(id) {
        try {
            const datos = await obtMedico(id);
            setMedico(datos || VACIO);
            setIdEditar(id);
            setErrores({});
            setModal(true);
        } catch (_) {}
    }

    function lee(e) {
        setMedico({ ...medico, [e.target.name]: e.target.value });
        setErrores({ ...errores, [e.target.name]: '' });
    }

    function valida() {
        const err = {};
        if (!medico.nombre.trim())       err.nombre       = 'El nombre es requerido.';
        if (!medico.apellido.trim())     err.apellido     = 'El apellido es requerido.';
        if (!medico.especialidad.trim()) err.especialidad = 'La especialidad es requerida.';
        if (medico.email && !/\S+@\S+\.\S+/.test(medico.email)) err.email = 'Email inválido.';
        setErrores(err);
        return Object.keys(err).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!valida()) return;
        setGuardando(true);
        try {
            if (idEditar) {
                await actualizaMedico(idEditar, medico);
                Swal.fire({ title: 'Médico actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
            } else {
                await insertaMedico(medico);
                Swal.fire({ title: 'Médico registrado', icon: 'success', timer: 1500, showConfirmButton: false });
            }
            setModal(false);
            consulta();
        } catch (error) {
            Swal.fire('Error', error?.response?.data?.error || 'Error al guardar.', 'error');
        } finally {
            setGuardando(false);
        }
    }

    async function handleElimina(id) {
        const result = await Swal.fire({
            title: '¿Dar de baja al médico?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#c0392b',
        });
        if (!result.isConfirmed) return;
        try {
            await eliminaMedico(id);
            Swal.fire({ title: 'Médico dado de baja', icon: 'success', timer: 1500, showConfirmButton: false });
            consulta();
        } catch (_) { Swal.fire('Error', 'No se pudo dar de baja al médico.', 'error'); }
    }

    return (
        <>
            <div className="topbar">
                <div>
                    <div className="topbar-titulo">Médicos</div>
                    <div className="topbar-sub">Gestión del personal médico</div>
                </div>
                {esAdmin && (
                    <button className="btn btn-verde" onClick={abrirNuevo}>
                        <i className="fas fa-user-plus" /> Nuevo Médico
                    </button>
                )}
            </div>

            <div className="caja-contenido">
                {cargando ? <div className="spinner" /> : (
                    medicos.length === 0 ? (
                        <div className="sin-datos">
                            <i className="fas fa-user-md" />
                            <p>No hay médicos registrados.</p>
                        </div>
                    ) : (
                        <div className="tabla-contenedor">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Especialidad</th>
                                        <th>Teléfono</th>
                                        <th>Email</th>
                                        {esAdmin && <th>Acciones</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicos.map(m => (
                                        <tr key={m.id}>
                                            <td>{m.id}</td>
                                            <td><strong>{m.nombre} {m.apellido}</strong></td>
                                            <td>{m.especialidad}</td>
                                            <td>{m.telefono || '—'}</td>
                                            <td>{m.email || '—'}</td>
                                            {esAdmin && (
                                                <td>
                                                    <button className="btn btn-primario btn-sm"
                                                        onClick={() => abrirEditar(m.id)}
                                                        style={{ marginRight: '0.8rem' }}>
                                                        <i className="fas fa-edit" /> Editar
                                                    </button>
                                                    <button className="btn btn-rojo btn-sm"
                                                        onClick={() => handleElimina(m.id)}>
                                                        <i className="fas fa-user-minus" /> Baja
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{idEditar ? 'Editar Médico' : 'Nuevo Médico'}</h2>
                            <button className="modal-cerrar" onClick={() => setModal(false)}>
                                <i className="fas fa-times" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="campo">
                                    <label>Nombre *</label>
                                    <input type="text" name="nombre" value={medico.nombre} onChange={lee} className={errores.nombre ? 'error' : ''} />
                                    {errores.nombre && <span className="mensaje-error">{errores.nombre}</span>}
                                </div>
                                <div className="campo">
                                    <label>Apellido *</label>
                                    <input type="text" name="apellido" value={medico.apellido} onChange={lee} className={errores.apellido ? 'error' : ''} />
                                    {errores.apellido && <span className="mensaje-error">{errores.apellido}</span>}
                                </div>
                                <div className="campo span-2">
                                    <label>Especialidad *</label>
                                    <input type="text" name="especialidad" placeholder="Ej. Psiquiatría, Neurología..." value={medico.especialidad} onChange={lee} className={errores.especialidad ? 'error' : ''} />
                                    {errores.especialidad && <span className="mensaje-error">{errores.especialidad}</span>}
                                </div>
                                <div className="campo">
                                    <label>Teléfono</label>
                                    <input type="text" name="telefono" value={medico.telefono || ''} onChange={lee} />
                                </div>
                                <div className="campo">
                                    <label>Email</label>
                                    <input type="email" name="email" value={medico.email || ''} onChange={lee} className={errores.email ? 'error' : ''} />
                                    {errores.email && <span className="mensaje-error">{errores.email}</span>}
                                </div>
                            </div>
                            <div className="form-acciones">
                                <button type="button" className="btn btn-gris" onClick={() => setModal(false)}>
                                    <i className="fas fa-times" /> Cancelar
                                </button>
                                <button type="submit" className="btn btn-verde" disabled={guardando}>
                                    {guardando
                                        ? <><i className="fas fa-spinner fa-spin" /> Guardando...</>
                                        : <><i className="fas fa-save" /> {idEditar ? 'Actualizar' : 'Registrar'}</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Medicos;

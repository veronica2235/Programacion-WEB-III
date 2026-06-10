import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtCitas, eliminaCita } from '../servicios/api.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import FormCita from './FormCita.jsx';

function Citas() {
    const { usuario } = useAuth();
    const [citas, setCitas]               = useState([]);
    const [cargando, setCargando]         = useState(true);
    const [verFormulario, setVerFormulario] = useState(false);
    const [idEditar, setIdEditar]         = useState(null);
    const [busqueda, setBusqueda]         = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    const esAdminORecep = ['admin', 'recepcionista'].includes(usuario?.rol);

    async function consulta() {
        setCargando(true);
        try { const datos = await obtCitas(); setCitas(datos); } catch (_) {}
        setCargando(false);
    }

    useEffect(() => { consulta(); }, []);

    async function handleElimina(id) {
        const result = await Swal.fire({
            title: '¿Eliminar cita?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#c0392b',
        });
        if (!result.isConfirmed) return;
        try {
            await eliminaCita(id);
            Swal.fire({ title: 'Cita eliminada', icon: 'success', timer: 1500, showConfirmButton: false });
            consulta();
        } catch (_) { Swal.fire('Error', 'No se pudo eliminar la cita.', 'error'); }
    }

    const citasFiltradas = citas.filter(c => {
        const texto = `${c.paciente_nombre} ${c.medico_nombre} ${c.motivo}`.toLowerCase();
        const coincideTexto  = texto.includes(busqueda.toLowerCase());
        const coincideEstado = filtroEstado ? c.estado === filtroEstado : true;
        return coincideTexto && coincideEstado;
    });

    if (verFormulario) {
        return (
            <FormCita
                id={idEditar}
                volver={() => { setVerFormulario(false); setIdEditar(null); consulta(); }}
            />
        );
    }

    return (
        <>
            <div className="topbar">
                <div>
                    <div className="topbar-titulo">Citas / Reservas</div>
                    <div className="topbar-sub">Gestión de citas médicas</div>
                </div>
                {esAdminORecep && (
                    <button className="btn btn-verde" onClick={() => { setIdEditar(null); setVerFormulario(true); }}>
                        <i className="fas fa-calendar-plus" /> Nueva Cita
                    </button>
                )}
            </div>

            <div className="caja-contenido">
                <div className="acciones-top">
                    <input
                        type="text"
                        placeholder="Buscar por paciente, médico o motivo..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        style={{ padding: '1rem 1.5rem', border: '2px solid var(--grisMedio)', borderRadius: '6px', fontSize: '1.4rem', width: '320px' }}
                    />
                    <select
                        value={filtroEstado}
                        onChange={e => setFiltroEstado(e.target.value)}
                        style={{ padding: '1rem 1.5rem', border: '2px solid var(--grisMedio)', borderRadius: '6px', fontSize: '1.4rem' }}
                    >
                        <option value="">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="completada">Completada</option>
                    </select>
                </div>

                {cargando ? <div className="spinner" /> : (
                    citasFiltradas.length === 0 ? (
                        <div className="sin-datos">
                            <i className="fas fa-calendar-times" />
                            <p>No se encontraron citas.</p>
                        </div>
                    ) : (
                        <div className="tabla-contenedor">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Paciente</th>
                                        <th>Médico</th>
                                        <th>Motivo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {citasFiltradas.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{new Date(c.fecha).toLocaleDateString('es-BO')}</td>
                                            <td><strong>{c.hora?.substring(0,5)}</strong></td>
                                            <td>{c.paciente_nombre}</td>
                                            <td>{c.medico_nombre}</td>
                                            <td>{c.motivo}</td>
                                            <td><span className={`badge badge-${c.estado}`}>{c.estado}</span></td>
                                            <td>
                                                {esAdminORecep && (
                                                    <>
                                                        <button className="btn btn-primario btn-sm"
                                                            onClick={() => { setIdEditar(c.id); setVerFormulario(true); }}
                                                            style={{ marginRight: '0.8rem' }}>
                                                            <i className="fas fa-edit" /> Editar
                                                        </button>
                                                        <button className="btn btn-rojo btn-sm"
                                                            onClick={() => handleElimina(c.id)}>
                                                            <i className="fas fa-trash" /> Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </>
    );
}

export default Citas;

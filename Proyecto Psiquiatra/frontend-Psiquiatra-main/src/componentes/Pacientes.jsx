import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    obtPacientes, obtTodosPacientes,
    eliminaPaciente, reactivaPaciente
} from '../servicios/api.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import FormPaciente from './FormPaciente.jsx';

function Pacientes() {
    const { usuario } = useAuth();
    const [pacientes, setPacientes]         = useState([]);
    const [cargando, setCargando]           = useState(true);
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [verFormulario, setVerFormulario] = useState(false);
    const [idEditar, setIdEditar]           = useState(null);
    const [busqueda, setBusqueda]           = useState('');

    const esAdminORecep = ['admin', 'recepcionista'].includes(usuario?.rol);

    async function consulta(conInactivos = false) {
        setCargando(true);
        try {
            const datos = conInactivos ? await obtTodosPacientes() : await obtPacientes();
            setPacientes(datos);
        } catch (_) {}
        setCargando(false);
    }

    useEffect(() => { consulta(mostrarInactivos); }, [mostrarInactivos]);

    async function handleElimina(id) {
        const result = await Swal.fire({
            title: '¿Dar de baja al paciente?',
            text: 'El paciente será marcado como inactivo (eliminación lógica).',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#c0392b',
        });
        if (!result.isConfirmed) return;
        try {
            await eliminaPaciente(id);
            Swal.fire({ title: 'Dado de baja', icon: 'success', timer: 1500, showConfirmButton: false });
            consulta(mostrarInactivos);
        } catch (_) {
            Swal.fire('Error', 'No se pudo dar de baja al paciente.', 'error');
        }
    }

    async function handleReactiva(id) {
        try {
            await reactivaPaciente(id);
            Swal.fire({ title: 'Paciente reactivado', icon: 'success', timer: 1500, showConfirmButton: false });
            consulta(mostrarInactivos);
        } catch (_) {
            Swal.fire('Error', 'No se pudo reactivar al paciente.', 'error');
        }
    }

    const pacientesFiltrados = pacientes.filter(p =>
        `${p.nombre} ${p.apellido} ${p.ci}`.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (verFormulario) {
        return (
            <FormPaciente
                id={idEditar}
                volver={() => { setVerFormulario(false); setIdEditar(null); consulta(mostrarInactivos); }}
            />
        );
    }

    return (
        <>
            <div className="topbar">
                <div>
                    <div className="topbar-titulo">Pacientes</div>
                    <div className="topbar-sub">Gestión de pacientes del centro</div>
                </div>
                {esAdminORecep && (
                    <button className="btn btn-verde" onClick={() => { setIdEditar(null); setVerFormulario(true); }}>
                        <i className="fas fa-user-plus" /> Nuevo Paciente
                    </button>
                )}
            </div>

            <div className="caja-contenido">
                <div className="acciones-top">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o CI..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        style={{ padding: '1rem 1.5rem', border: '2px solid var(--grisMedio)', borderRadius: '6px', fontSize: '1.4rem', width: '300px' }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.4rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={mostrarInactivos}
                            onChange={e => setMostrarInactivos(e.target.checked)}
                        />
                        Mostrar dados de baja
                    </label>
                </div>

                {cargando ? <div className="spinner" /> : (
                    pacientesFiltrados.length === 0 ? (
                        <div className="sin-datos">
                            <i className="fas fa-user-slash" />
                            <p>No se encontraron pacientes.</p>
                        </div>
                    ) : (
                        <div className="tabla-contenedor">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre completo</th>
                                        <th>CI</th>
                                        <th>Género</th>
                                        <th>Teléfono</th>
                                        <th>Médico asignado</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pacientesFiltrados.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td><strong>{p.nombre} {p.apellido}</strong></td>
                                            <td>{p.ci}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{p.genero}</td>
                                            <td>{p.telefono || '—'}</td>
                                            <td>{p.medico_nombre || '—'}</td>
                                            <td>
                                                <span className={`badge badge-${p.activo ? 'activo' : 'inactivo'}`}>
                                                    {p.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td>
                                                {esAdminORecep && (
                                                    <>
                                                        <button className="btn btn-primario btn-sm"
                                                            onClick={() => { setIdEditar(p.id); setVerFormulario(true); }}
                                                            style={{ marginRight: '0.8rem' }}>
                                                            <i className="fas fa-edit" /> Editar
                                                        </button>
                                                        {p.activo ? (
                                                            <button className="btn btn-rojo btn-sm"
                                                                onClick={() => handleElimina(p.id)}>
                                                                <i className="fas fa-user-minus" /> Baja
                                                            </button>
                                                        ) : (
                                                            <button className="btn btn-verde btn-sm"
                                                                onClick={() => handleReactiva(p.id)}>
                                                                <i className="fas fa-user-check" /> Reactivar
                                                            </button>
                                                        )}
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

export default Pacientes;

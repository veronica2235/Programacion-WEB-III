import { useAuth } from '../context/AuthContext.jsx';
import Swal from 'sweetalert2';

function Sidebar({ paginaActual, setPagina }) {
    const { usuario, logout } = useAuth();

    async function handleLogout() {
        const result = await Swal.fire({
            title: '¿Cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#c0392b',
        });
        if (result.isConfirmed) logout();
    }

    const esAdmin = usuario?.rol === 'admin';
    const esAdminORecep = ['admin', 'recepcionista'].includes(usuario?.rol);

    const iniciales = usuario?.nombre
        ?.split(' ')
        .map(p => p[0])
        .slice(0, 2)
        .join('') || 'U';

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h1>Hendorfin</h1>
                <span>Centro Psiquiátrico</span>
            </div>

            <nav className="sidebar-nav">
                <span className="nav-seccion">Principal</span>

                <button
                    className={`nav-link ${paginaActual === 'dashboard' ? 'activo' : ''}`}
                    onClick={() => setPagina('dashboard')}
                >
                    <i className="fas fa-th-large" /> Dashboard
                </button>

                <span className="nav-seccion">Gestión</span>

                <button
                    className={`nav-link ${paginaActual === 'pacientes' ? 'activo' : ''}`}
                    onClick={() => setPagina('pacientes')}
                >
                    <i className="fas fa-user-injured" /> Pacientes
                </button>

                <button
                    className={`nav-link ${paginaActual === 'citas' ? 'activo' : ''}`}
                    onClick={() => setPagina('citas')}
                >
                    <i className="fas fa-calendar-check" /> Citas / Reservas
                </button>

                <button
                    className={`nav-link ${paginaActual === 'medicos' ? 'activo' : ''}`}
                    onClick={() => setPagina('medicos')}
                >
                    <i className="fas fa-user-md" /> Médicos
                </button>

                <span className="nav-seccion">Análisis</span>

                <button
                    className={`nav-link ${paginaActual === 'estadisticas' ? 'activo' : ''}`}
                    onClick={() => setPagina('estadisticas')}
                >
                    <i className="fas fa-chart-bar" /> Estadísticas
                </button>

                <button
                    className={`nav-link ${paginaActual === 'reportes' ? 'activo' : ''}`}
                    onClick={() => setPagina('reportes')}
                >
                    <i className="fas fa-file-pdf" /> Reportes PDF
                </button>

                {esAdmin && (
                    <>
                        <span className="nav-seccion">Administración</span>
                        <button
                            className={`nav-link ${paginaActual === 'usuarios' ? 'activo' : ''}`}
                            onClick={() => setPagina('usuarios')}
                        >
                            <i className="fas fa-users-cog" /> Usuarios
                        </button>
                        <button
                            className={`nav-link ${paginaActual === 'logs' ? 'activo' : ''}`}
                            onClick={() => setPagina('logs')}
                        >
                            <i className="fas fa-clipboard-list" /> Log de Acceso
                        </button>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <div className="usuario-info">
                    <div className="usuario-avatar">{iniciales}</div>
                    <div className="usuario-datos">
                        <div className="usuario-nombre">{usuario?.nombre}</div>
                        <div className="usuario-rol">{usuario?.rol}</div>
                    </div>
                </div>
                <button className="btn btn-rojo btn-bloque btn-sm" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt" /> Cerrar sesión
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;

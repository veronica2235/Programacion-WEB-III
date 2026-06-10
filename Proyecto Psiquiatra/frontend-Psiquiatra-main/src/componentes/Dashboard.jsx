import { useState, useEffect } from 'react';
import { obtResumen, obtCitasHoy } from '../servicios/api.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Dashboard() {
    const { usuario } = useAuth();
    const [resumen, setResumen]   = useState(null);
    const [citasHoy, setCitasHoy] = useState([]);
    const [cargando, setCargando] = useState(true);

    async function cargarDatos() {
        try {
            const [res, citas] = await Promise.all([obtResumen(), obtCitasHoy()]);
            setResumen(res);
            setCitasHoy(citas);
        } catch (_) {}
        setCargando(false);
    }

    useEffect(() => { cargarDatos(); }, []);

    if (cargando) return <div className="spinner" />;

    const hora = new Date().getHours();
    const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

    return (
        <>
            <div className="topbar">
                <div>
                    <div className="topbar-titulo">{saludo}, {usuario?.nombre?.split(' ')[0]} 👋</div>
                    <div className="topbar-sub">Panel de control — {new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
            </div>

            {/* Cards resumen */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icono azul"><i className="fas fa-user-injured" /></div>
                    <div>
                        <div className="stat-numero">{resumen?.total_pacientes ?? 0}</div>
                        <div className="stat-label">Pacientes Activos</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icono acento"><i className="fas fa-calendar-day" /></div>
                    <div>
                        <div className="stat-numero">{resumen?.total_citas_hoy ?? 0}</div>
                        <div className="stat-label">Citas Hoy</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icono verde"><i className="fas fa-user-md" /></div>
                    <div>
                        <div className="stat-numero">{resumen?.total_medicos ?? 0}</div>
                        <div className="stat-label">Médicos Activos</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icono naranja"><i className="fas fa-clock" /></div>
                    <div>
                        <div className="stat-numero">{resumen?.citas_pendientes ?? 0}</div>
                        <div className="stat-label">Citas Pendientes</div>
                    </div>
                </div>
            </div>

            {/* Citas de hoy */}
            <div className="caja-contenido">
                <h2><i className="fas fa-calendar-check" style={{ marginRight: '1rem', color: 'var(--acento)' }} />Citas de Hoy</h2>
                {citasHoy.length === 0 ? (
                    <div className="sin-datos">
                        <i className="fas fa-calendar-times" />
                        <p>No hay citas programadas para hoy.</p>
                    </div>
                ) : (
                    <div className="tabla-contenedor">
                        <table>
                            <thead>
                                <tr>
                                    <th>Hora</th>
                                    <th>Paciente</th>
                                    <th>Médico</th>
                                    <th>Motivo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {citasHoy.map(cita => (
                                    <tr key={cita.id}>
                                        <td><strong>{cita.hora?.substring(0,5)}</strong></td>
                                        <td>{cita.paciente_nombre}</td>
                                        <td>{cita.medico_nombre}</td>
                                        <td>{cita.motivo}</td>
                                        <td><span className={`badge badge-${cita.estado}`}>{cita.estado}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

export default Dashboard;

import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { obtEstadisticasMes, obtEstadisticasEstado, obtDiagnosticos, obtResumen } from '../servicios/api.jsx';

const COLORES_PIE = ['#f39c12', '#1e8449', '#c0392b', '#3dbeac'];
const COLORES_DIAG = ['#1a3c5e','#2a5fa0','#3dbeac','#1e8449','#f39c12','#e67e22','#c0392b','#8e44ad','#2980b9','#16a085'];

function Estadisticas() {
    const [porMes, setPorMes]           = useState([]);
    const [porEstado, setPorEstado]     = useState([]);
    const [diagnosticos, setDiagnosticos] = useState([]);
    const [resumen, setResumen]         = useState(null);
    const [cargando, setCargando]       = useState(true);

    useEffect(() => {
        Promise.all([
            obtEstadisticasMes(),
            obtEstadisticasEstado(),
            obtDiagnosticos(),
            obtResumen()
        ]).then(([mes, estado, diag, res]) => {
            setPorMes(mes.map(d => ({ mes: d.mes, Citas: Number(d.total) })));
            setPorEstado(estado.map(d => ({ name: d.estado, value: Number(d.total) })));
            setDiagnosticos(diag.map(d => ({ diagnostico: d.diagnostico?.substring(0, 20) || 'Sin diagnóstico', total: Number(d.total) })));
            setResumen(res);
        }).catch(() => {}).finally(() => setCargando(false));
    }, []);

    if (cargando) return <div className="spinner" />;

    return (
        <>
            <div className="topbar">
                <div>
                    <div className="topbar-titulo">Estadísticas</div>
                    <div className="topbar-sub">Análisis y métricas del centro</div>
                </div>
            </div>

            {/* Cards resumen */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icono azul"><i className="fas fa-user-injured" /></div>
                    <div><div className="stat-numero">{resumen?.total_pacientes ?? 0}</div><div className="stat-label">Pacientes Activos</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icono acento"><i className="fas fa-calendar-day" /></div>
                    <div><div className="stat-numero">{resumen?.total_citas_hoy ?? 0}</div><div className="stat-label">Citas Hoy</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icono verde"><i className="fas fa-user-md" /></div>
                    <div><div className="stat-numero">{resumen?.total_medicos ?? 0}</div><div className="stat-label">Médicos Activos</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icono naranja"><i className="fas fa-clock" /></div>
                    <div><div className="stat-numero">{resumen?.citas_pendientes ?? 0}</div><div className="stat-label">Citas Pendientes</div></div>
                </div>
            </div>

            <div className="graficos-grid">
                {/* Citas por mes */}
                <div className="grafico-card">
                    <div className="grafico-titulo"><i className="fas fa-chart-line" style={{ marginRight: '0.8rem', color: 'var(--acento)' }} />Citas por Mes</div>
                    {porMes.length === 0 ? (
                        <div className="sin-datos"><i className="fas fa-chart-bar" /><p>Sin datos disponibles.</p></div>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={porMes}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Citas" stroke="#3dbeac" strokeWidth={3} dot={{ r: 5, fill: '#3dbeac' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Citas por estado */}
                <div className="grafico-card">
                    <div className="grafico-titulo"><i className="fas fa-chart-pie" style={{ marginRight: '0.8rem', color: 'var(--primario)' }} />Citas por Estado</div>
                    {porEstado.length === 0 ? (
                        <div className="sin-datos"><i className="fas fa-chart-pie" /><p>Sin datos disponibles.</p></div>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={porEstado} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                    {porEstado.map((_, i) => (
                                        <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Diagnósticos más frecuentes */}
                <div className="grafico-card" style={{ gridColumn: 'span 2' }}>
                    <div className="grafico-titulo"><i className="fas fa-stethoscope" style={{ marginRight: '0.8rem', color: 'var(--naranja)' }} />Diagnósticos Más Frecuentes</div>
                    {diagnosticos.length === 0 ? (
                        <div className="sin-datos"><i className="fas fa-stethoscope" /><p>Sin datos disponibles.</p></div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={diagnosticos} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                                <YAxis type="category" dataKey="diagnostico" tick={{ fontSize: 11 }} width={160} />
                                <Tooltip />
                                <Bar dataKey="total" name="Pacientes" radius={[0, 4, 4, 0]}>
                                    {diagnosticos.map((_, i) => (
                                        <Cell key={i} fill={COLORES_DIAG[i % COLORES_DIAG.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </>
    );
}

export default Estadisticas;

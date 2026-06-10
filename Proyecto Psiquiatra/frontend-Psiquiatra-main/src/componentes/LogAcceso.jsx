import { useState, useEffect } from 'react';
import { obtLogs } from '../servicios/api.jsx';

function LogAcceso() {
    const [logs, setLogs]         = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro]     = useState('');
    const [filtroEvento, setFiltroEvento] = useState('');

    async function consulta() {
        setCargando(true);
        try { const datos = await obtLogs(); setLogs(datos); } catch (_) {}
        setCargando(false);
    }

    useEffect(() => { consulta(); }, []);

    const logsFiltrados = logs.filter(l => {
        const texto = `${l.nombre} ${l.email} ${l.ip} ${l.browser}`.toLowerCase();
        const coincideTexto  = texto.includes(filtro.toLowerCase());
        const coincideEvento = filtroEvento ? l.evento === filtroEvento : true;
        return coincideTexto && coincideEvento;
    });

    return (
        <>
            <div className="topbar">
                <div>
                    <div className="topbar-titulo">Log de Acceso</div>
                    <div className="topbar-sub">Registro de ingresos y salidas del sistema</div>
                </div>
                <button className="btn btn-gris btn-sm" onClick={consulta}>
                    <i className="fas fa-sync-alt" /> Actualizar
                </button>
            </div>

            <div className="caja-contenido">
                <div className="acciones-top">
                    <input
                        type="text"
                        placeholder="Buscar por usuario, IP o navegador..."
                        value={filtro}
                        onChange={e => setFiltro(e.target.value)}
                        style={{ padding: '1rem 1.5rem', border: '2px solid var(--grisMedio)', borderRadius: '6px', fontSize: '1.4rem', width: '340px' }}
                    />
                    <select
                        value={filtroEvento}
                        onChange={e => setFiltroEvento(e.target.value)}
                        style={{ padding: '1rem 1.5rem', border: '2px solid var(--grisMedio)', borderRadius: '6px', fontSize: '1.4rem' }}
                    >
                        <option value="">Todos los eventos</option>
                        <option value="ingreso">Ingreso</option>
                        <option value="salida">Salida</option>
                    </select>
                    <span style={{ fontSize: '1.3rem', color: 'var(--gris)' }}>
                        {logsFiltrados.length} registros
                    </span>
                </div>

                {cargando ? <div className="spinner" /> : (
                    logsFiltrados.length === 0 ? (
                        <div className="sin-datos">
                            <i className="fas fa-clipboard-list" />
                            <p>No hay registros de acceso.</p>
                        </div>
                    ) : (
                        <div className="tabla-contenedor">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Usuario</th>
                                        <th>Email</th>
                                        <th>Evento</th>
                                        <th>IP</th>
                                        <th>Navegador</th>
                                        <th>Fecha y Hora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logsFiltrados.map(l => (
                                        <tr key={l.id}>
                                            <td>{l.id}</td>
                                            <td><strong>{l.nombre}</strong></td>
                                            <td>{l.email}</td>
                                            <td>
                                                <span className={`log-${l.evento}`}>
                                                    <i className={`fas fa-${l.evento === 'ingreso' ? 'sign-in-alt' : 'sign-out-alt'}`} style={{ marginRight: '0.5rem' }} />
                                                    {l.evento === 'ingreso' ? 'Ingreso' : 'Salida'}
                                                </span>
                                            </td>
                                            <td><code style={{ fontSize: '1.2rem', background: 'var(--grisClaro)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{l.ip}</code></td>
                                            <td style={{ fontSize: '1.2rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.browser}>
                                                {l.browser?.substring(0, 50) || '—'}
                                            </td>
                                            <td>
                                                {new Date(l.fecha_hora).toLocaleString('es-BO', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                })}
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

export default LogAcceso;

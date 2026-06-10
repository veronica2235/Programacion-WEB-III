import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { obtReportePacientes, obtReporteCitas } from '../servicios/api.jsx';

function Reportes() {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin]       = useState('');
    const [generando, setGenerando]     = useState('');

    // ── Reporte Pacientes ───────────────────────────────────────
    async function generarReportePacientes() {
        setGenerando('pacientes');
        try {
            const datos = await obtReportePacientes();

            const doc = new jsPDF({ orientation: 'landscape' });
            const hoy = new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' });

            // Encabezado
            doc.setFillColor(26, 60, 94);
            doc.rect(0, 0, doc.internal.pageSize.width, 32, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('HENDORFIN — Centro Psiquiátrico', 14, 14);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'normal');
            doc.text('Reporte de Pacientes Activos', 14, 25);
            doc.setFontSize(10);
            doc.text(`Generado: ${hoy}`, doc.internal.pageSize.width - 14, 25, { align: 'right' });

            // Tabla
            autoTable(doc, {
                startY: 40,
                head: [['ID', 'Nombre', 'Apellido', 'CI', 'Fecha Nac.', 'Género', 'Teléfono', 'Médico Asignado', 'Diagnóstico']],
                body: datos.map(p => [
                    p.id,
                    p.nombre,
                    p.apellido,
                    p.ci,
                    p.fecha_nacimiento ? new Date(p.fecha_nacimiento).toLocaleDateString('es-BO') : '—',
                    p.genero,
                    p.telefono || '—',
                    p.medico_asignado || 'Sin asignar',
                    p.diagnostico_inicial?.substring(0, 40) || '—',
                ]),
                headStyles: { fillColor: [26, 60, 94], textColor: 255, fontStyle: 'bold', fontSize: 9 },
                bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
                alternateRowStyles: { fillColor: [240, 244, 248] },
                styles: { cellPadding: 3, lineColor: [200, 210, 220], lineWidth: 0.3 },
                margin: { left: 14, right: 14 },
                didDrawPage: (data) => {
                    // Pie de página
                    const pags = doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text(`Página ${data.pageNumber} de ${pags}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 8, { align: 'center' });
                    doc.text('Hendorfin — Sistema de Gestión Psiquiátrica', 14, doc.internal.pageSize.height - 8);
                }
            });

            doc.save(`reporte_pacientes_${new Date().toISOString().slice(0,10)}.pdf`);
            Swal.fire({ title: 'Reporte generado', icon: 'success', timer: 1500, showConfirmButton: false });
        } catch (_) {
            Swal.fire('Error', 'No se pudo generar el reporte.', 'error');
        } finally {
            setGenerando('');
        }
    }

    return (
        <>
            <div className="topbar">
                <div>
                    <div className="topbar-titulo">Reportes PDF</div>
                    <div className="topbar-sub">Generación de documentos oficiales</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Card reporte pacientes */}
                <div className="caja-contenido">
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ fontSize: '5rem', color: 'var(--primario)', marginBottom: '1.5rem' }}>
                            <i className="fas fa-file-pdf" style={{ color: 'var(--rojo)' }} />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Reporte de Pacientes Activos</h3>
                        <p style={{ color: 'var(--gris)', fontSize: '1.4rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                            Listado completo de todos los pacientes activos con sus datos clínicos y médico asignado.
                        </p>
                        <button
                            className="btn btn-primario"
                            onClick={generarReportePacientes}
                            disabled={generando === 'pacientes'}
                            style={{ padding: '1.3rem 3rem', fontSize: '1.5rem' }}
                        >
                            {generando === 'pacientes'
                                ? <><i className="fas fa-spinner fa-spin" /> Generando...</>
                                : <><i className="fas fa-download" /> Descargar PDF</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reportes;

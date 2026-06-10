import { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import Login from './componentes/Login.jsx';
import Sidebar from './componentes/Sidebar.jsx';
import Dashboard from './componentes/Dashboard.jsx';
import Pacientes from './componentes/Pacientes.jsx';
import Citas from './componentes/Citas.jsx';
import Medicos from './componentes/Medicos.jsx';
import Usuarios from './componentes/Usuarios.jsx';
import Estadisticas from './componentes/Estadisticas.jsx';
import Reportes from './componentes/Reportes.jsx';
import LogAcceso from './componentes/LogAcceso.jsx';

function App() {
    const { usuario, cargando } = useAuth();
    const [paginaActual, setPaginaActual] = useState('dashboard');

    if (cargando) return <div className="spinner" />;
    if (!usuario)  return <Login />;

    const renderPagina = () => {
        switch (paginaActual) {
            case 'dashboard':    return <Dashboard />;
            case 'pacientes':    return <Pacientes />;
            case 'citas':        return <Citas />;
            case 'medicos':      return <Medicos />;
            case 'usuarios':     return <Usuarios />;
            case 'estadisticas': return <Estadisticas />;
            case 'reportes':     return <Reportes />;
            case 'logs':         return <LogAcceso />;
            default:             return <Dashboard />;
        }
    };

    return (
        <div className="app-layout">
            <Sidebar paginaActual={paginaActual} setPagina={setPaginaActual} />
            <main className="contenido-principal">
                {renderPagina()}
            </main>
        </div>
    );
}

export default App;

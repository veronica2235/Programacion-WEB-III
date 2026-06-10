import { createContext, useState, useContext, useEffect } from 'react';
import { loginUsuario, logoutUsuario } from '../servicios/api.jsx';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Al montar, revisar si hay sesión guardada
        const token     = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');
        if (token && usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
        setCargando(false);
    }, []);

    async function login(credenciales) {
        const datos = await loginUsuario(credenciales);
        localStorage.setItem('token',   datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        setUsuario(datos.usuario);
        return datos;
    }

    async function logout() {
        try { await logoutUsuario(); } catch (_) {}
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

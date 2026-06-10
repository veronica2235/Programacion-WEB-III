import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtUsuarios, insertaUsuario, actualizaUsuario, eliminaUsuario } from '../servicios/api.jsx';

const VACIO = { nombre: '', email: '', password: '', rol: 'recepcionista' };

function calcularFortaleza(pwd) {
    if (!pwd) return null;
    let puntos = 0;
    if (pwd.length >= 8)                     puntos++;
    if (/[A-Z]/.test(pwd))                   puntos++;
    if (/[0-9]/.test(pwd))                   puntos++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) puntos++;
    if (puntos <= 1) return 'debil';
    if (puntos <= 3) return 'media';
    return 'fuerte';
}

function Usuarios() {
    const [usuarios, setUsuarios]       = useState([]);
    const [cargando, setCargando]       = useState(true);
    const [modal, setModal]             = useState(false);
    const [usuario, setUsuario]         = useState(VACIO);
    const [idEditar, setIdEditar]       = useState(null);
    const [errores, setErrores]         = useState({});
    const [guardando, setGuardando]     = useState(false);
    const [mostrarPass, setMostrarPass] = useState(false);

    const fortaleza = calcularFortaleza(usuario.password);

    async function consulta() {
        setCargando(true);
        try { const datos = await obtUsuarios(); setUsuarios(datos); } catch (_) {}
        setCargando(false);
    }

    useEffect(() => { consulta(); }, []);

    function abrirNuevo() {
        setUsuario(VACIO);
        setIdEditar(null);
        setErrores({});
        setMostrarPass(false);
        setModal(true);
    }

    function abrirEditar(u) {
        setUsuario({ nombre: u.nombre, email: u.email, password: '', rol: u.rol });
        setIdEditar(u.id);
        setErrores({});
        setMostrarPass(false);
        setModal(true);
    }

    function lee(e) {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
        setErrores({ ...errores, [e.target.name]: '' });
    }

    function valida() {
        const err = {};
        if (!usuario.nombre.trim()) err.nombre = 'El nombre es requerido.';
        if (!usuario.email || !/\S+@\S+\.\S+/.test(usuario.email)) err.email = 'Email inválido.';
        if (!idEditar) {
            if (!usuario.password) err.password = 'La contraseña es requerida.';
            else if (usuario.password.length < 8) err.password = 'Mínimo 8 caracteres.';
            else if (!/[A-Z]/.test(usuario.password)) err.password = 'Debe tener al menos una mayúscula.';
            else if (!/[0-9]/.test(usuario.password)) err.password = 'Debe tener al menos un número.';
            else if (!/[!@#$%^&*(),.?":{}|<>]/.test(usuario.password)) err.password = 'Debe tener al menos un carácter especial.';
        }
        if (!usuario.rol) err.rol = 'El rol es requerido.';
        setErrores(err);
        return Object.keys(err).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!valida()) return;
        setGuardando(true);
        try {
            if (idEditar) {
                await actualizaUsuario(idEditar, { nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
                Swal.fire({ title: 'Usuario actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
            } else {
                await insertaUsuario(usuario);
                Swal.fire({ title: 'Usuario creado', icon: 'success', timer: 1500, showConfirmButton: false });
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
            title: '¿Desactivar usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#c0392b',
        });
        if (!result.isConfirmed) return;
        try {
            await eliminaUsuario(id);
            Swal.fire({ title: 'Usuario desactivado', icon: 'success', timer: 1500, showConfirmButton: false });
            consulta();
        } catch (_) { Swal.fire('Error', 'No se pudo desactivar el usuario.', 'error'); }
    }

    return (
        <>
            <div className="topbar">
                <div>
                    <div className="topbar-titulo">Usuarios del Sistema</div>
                    <div className="topbar-sub">Gestión de accesos y permisos</div>
                </div>
                <button className="btn btn-verde" onClick={abrirNuevo}>
                    <i className="fas fa-user-plus" /> Nuevo Usuario
                </button>
            </div>

            <div className="caja-contenido">
                {cargando ? <div className="spinner" /> : (
                    <div className="tabla-contenedor">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Registrado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td><strong>{u.nombre}</strong></td>
                                        <td>{u.email}</td>
                                        <td><span className={`badge badge-${u.rol}`}>{u.rol}</span></td>
                                        <td><span className={`badge badge-${u.activo ? 'activo' : 'inactivo'}`}>{u.activo ? 'Activo' : 'Inactivo'}</span></td>
                                        <td>{new Date(u.created_at).toLocaleDateString('es-BO')}</td>
                                        <td>
                                            <button className="btn btn-primario btn-sm"
                                                onClick={() => abrirEditar(u)}
                                                style={{ marginRight: '0.8rem' }}>
                                                <i className="fas fa-edit" /> Editar
                                            </button>
                                            {u.activo === 1 && (
                                                <button className="btn btn-rojo btn-sm"
                                                    onClick={() => handleElimina(u.id)}>
                                                    <i className="fas fa-ban" /> Desactivar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{idEditar ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                            <button className="modal-cerrar" onClick={() => setModal(false)}>
                                <i className="fas fa-times" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="campo span-2">
                                    <label>Nombre completo *</label>
                                    <input type="text" name="nombre" value={usuario.nombre} onChange={lee} className={errores.nombre ? 'error' : ''} />
                                    {errores.nombre && <span className="mensaje-error">{errores.nombre}</span>}
                                </div>
                                <div className="campo">
                                    <label>Email *</label>
                                    <input type="email" name="email" value={usuario.email} onChange={lee} className={errores.email ? 'error' : ''} />
                                    {errores.email && <span className="mensaje-error">{errores.email}</span>}
                                </div>
                                <div className="campo">
                                    <label>Rol *</label>
                                    <select name="rol" value={usuario.rol} onChange={lee}>
                                        <option value="admin">Administrador</option>
                                        <option value="recepcionista">Recepcionista</option>
                                        <option value="medico">Médico</option>
                                    </select>
                                </div>
                                {!idEditar && (
                                    <div className="campo span-2">
                                        <label>Contraseña *</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={mostrarPass ? 'text' : 'password'}
                                                name="password"
                                                value={usuario.password}
                                                onChange={lee}
                                                placeholder="Mín. 8 chars, mayúscula, número y símbolo"
                                                className={errores.password ? 'error' : ''}
                                                style={{ paddingRight: '4.5rem' }}
                                            />
                                            <button type="button"
                                                onClick={() => setMostrarPass(!mostrarPass)}
                                                style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8e9aab', fontSize: '1.6rem' }}>
                                                <i className={`fas fa-eye${mostrarPass ? '-slash' : ''}`} />
                                            </button>
                                        </div>
                                        {errores.password && <span className="mensaje-error">{errores.password}</span>}
                                        {fortaleza && (
                                            <div className={`fortaleza-contenedor fortaleza-${fortaleza}`} style={{ marginTop: '0.8rem' }}>
                                                <div className="fortaleza-barra"><div className="fortaleza-fill" /></div>
                                                <span className="fortaleza-texto">
                                                    Contraseña {fortaleza === 'debil' ? 'débil' : fortaleza === 'media' ? 'media' : 'fuerte'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="form-acciones">
                                <button type="button" className="btn btn-gris" onClick={() => setModal(false)}>
                                    <i className="fas fa-times" /> Cancelar
                                </button>
                                <button type="submit" className="btn btn-verde" disabled={guardando}>
                                    {guardando
                                        ? <><i className="fas fa-spinner fa-spin" /> Guardando...</>
                                        : <><i className="fas fa-save" /> {idEditar ? 'Actualizar' : 'Crear Usuario'}</>
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

export default Usuarios;

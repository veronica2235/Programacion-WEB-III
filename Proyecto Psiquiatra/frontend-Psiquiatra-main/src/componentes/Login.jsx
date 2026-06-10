import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../context/AuthContext.jsx';

// ⚠️  Reemplaza con tu Site Key de Google reCAPTCHA v2
const RECAPTCHA_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // key de prueba

function calcularFortaleza(pwd) {
    let puntos = 0;
    if (pwd.length >= 8)                        puntos++;
    if (/[A-Z]/.test(pwd))                      puntos++;
    if (/[0-9]/.test(pwd))                      puntos++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd))    puntos++;
    if (puntos <= 1) return 'debil';
    if (puntos <= 3) return 'media';
    return 'fuerte';
}

function Login() {
    const { login } = useAuth();
    const captchaRef = useRef(null);

    const [form, setForm] = useState({ email: '', password: '' });
    const [errores, setErrores] = useState({});
    const [errorGlobal, setErrorGlobal] = useState('');
    const [cargando, setCargando] = useState(false);
    const [captchaValido, setCaptchaValido] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const fortaleza = form.password ? calcularFortaleza(form.password) : null;

    function leeForm(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrores({ ...errores, [e.target.name]: '' });
        setErrorGlobal('');
    }

    function valida() {
        const nuevosErrores = {};
        if (!form.email)    nuevosErrores.email    = 'El email es requerido.';
        else if (!/\S+@\S+\.\S+/.test(form.email)) nuevosErrores.email = 'Credenciales invalidas';
        if (!form.password) nuevosErrores.password = 'La contraseña es requerida.';
        if (!captchaValido) nuevosErrores.captcha  = 'Debes completar el CAPTCHA.';
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!valida()) return;
        setCargando(true);
        try {
            await login(form);
        } catch (error) {
            setErrorGlobal(
                error?.response?.data?.error || 'Error al iniciar sesión. Verifique sus credenciales.'
            );
            captchaRef.current?.reset();
            setCaptchaValido(false);
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="login-pagina">
            <div className="login-card">
                <div className="login-logo">
                    <h1>HENDORFIN</h1>
                    <p>Sistema de Gestión Psiquiátrica</p>
                </div>

                <h2>Iniciar Sesión</h2>

                {errorGlobal && (
                    <div className="alerta alerta-error">
                        <i className="fas fa-exclamation-circle" /> {errorGlobal}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="campo" style={{ marginBottom: '2rem' }}>
                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="usuario@gmail.com"
                            value={form.email}
                            onChange={leeForm}
                            className={errores.email ? 'error' : ''}
                        />
                        {errores.email && <span className="mensaje-error">{errores.email}</span>}
                    </div>

                    <div className="campo" style={{ marginBottom: '1rem' }}>
                        <label>Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={mostrarPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={leeForm}
                                className={errores.password ? 'error' : ''}
                                style={{ paddingRight: '4.5rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                                style={{
                                    position: 'absolute', right: '1.2rem', top: '50%',
                                    transform: 'translateY(-50%)', background: 'none',
                                    border: 'none', cursor: 'pointer', color: '#8e9aab',
                                    fontSize: '1.6rem'
                                }}
                            >
                                <i className={`fas fa-eye${mostrarPassword ? '-slash' : ''}`} />
                            </button>
                        </div>
                        {errores.password && <span className="mensaje-error">{errores.password}</span>}
                    </div>

                    <div className="captcha-contenedor">
                        <ReCAPTCHA
                            ref={captchaRef}
                            sitekey={RECAPTCHA_KEY}
                            onChange={(val) => setCaptchaValido(!!val)}
                            onExpired={() => setCaptchaValido(false)}
                        />
                    </div>
                    {errores.captcha && (
                        <div className="alerta alerta-error" style={{ marginTop: '-1rem', marginBottom: '1.5rem' }}>
                            <i className="fas fa-robot" /> {errores.captcha}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primario btn-bloque"
                        disabled={cargando}
                        style={{ marginTop: '1rem', padding: '1.5rem', fontSize: '1.6rem' }}
                    >
                        {cargando
                            ? <><i className="fas fa-spinner fa-spin" /> Ingresando...</>
                            : <><i className="fas fa-sign-in-alt" /> Ingresar</>
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;

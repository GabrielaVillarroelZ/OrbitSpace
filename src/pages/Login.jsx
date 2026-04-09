import { Link, useNavigate } from "react-router-dom";
import logo from "./OrbitSpace-Logo.svg";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

function Login({ onClose }) {
    const [vista, setVista] = useState("Login");
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errores[e.target.name]) {
            setErrores({ ...errores, [e.target.name]: '' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevosErrores = {};

        if (vista === "registro" && !formData.nombre.trim()) {
            nuevosErrores.nombre = "El nombre es obligatorio.";
        }
        if (!formData.email.includes("@")) {
            nuevosErrores.email = "Ingresa un correo válido.";
        }
        if (vista !== "recuperar" && formData.password.length < 6) {
            nuevosErrores.password = "La contraseña debe tener 6+ caracteres.";
        }
        if (vista === "registro" && formData.password !== formData.confirmPassword) {
            nuevosErrores.confirmPassword = "Las contraseñas no coinciden.";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        if (vista === "Login") {
            if (formData.email === "admin@orbitspace.com" && formData.password === "123456") {
                localStorage.setItem('orbitspace_auth', 'true');
                if (onClose) onClose();
                navigate("/dashboard");
            } else {
                setErrores({ email: "Credenciales incorrectas" });
                /*(Usa admin@orbitspace.com / 123456)*/
            }
        } else if (vista === "registro") {
            localStorage.setItem('orbitspace_auth', 'true');
            if (onClose) onClose();
            navigate("/dashboard");
        } else if (vista === "recuperar") {
            cambiarVista("Login");
        }
    };

    const cambiarVista = (nuevaVista) => {
        setVista(nuevaVista);
        setErrores({});
        setFormData({ nombre: '', email: '', password: '', confirmPassword: '' });
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
            <div className="mb-8 z-10 flex items-center gap-2">
                <img src={logo} alt="OrbitSpace Logo" className="w-64 h-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,246,0.5)]" />
            </div>

            <div className="relative w-full max-w-sm bg-[#1e103c]/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 z-10 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
                
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-purple-300 hover:text-purple-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {vista === "Login" && (
                    <>
                        <h2 className="text-2xl font-semibold text-purple-50 text-center mb-8">Iniciar Sesión</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="email" name="email" value={formData.email} onChange={handleChange}
                                    placeholder="Correo electrónico"
                                    className={`w-full bg-[#2a1758]/50 border ${errores.email ? 'border-red-500' : 'border-purple-500/30'} text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-purple-300/50`}
                                />
                                {errores.email && <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errores.email}</p>}
                            </div>
                            <div>
                                <input
                                    type="password" name="password" value={formData.password} onChange={handleChange}
                                    placeholder="Contraseña"
                                    className={`w-full bg-[#2a1758]/50 border ${errores.password ? 'border-red-500' : 'border-purple-500/30'} text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-purple-300/50`}
                                />
                                {errores.password && <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errores.password}</p>}
                            </div>
                            <div className="flex items-center pt-2">
                                <input
                                    type="checkbox" id="remember"
                                    className="w-4 h-4 rounded border-purple-500/30 bg-[#2a1758] text-purple-500 focus:ring-purple-500 focus:ring-offset-[#1e103c]"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-purple-200">Recuérdame</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-4"
                            >
                                Iniciar Sesión
                            </button>
                        </form>

                        <div className="mt-6 text-center space-y-2 text-sm text-purple-300/70">
                            <p><button onClick={() => cambiarVista("recuperar")} className="hover:text-purple-300 transition-colors">¿Has olvidado tu contraseña?</button></p>
                            <p>¿No tienes cuenta? <button onClick={() => cambiarVista("registro")} className="hover:text-purple-200 font-medium hover:text-white transition-colors">Regístrate</button></p>
                        </div>
                    </>
                )}

                {vista === "registro" && (
                    <>
                        <h2 className="text-xl font-semibold text-purple-50 text-center mb-8">Crear Cuenta</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input 
                                    type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                                    placeholder="Nombre de Usuario" 
                                    className={`w-full bg-[#2a1758]/50 border ${errores.nombre ? 'border-red-500' : 'border-purple-500/30'} text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 transition-all placeholder-purple-300/50`} 
                                />
                                {errores.nombre && <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errores.nombre}</p>}
                            </div>
                            <div>
                                <input 
                                    type="email" name="email" value={formData.email} onChange={handleChange}
                                    placeholder="Correo electrónico" 
                                    className={`w-full bg-[#2a1758]/50 border ${errores.email ? 'border-red-500' : 'border-purple-500/30'} text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 transition-all placeholder-purple-300/50`} 
                                />
                                {errores.email && <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errores.email}</p>}
                            </div>
                            <div>
                                <input 
                                    type="password" name="password" value={formData.password} onChange={handleChange}
                                    placeholder="Contraseña" 
                                    className={`w-full bg-[#2a1758]/50 border ${errores.password ? 'border-red-500' : 'border-purple-500/30'} text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 transition-all placeholder-purple-300/50`} 
                                />
                                {errores.password && <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errores.password}</p>}
                            </div>
                            
                            <div>
                                <input 
                                    type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                    placeholder="Confirmar Contraseña" 
                                    className={`w-full bg-[#2a1758]/50 border ${errores.confirmPassword ? 'border-red-500' : 'border-purple-500/30'} text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 transition-all placeholder-purple-300/50`} 
                                />
                                {errores.confirmPassword && <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errores.confirmPassword}</p>}
                            </div>

                            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-4">
                                Registrarse
                            </button>
                        </form>
                        
                        <div className="mt-6 text-center text-sm text-purple-300/70">
                            <p>¿Ya tienes cuenta? <button onClick={() => cambiarVista("Login")} className="text-purple-300 hover:text-white font-medium transition-colors ml-1">Inicia sesión</button></p>
                        </div>
                    </>
                )}

                {vista === "recuperar" && (
                    <>
                        <h2 className="text-xl font-semibold text-purple-50 text-center mb-4">Recuperar Contraseña</h2>
                        <p className="text-sm text-purple-200/80 text-center mb-6">
                            Ingresa tu correo y te enviaremos instrucciones.
                        </p>
                        <form onSubmit={(e) => { e.preventDefault(); cambiarVista("Login"); }} className="space-y-4">
                            <input 
                                type="email" placeholder="Correo electrónico" 
                                className="w-full bg-[#2a1758]/50 border border-purple-500/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-purple-300/50" 
                            />
                            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-4">
                                Enviar Instrucciones
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <button onClick={() => cambiarVista("Login")} className="text-purple-400 hover:text-purple-300 transition-colors">
                                Volver al Inicio de Sesión
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;
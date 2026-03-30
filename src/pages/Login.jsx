import {Link} from "react-router-dom";
import logo from "./OrbitSpace-Logo.svg";
import { useState } from "react";
function Login({onClose}) {
    
    const [vista, setVista] = useState("Login");
    
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

            <h2 className="text-2xl font-semibold text-purple-50 text-center mb-8">
Iniciar Sesión
            </h2>
            <form className="space-y-5">
                <div>
                    <input 
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full bg-[#2a1758]/50 border border-purple-500/30 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-purple-300/50"
                    />

                    </div>
                    <div>
                        <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full bg-[#2a1758]/50 border border-purple-500/30 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-purple-300/50"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 rounded border-purple-500/30 bg-[#2a1758] text-purple-500 focus:ring-purple-500 focus:ring-offset-[#1e103c]"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-purple-200">Recuérdame</label>
                    </div>

                        <Link to="/dashboard" classname="block w-full pt-2">

                        <button
                        type="button"
                        className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                        >
                        Iniciar Sesión
                        </button>
                    
                        </Link>
                        </form>

                        <div className="mt-6 text-center space-y-2 text-sm text-purple-300/70">
                        <p><button onClick={() => setVista("recuperar")} className="hover:text-purple-300 transition-colors">¿Has olvidado tu contraseña?</button> </p>
                        <p>¿No tienes cuenta? <button onClick={() => setVista("registro")} className="hover:text-purple-200 font-medium hover:text-white transition-colors">Regístrate</button></p>
                        </div>
            </>
           )}

           {vista === "registro" && (

            <>
            <h2 className="text-xl font-semibold text-purple-50 text-center mb-8"> Crear Cuenta </h2>
            <form className="space-y-5">
                <input type="text" placeholder="Nombre de Usuario" className="w-full bg-[#2a1758]/50 border border-purple-500/30 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-purple-300/50" />
                <input type="email" placeholder="Correo electrónico" className="w-full bg-[#2a1758]/50 border border-purple-500/30 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-purple-300/50" />
                <input type="password" placeholder="Contraseña" className="w-full bg-[#2a1758]/50 border border-purple-500/30 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-purple-300/50" />
                <button type="button" className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-4">
                    Registrarse
                </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-purple-300/70">
            <p> ¿Ya tienes cuenta? <button onClick={() => setVista("Login")} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-4">Inicia sesión</button></p>
            </div>
            </>
              )}

              {vista === "recuperar" && (
                <>
                <h2 className="text-xl font-semibold text-purple-50 text-center mb-4">Recuperar Contraseña</h2>
                <p className="text-sm text-purple-200/80 text-center mb-6">
                Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña.
                </p>
                <form className="space-y-5">
                    <input type="email" placeholder="Correo electrónico" className="w-full bg-[#2a1758]/50 border border-purple-500/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-purple-300/50" />
                    <button type="button" className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-4">
                        Enviar Instrucciones
                    </button>
                </form>

                <div classname="mt-6 text-center text-sm text-purple-300/70">
                <button onClick={() => setVista("Login")} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-4">
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
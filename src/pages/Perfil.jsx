import React, { useState, useEffect } from 'react';
import { Mail, Shield, Key, Camera, Activity, Heart, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { obtenerDatosUsuario, cerrarSesion, obtenerFavoritos } from '../Servicios/api';

function Perfil() {
    const navigate = useNavigate();
    const [guardado, setGuardado] = useState(false);
    const [userData, setUserData] = useState({
        name: "Cargando...",
        email: "...",
        iniciales: "CO",
        role: "Comandante Orbital",
        joinDate: "05 Abril 2026",
        stats: {
            favoritos: 0,
            horasVuelo: 340,
            alertas: 3
        }
    });

    useEffect(() => {
        const inicializarPerfil = async () => {
            const datos = obtenerDatosUsuario();
            const favoritosReales = await obtenerFavoritos();

            if (datos) {
                const nombreReal = datos.nombre || datos.name || "Comandante";
                const inicialesCalculadas = nombreReal
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);

                const fechaRaw = datos.fecha_registro || new Date().toISOString();
                const opcionesFecha = { day: '2-digit', month: 'long', year: 'numeric' };
                const fechaFormateada = new Date(fechaRaw).toLocaleDateString('es-ES', opcionesFecha);

                const horasReales = datos.horas_vuelo || 0;
                const alertasReales = datos.alertas || 0;

                setUserData(prev => ({
                    ...prev,
                    name: nombreReal,
                    email: datos.email || "desconocido@orbit.space",
                    iniciales: inicialesCalculadas || "CO",
                    joinDate: fechaFormateada,
                    stats: {
                        ...prev.stats,
                        favoritos: Array.isArray(favoritosReales) ? favoritosReales.length : 0,
                        horasVuelo: horasReales,
                        alertas: alertasReales
                    }
                }));
            }
        };

        inicializarPerfil();
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        cerrarSesion();
    };

    const handleGuardar = (e) => {
        e.preventDefault();
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#05010a] text-white p-4 md:p-8 pt-24 md:pl-24">
            
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                    Centro de Mando Personal
                </h1>
                <p className="text-purple-300/70 mt-1 text-sm">
                    Gestión de identidad y credenciales de acceso
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="col-span-1 space-y-6">
                    <div className="bg-[#1a0b36]/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
                        
                        <div className="flex flex-col items-center text-center">
                            <div className="relative group cursor-pointer mb-4">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center border-4 border-purple-500/30 shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                                    <span className="text-3xl font-black text-white">{userData.iniciales}</span>
                                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={24} className="text-white" />
                                    </div>
                                </div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-white mb-1">{userData.name}</h2>
                            <span className="px-3 py-1 bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 rounded-full text-xs font-medium uppercase tracking-widest">
                                {userData.role}
                            </span>
                        </div>

                        <div className="mt-8 pt-6 border-t border-purple-500/20 space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-purple-400" />
                                <span className="text-purple-200">{userData.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Activity size={16} className="text-purple-400" />
                                <span className="text-purple-200">Activa desde {userData.joinDate}</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-2xl flex items-center justify-center gap-2 transition-colors font-medium"
                    >
                        <LogOut size={18} />
                        Desconectar Sistema
                    </button>
                </div>

                <div className="col-span-1 lg:col-span-2 space-y-8">
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#1a0b36]/60 border border-purple-500/20 rounded-2xl p-5 text-center">
                            <Heart size={24} className="text-fuchsia-400 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-white">{userData.stats.favoritos}</p>
                            <p className="text-xs text-purple-300/70 uppercase tracking-wide mt-1">Favoritos</p>
                        </div>
                        <div className="bg-[#1a0b36]/60 border border-purple-500/20 rounded-2xl p-5 text-center">
                            <Activity size={24} className="text-purple-400 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-white">{userData.stats.horasVuelo}</p>
                            <p className="text-xs text-purple-300/70 uppercase tracking-wide mt-1">Horas Activa</p>
                        </div>
                        <div className="bg-[#1a0b36]/60 border border-purple-500/20 rounded-2xl p-5 text-center">
                            <Shield size={24} className="text-emerald-400 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-white">{userData.stats.alertas}</p>
                            <p className="text-xs text-purple-300/70 uppercase tracking-wide mt-1">Alertas</p>
                        </div>
                    </div>

                    <div className="bg-[#1a0b36]/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 md:p-8">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Key size={20} className="text-fuchsia-400" />
                            Credenciales de Seguridad
                        </h3>

                        <form className="space-y-5" onSubmit={handleGuardar}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-purple-300 ml-1">Nombre Público</label>
                                    <input 
                                        type="text" 
                                        value={userData.name}
                                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                                        className="w-full bg-[#0a0414]/50 border border-purple-500/30 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-fuchsia-400 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-purple-300 ml-1">Correo de Contacto</label>
                                    <input 
                                        type="email" 
                                        value={userData.email}
                                        readOnly
                                        className="w-full bg-[#0a0414]/50 border border-purple-500/30 text-purple-300/50 text-sm rounded-xl px-4 py-3 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1 pt-2">
                                <label className="text-xs font-medium text-purple-300 ml-1">Nueva Contraseña</label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="w-full bg-[#0a0414]/50 border border-purple-500/30 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-fuchsia-400 transition-colors"
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button 
                                    type="submit" 
                                    className={`px-6 py-3 font-bold rounded-xl transition-all flex items-center gap-2 ${
                                        guardado 
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                        : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                    }`}
                                >
                                    {guardado ? (
                                        <>
                                            <CheckCircle2 size={20} />
                                            Actualizado
                                        </>
                                    ) : (
                                        'Actualizar Credenciales'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Perfil;
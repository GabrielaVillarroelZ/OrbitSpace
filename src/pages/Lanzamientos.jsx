import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, MapPin, Loader2, Navigation, X, Globe, Activity, Zap, Box } from "lucide-react";
import { obtenerLanzamientos } from '../Servicios/api';

const GlobalStyles = () => (
  <style>{`
    @keyframes pulse-star {
      0%, 100% { opacity: 0.1; transform: scale(0.8); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    @keyframes modal-in {
      from { opacity: 0; transform: translateY(30px); scale: 0.98; }
      to { opacity: 1; transform: translateY(0); scale: 1; }
    }
    .animate-pulse-star { animation: pulse-star 3s ease-in-out infinite; }
    .animate-modal-in { animation: modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  `}</style>
);

function Lanzamientos() {
  const [misiones, setMisiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [misionSeleccionada, setMisionSeleccionada] = useState(null);
  const starsArray = Array.from({ length: 40 });

  useEffect(() => {
    const cargarMisiones = async () => {
      try {
        const datos = await obtenerLanzamientos();
        if (datos && datos.data) setMisiones(datos.data);
        else if (Array.isArray(datos)) setMisiones(datos);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    cargarMisiones();
  }, []);

  const formatearFecha = (fechaRaw) => {
    if (!fechaRaw) return "Fecha por determinar";
    try {
      return new Date(fechaRaw).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return "Próximamente"; }
  };

  // Función inteligente para el color del estado leyendo "status"
  const obtenerEstiloEstado = (mision) => {
    const estadoStr = (mision.status || mision.estado || "").toLowerCase();
    
    if (estadoStr.includes("success") || estadoStr.includes("éxito")) return "bg-green-500/10 text-green-400 border-green-400/20";
    if (estadoStr.includes("preparación") || estadoStr.includes("pendiente")) return "bg-yellow-500/10 text-yellow-400 border-yellow-400/20";
    
    return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-400/20";
  };

  const obtenerTextoEstado = (mision) => {
    return mision.status || mision.estado || (mision.date ? "Programado" : "Pendiente");
  };

  return (
    <div className="min-h-screen bg-[#05010a] text-white pt-24 px-6 relative overflow-hidden font-sans pb-20">
      <GlobalStyles />
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        {starsArray.map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full animate-pulse-star"
            style={{
              width: `${Math.random() * 2}px`, height: `${Math.random() * 2}px`,
              top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tighter">Próximos <span className="text-fuchsia-500">Lanzamientos</span></h1>
          <p className="text-purple-300/60 max-w-xl font-medium">Panel de control de misiones activas y próximos eventos de ignición.</p>
        </div>

        {cargando ? (
          <div className="flex flex-col items-center py-20"><Loader2 className="animate-spin text-fuchsia-500" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {misiones.map((mision, index) => (
              <div key={index} className="bg-[#0a0515]/80 backdrop-blur-md border border-purple-500/20 p-10 rounded-[40px] flex flex-col justify-between hover:border-fuchsia-500/40 transition-all duration-300">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-purple-900/30 rounded-2xl text-purple-400">
                      <Rocket size={32} />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${obtenerEstiloEstado(mision)}`}>
                      {obtenerTextoEstado(mision)}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
                    {mision.name || "Misión Desconocida"}
                  </h3>
                  <p className="text-purple-400 text-lg mb-8 font-semibold">
                    {mision.organization || "Agencia Espacial"}
                  </p>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 text-purple-100/70">
                      <Calendar size={20} className="text-fuchsia-500" />
                      <span className="text-sm">{formatearFecha(mision.date)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-purple-100/70">
                      <MapPin size={20} className="text-fuchsia-400" />
                      <span className="text-sm truncate">{mision.location || "Base de Lanzamiento Terrestre"}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setMisionSeleccionada(mision)}
                  className="w-full py-5 bg-[#1a0b36] hover:bg-purple-900/40 text-white rounded-[20px] font-bold text-sm transition-all border border-purple-500/20 uppercase tracking-widest"
                >
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL DETALLADO --- */}
      {misionSeleccionada && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#05010a]/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0a0515] border border-purple-500/30 rounded-[40px] shadow-2xl overflow-hidden animate-modal-in flex flex-col max-h-[90vh]">
            
            <div className="p-8 md:p-12 overflow-y-auto">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-fuchsia-500 font-black text-xs uppercase tracking-[0.3em] mb-3">Dossier de Telemetría</p>
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {misionSeleccionada.name}
                  </h2>
                  <p className="text-purple-300 font-bold flex items-center gap-2">
                    <Globe size={18} /> {misionSeleccionada.organization}
                  </p>
                </div>
                <button onClick={() => setMisionSeleccionada(null)} className="text-purple-300 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all shrink-0">
                  <X size={32} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-purple-500/5 p-4 rounded-3xl border border-purple-500/10">
                  <Calendar size={18} className="text-fuchsia-400 mb-2" />
                  <p className="text-[10px] text-purple-400 uppercase font-black">Fecha NET</p>
                  <p className="text-xs text-white font-mono">{formatearFecha(misionSeleccionada.date)}</p>
                </div>
                <div className="bg-purple-500/5 p-4 rounded-3xl border border-purple-500/10">
                  <Navigation size={18} className="text-fuchsia-400 mb-2" />
                  <p className="text-[10px] text-purple-400 uppercase font-black">Vehículo</p>
                  <p className="text-xs text-white font-mono">{misionSeleccionada.vehicle || "TBD"}</p>
                </div>
                <div className="bg-purple-500/5 p-4 rounded-3xl border border-purple-500/10">
                  <Activity size={18} className="text-fuchsia-400 mb-2" />
                  <p className="text-[10px] text-purple-400 uppercase font-black">Órbita</p>
                  <p className="text-xs text-white font-mono">{misionSeleccionada.type || "LEO"}</p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                   <Box size={24} className="text-fuchsia-400 shrink-0 mt-1" />
                   <div className="flex-1">
                      <p className="text-[10px] text-purple-400 uppercase font-black mb-1">Descripción de la Misión</p>
                      <p className="text-sm text-purple-100 leading-relaxed">
                        {misionSeleccionada.description || "Misión clasificada. Esperando detalles adicionales desde el centro de control."}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                   <Zap size={24} className="text-fuchsia-400 shrink-0" />
                   <div className="flex-1">
                      <p className="text-[10px] text-purple-400 uppercase font-black mb-1">Estado Operativo</p>
                      <p className={`text-sm font-bold uppercase ${obtenerEstiloEstado(misionSeleccionada).split(' ')[1]}`}>
                        {obtenerTextoEstado(misionSeleccionada)}
                      </p>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setMisionSeleccionada(null)}
                className="w-full py-5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(217,70,239,0.4)] uppercase tracking-widest"
              >
                Cerrar Informe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lanzamientos;
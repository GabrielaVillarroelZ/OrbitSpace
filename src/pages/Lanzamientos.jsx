import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, MapPin, Clock, Loader2, Navigation } from "lucide-react";
import { obtenerLanzamientos } from '../Servicios/api';

const GlobalStyles = () => (
  <style>{`
    @keyframes pulse-star {
      0%, 100% { opacity: 0.1; transform: scale(0.8); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    .animate-pulse-star { animation: pulse-star 3s ease-in-out infinite; }
  `}</style>
);

function Lanzamientos() {
  const [misiones, setMisiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const starsArray = Array.from({ length: 40 });

  useEffect(() => {
    const cargarMisiones = async () => {
      try {
        const datos = await obtenerLanzamientos();
        if (Array.isArray(datos)) {
          setMisiones(datos);
        } else {
          setMisiones([]);
        }
      } catch (error) {
        console.error("Error cargando misiones", error);
        setMisiones([]);
      } finally {
        setCargando(false);
      }
    };
    cargarMisiones();
  }, []);

  const formatearFecha = (fechaRaw) => {
    if (!fechaRaw) return "Fecha por determinar";
    try {
      const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(fechaRaw).toLocaleDateString('es-ES', opciones);
    } catch (e) {
      return fechaRaw;
    }
  };

  return (
    <div className="min-h-screen bg-[#05010a] text-white pt-12 md:pt-24 px-6 relative overflow-x-hidden font-sans">
      <GlobalStyles />
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        {starsArray.map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full animate-pulse-star"
            style={{
              width: `${Math.random() * 3}px`, height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`, animationDuration: `${Math.random() * 2 + 2}s`
            }}
          />
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-800/10 via-fuchsia-800/20 to-purple-800/10 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-[0_0_10px_rgba(217,70,239,0.3)]">
            Próximos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Lanzamientos</span>
          </h1>
          <p className="text-purple-200/60 text-lg max-w-2xl">
            Sigue de cerca el calendario orbital. Datos sincronizados con la base de datos central de misiones.
          </p>
        </div>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-fuchsia-500" size={48} />
            <p className="text-purple-300 animate-pulse">Obteniendo manifiesto de carga...</p>
          </div>
        ) : misiones.length === 0 ? (
          <div className="text-center py-20 bg-[#1e103c]/20 rounded-3xl border border-dashed border-purple-500/30">
            <Rocket className="mx-auto text-purple-500/50 mb-4" size={64} />
            <p className="text-purple-300/70 text-xl">No hay misiones programadas en la base de datos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {misiones.map((mision, index) => (
              <div key={mision.id || index} className="bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl hover:border-fuchsia-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:bg-fuchsia-500/20 transition-colors border border-purple-500/10 group-hover:border-fuchsia-500/30">
                    <Rocket className="text-purple-400 group-hover:text-fuchsia-400 transition-colors" size={28} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border text-green-400 bg-green-400/10 border-green-400/20">
                    Programado
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-1 text-white group-hover:text-fuchsia-300 transition-colors line-clamp-1">
                  {mision.nombre || "Misión Desconocida"}
                </h3>
                <p className="text-purple-300 font-medium text-sm mb-6 line-clamp-1">
                  {mision.organizacion || "Agencia Espacial"}
                </p>

                <div className="space-y-3 text-sm text-purple-200/70">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-fuchsia-400 shrink-0" />
                    <span>{formatearFecha(mision.fecha)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Navigation size={16} className="text-fuchsia-400 shrink-0" />
                    <span className="truncate">{mision.vehiculo || "Vehículo Clasificado"}</span> 
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-fuchsia-400 shrink-0" />
                    <span>Base de Lanzamiento Terrestre</span>
                  </div>
                </div>

                <button className="w-full mt-8 py-3 bg-purple-600/20 hover:bg-gradient-to-r hover:from-purple-600 hover:to-fuchsia-600 border border-purple-500/30 hover:border-fuchsia-400/50 rounded-xl font-medium transition-all duration-300 text-purple-200 hover:text-white hover:shadow-[0_0_15px_rgba(217,70,239,0.4)]">
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Lanzamientos;
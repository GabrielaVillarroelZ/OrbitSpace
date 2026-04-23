import React, { useState, useEffect } from 'react';
import { Star, Satellite, Orbit, Activity, Map, Eye, Loader2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { obtenerFavoritos } from '../Servicios/api';

const GlobalStyles = () => (
  <style>{`
    @keyframes pulse-star {
      0%, 100% { opacity: 0.1; transform: scale(0.8); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    .animate-pulse-star { animation: pulse-star 3s ease-in-out infinite; }
  `}</style>
);

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const starsArray = Array.from({ length: 40 });

  useEffect(() => {
    const cargarFavoritos = async () => {
      try {
        const datos = await obtenerFavoritos();
        setFavoritos(datos);
      } catch (error) {
        console.error("Error al cargar favoritos", error);
      } finally {
        setCargando(false);
      }
    };
    cargarFavoritos();
  }, []);

  const eliminarFavorito = async (id) => {
    const confirmar = window.confirm("¿Eliminar este satélite de tus favoritos?");
    if (confirmar) {
      setFavoritos(favoritos.filter(f => (f.id || f.vehiculo_id) !== id));
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
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-[0_0_10px_rgba(217,70,239,0.3)] flex items-center gap-4">
              Mis <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Favoritos</span>
              <Star className="text-fuchsia-400 fill-fuchsia-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]" size={36} />
            </h1>
            <p className="text-purple-200/60 text-lg max-w-2xl">
              Activos orbitales priorizados en tu red de seguimiento personal.
            </p>
          </div>
          <Link to="/mapa" className="px-6 py-3 bg-purple-500/10 border border-purple-500/30 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10 rounded-xl transition-all font-medium text-purple-200 hover:text-white flex items-center gap-2">
            <Map size={16} /> Ver en Mapa
          </Link>
        </div>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-fuchsia-500" size={48} />
            <p className="text-purple-300 animate-pulse">Sincronizando con la base de datos...</p>
          </div>
        ) : favoritos.length === 0 ? (
          <div className="text-center py-20 bg-[#1e103c]/20 rounded-3xl border border-dashed border-purple-500/30">
            <Satellite className="mx-auto text-purple-500/50 mb-4" size={64} />
            <p className="text-purple-300/70 text-xl">No tienes satélites en favoritos.</p>
            <Link to="/dashboard" className="text-fuchsia-400 hover:underline mt-2 inline-block">Explora la flota para añadir activos</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoritos.map((item) => {
              const nominal = (item.estado || 'activo').toLowerCase() === 'activo';
              const id = item.id || item.vehiculo_id;
              
              return (
                <div key={id} className="bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl hover:border-fuchsia-400/50 transition-all duration-300 group flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/10 group-hover:border-fuchsia-500/30 transition-all shrink-0 relative">
                    <Satellite className="text-purple-400 group-hover:text-fuchsia-300" size={40} strokeWidth={1.5} />
                    <div className="absolute -top-2 -right-2 bg-[#05010a] rounded-full p-1">
                      <Star className="text-fuchsia-500 fill-fuchsia-500 w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-300">{item.name || item.nombre_vehiculo || "Satélite"}</h3>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${nominal ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                        {nominal ? 'Nominal' : 'Revisión'}
                      </span>
                    </div>
                    <p className="text-purple-300/70 text-sm mb-4 font-medium">ID: {id}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm text-purple-200/80 mb-5">
                      <div className="flex items-center gap-2 bg-purple-900/20 px-3 py-2 rounded-lg border border-purple-500/10">
                        <Orbit size={14} className="text-fuchsia-400" />
                        <span className="truncate">Lat: {item.lat || '0'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-purple-900/20 px-3 py-2 rounded-lg border border-purple-500/10">
                        <Activity size={14} className="text-fuchsia-400" />
                        <span>Lng: {item.lng || '0'}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link to="/dashboard" className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 border border-fuchsia-400/50 rounded-xl font-medium transition-all text-white hover:shadow-[0_0_15px_rgba(217,70,239,0.4)] flex items-center justify-center gap-2 text-sm text-center">
                        <Eye size={16} /> Telemetría
                      </Link>
                      <button 
                        onClick={() => eliminarFavorito(id)}
                        className="px-4 py-2.5 bg-purple-500/10 border border-purple-500/30 hover:border-red-400/50 hover:bg-red-500/10 rounded-xl transition-all text-purple-300 hover:text-red-300 group/btn"
                      >
                        <Star className="w-5 h-5 group-hover/btn:fill-transparent group-hover/btn:text-red-400 fill-purple-300 text-purple-300" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoritos;
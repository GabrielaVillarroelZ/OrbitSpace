import React, { useState, useEffect } from 'react';
import { Star, Satellite, Orbit, Activity, Map, Eye, Loader2, Trash2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { obtenerFavoritos, toggleFavorito } from '../Servicios/api';
// Importamos nuestras alertas espaciales
import { AlertaEspacial, ToastEspacial } from '../Servicios/alertas';

const GlobalStyles = () => (
  <style>{`
    @keyframes pulse-star { 0%, 100% { opacity: 0.1; transform: scale(0.8); } 50% { opacity: 0.8; transform: scale(1.1); } }
    .animate-pulse-star { animation: pulse-star 3s ease-in-out infinite; }
  `}</style>
);

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const starsArray = Array.from({ length: 40 });

  const cargarDatos = async () => {
    try {
      const datos = await obtenerFavoritos();
      if (Array.isArray(datos)) {
        console.log("Datos recibidos de favoritos:", datos);
        setFavoritos(datos);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const eliminarFavorito = (id, nombreSat) => {
    // Reemplazamos window.confirm por nuestra AlertaEspacial
    AlertaEspacial.fire({
      title: '¿Interrumpir seguimiento?',
      html: `Se detendrá la telemetría continua de <br/><b class="text-fuchsia-400">${nombreSat}</b>.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, detener',
      cancelButtonText: 'Mantener'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const exito = await toggleFavorito(id);
        if (exito) {
          cargarDatos(); // Refrescamos la lista
          // Mostramos el Toast de confirmación
          ToastEspacial.fire({
            icon: 'info',
            title: 'Satélite eliminado de la red.'
          });
        } else {
          // Si algo falla al borrar
          ToastEspacial.fire({
            icon: 'error',
            title: 'Fallo al desanclar',
            text: 'Revisa tu conexión satelital.'
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#05010a] text-white pt-24 px-6 relative font-sans pb-20 overflow-hidden">
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
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#1a0b36]/40 p-6 rounded-2xl border border-purple-500/10">
            <div>
                <h1 className="text-4xl font-extrabold flex items-center gap-4 drop-shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                    Mis <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Favoritos</span>
                    <Star className="text-fuchsia-400 fill-fuchsia-400" size={32} />
                </h1>
                <p className="text-purple-300/70 mt-1">Activos orbitales bajo vigilancia prioritaria.</p>
            </div>
            <Link to="/mapa" className="px-6 py-3 bg-purple-500/10 border border-purple-500/30 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10 rounded-xl transition-all font-bold text-purple-200 flex items-center gap-2">
                <Map size={18} /> Ver Radar 3D
            </Link>
        </div>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20"><Loader2 className="animate-spin text-fuchsia-500 mb-4" size={48} /><p className="animate-pulse">Sincronizando...</p></div>
        ) : favoritos.length === 0 ? (
          <div className="text-center py-20 bg-[#1a0b36]/40 backdrop-blur-md rounded-3xl border border-dashed border-purple-500/30">
            <p className="text-purple-300">No hay activos en seguimiento.</p>
            <Link to="/mapa" className="text-fuchsia-400 hover:underline mt-4 inline-block">Explorar Radar</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {favoritos.map((item) => {
              const id = item.id || item.vehiculo_id;
              const latRaw = item.latitud || item.lat || item.latitude || 0;
              const lngRaw = item.longitud || item.lng || item.longitude || 0;
              // Guardamos el nombre para usarlo en la alerta
              const nombreSat = item.name || item.nombre_vehiculo || item.nombre || `SAT-${id}`;

              return (
                <div key={id} className="bg-[#1a0b36]/70 backdrop-blur-md border border-purple-500/20 p-5 rounded-3xl hover:border-fuchsia-400/40 transition-all group flex gap-5">
                  <div className="w-20 h-20 bg-purple-900/40 rounded-2xl flex items-center justify-center border border-purple-500/10"><Satellite className="text-purple-400 group-hover:text-fuchsia-400" size={32} /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold truncate text-white group-hover:text-fuchsia-300 transition-colors">{nombreSat}</h3>
                    <div className="grid grid-cols-2 gap-2 my-4">
                      <div className="bg-[#0a0515] p-2 rounded-xl border border-purple-500/10 flex items-center gap-2">
                        <Orbit size={14} className="text-fuchsia-500" />
                        <span className="text-xs font-mono">LAT: {parseFloat(latRaw).toFixed(2)}</span>
                      </div>
                      <div className="bg-[#0a0515] p-2 rounded-xl border border-purple-500/10 flex items-center gap-2">
                        <Activity size={14} className="text-fuchsia-500" />
                        <span className="text-xs font-mono">LNG: {parseFloat(lngRaw).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/mapa" className="flex-1 py-2 bg-white/5 hover:bg-fuchsia-500/10 rounded-xl text-xs font-bold border border-white/5 flex items-center justify-center gap-2 transition-all"><Eye size={14} className="text-fuchsia-400" /> Rastrear</Link>
                      <button onClick={() => eliminarFavorito(id, nombreSat)} className="p-2 bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500/20 rounded-xl transition-all"><Trash2 size={16} /></button>
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
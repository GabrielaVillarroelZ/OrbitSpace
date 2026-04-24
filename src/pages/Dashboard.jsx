import React, { useState, useEffect } from 'react';
import LoaderOrbital from '../components/LoaderOrbital';
import { Satellite, Rocket, Activity, CheckCircle2, AlertTriangle, Wifi, Search, MapPin } from 'lucide-react';
import { obtenerSatelites } from '../Servicios/api';

const GlobalStyles = () => (
  <style>{`
    @keyframes radar-sweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes pulse-star { 0%, 100% { opacity: 0.1; transform: scale(0.8); } 50% { opacity: 0.8; transform: scale(1.1); } }
    .animate-radar-sweep { animation: radar-sweep 6s linear infinite; }
    .animate-pulse-star { animation: pulse-star 3s ease-in-out infinite; }
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `}</style>
);

function Dashboard() {
  const [cargando, setCargando] = useState(true);
  const [satelites, setSatelites] = useState([]);
  const [ubicacion, setUbicacion] = useState("Localizando base...");
  const starsArray = Array.from({ length: 40 });

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const datos = await obtenerSatelites();
        setSatelites(datos);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const respuesta = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const datos = await respuesta.json();
          
          const ciudad = datos.address.city || datos.address.town || datos.address.village || datos.address.state || "Base Secreta";
          const pais = datos.address.country || "Planeta Tierra";
          
          setUbicacion(`${ciudad}, ${pais}`);
        } catch (error) {
          console.error("Error descifrando coordenadas", error);
          setUbicacion("Señal GPS débil");
        }
      }, () => {
        setUbicacion("Modo Incógnito Activado");
      });
    } else {
      setUbicacion("Radar no disponible");
    }
  }, []);

  if (cargando) return <LoaderOrbital mensaje="Sincronizando red de satélites..." />;

  return (
    <div className="min-h-screen p-4 md:p-8 text-white relative overflow-hidden bg-[#05010a] animate-fade-in">
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

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#1a0b36]/40 p-4 rounded-2xl border border-purple-500/10">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">Panel de Control</h1>
            <p className="text-purple-300/70 mt-1 text-sm">Estado de la Red Orbital y Misiones</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-300">
             <MapPin size={14} className="text-fuchsia-400" />
             Estación: <span className="text-white font-bold">{ubicacion}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-[#1a0b36]/70 backdrop-blur-md border border-purple-500/30 p-6 rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-fuchsia-400/50 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-purple-300/80 text-sm font-medium">Satélites Activos</p>
              <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/20"><Satellite size={20} /></div>
            </div>
            <h2 className="text-4xl font-extrabold text-white group-hover:text-fuchsia-300 transition-colors drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
              {satelites.length}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-green-400"><CheckCircle2 size={14} /><span>Enlace de Datos Activo</span></div>
          </div>

          <div className="bg-[#1a0b36]/70 backdrop-blur-md border border-purple-500/30 p-6 rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-fuchsia-400/50 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-purple-300/80 text-sm font-medium">Lanzamientos</p>
              <div className="p-2.5 bg-fuchsia-500/20 rounded-xl text-fuchsia-400 border border-fuchsia-500/20"><Rocket size={20} /></div>
            </div>
            <h2 className="text-4xl font-extrabold text-white group-hover:text-fuchsia-300 transition-colors drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">3</h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-purple-300"><span className="font-bold text-fuchsia-300 animate-pulse">T-minus 4h 20m</span></div>
          </div>
        
          <div className="bg-[#1a0b36]/70 backdrop-blur-md border border-purple-500/30 p-6 rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-fuchsia-400/50 transition-all group xl:order-last">
            <div className="flex justify-between items-start mb-2">
              <p className="text-purple-300/80 text-sm font-medium">Estado Sistema</p>
              <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/20"><Activity size={20} /></div>
            </div>
            <h2 className="text-4xl font-extrabold text-white group-hover:text-fuchsia-300 transition-colors drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">Estable</h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-yellow-400"><AlertTriangle size={14} /><span>Sin anomalías</span></div>
          </div>

          <div className="bg-[#1a0b36]/70 backdrop-blur-md border border-purple-500/30 p-6 rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.1)] xl:order-3 flex flex-col max-h-[320px]">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2 shrink-0"><Wifi size={18} className="text-fuchsia-400" />Telemetría Real</h3>
            <div className="space-y-3.5 overflow-y-auto pr-2 pb-2">
              {satelites.map((sat) => {
                const nominal = (sat.estado || 'activo').toLowerCase() === 'activo';
                return (
                  <div key={sat.id || sat.vehiculo_id} className="flex items-center justify-between p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 hover:border-fuchsia-400/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${nominal ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">
                          {sat.name || sat.nombre_vehiculo || sat.nombre || "Desconocido"}
                        </p>
                        <p className="text-[10px] text-purple-300/70">
                          GPS: {sat.lat || sat.latitud || '0'}, {sat.lng || sat.longitud || '0'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${nominal ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {nominal ? 'Nominal' : 'Revisión'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[#1a0b36]/80 backdrop-blur-xl border border-purple-500/40 p-8 rounded-[40px] shadow-[0_0_40px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center relative min-h-[400px]">
          <h3 className="absolute top-6 left-6 text-sm font-bold text-purple-200 flex items-center gap-2"><Search size={16} className="text-fuchsia-400" />BARRIDO ORBITAL (GPS REAL)</h3>
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-purple-500/40 relative bg-[#0a0515] p-2 flex items-center justify-center shadow-inner overflow-hidden">
            {[1, 2, 3].map(ring => (<div key={ring} className="absolute border border-purple-500/20 rounded-full" style={{ width: `${ring * 33}%`, height: `${ring * 33}%` }} />))}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-purple-500/20" />
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-purple-500/20" />
            
            {satelites.map((sat, index) => {
              const lat = parseFloat(sat.lat || sat.latitud || 0);
              const lng = parseFloat(sat.lng || sat.longitud || 0);
              const topPos = 50 - (lat / 90) * 40; 
              const leftPos = 50 + (lng / 180) * 40;
              const nominal = (sat.estado || 'activo').toLowerCase() === 'activo';

              return (
                <div key={`radar-${sat.id || index}`} className={`absolute w-2 h-2 rounded-full ${nominal ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}
                  style={{ top: `${topPos}%`, left: `${leftPos}%`, boxShadow: `0 0 10px ${nominal ? 'rgba(74,222,128,0.8)' : 'rgba(250,204,21,0.8)'}` }}
                  title={sat.name || sat.nombre_vehiculo || "Desconocido"}
                />
              );
            })}

            <div className="absolute top-1/2 left-1/2 h-[50%] w-[1px] origin-top bg-gradient-to-t from-fuchsia-400 to-fuchsia-400/0 animate-radar-sweep">
              <div className="absolute top-0 -left-16 w-32 h-[320px] bg-fuchsia-500/10 rounded-full blur-xl origin-top transform -rotate-[5deg]" />
            </div>
            <div className="w-4 h-4 rounded-full bg-purple-600 border border-purple-400 shadow-[0_0_10px_rgba(168,85,247,1)] relative z-10" />
          </div>
          <p className="absolute bottom-6 text-xs text-purple-300 font-mono">Objetos detectados: {satelites.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
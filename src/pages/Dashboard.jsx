import React, { useState, useEffect } from 'react';
import LoaderOrbital from '../components/LoaderOrbital';
import { Satellite, Rocket, Activity, CheckCircle2, AlertTriangle, Wifi, Search, MapPin } from 'lucide-react';
import { obtenerSatelites, obtenerLanzamientos } from '../Servicios/api';
import { AlertaEspacial, ToastEspacial } from '../Servicios/alertas';

const GlobalStyles = () => (
  <style>{`
    @keyframes radar-sweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes pulse-star { 0%, 100% { opacity: 0.1; transform: scale(0.8); } 50% { opacity: 0.8; transform: scale(1.1); } }
    .animate-radar-sweep { animation: radar-sweep 6s linear infinite; }
    .animate-pulse-star { animation: pulse-star 3s ease-in-out infinite; }
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    /* Scrollbar personalizada para la lista de telemetría */
    .telemetria-scroll::-webkit-scrollbar { width: 4px; }
    .telemetria-scroll::-webkit-scrollbar-track { background: rgba(168, 85, 247, 0.05); border-radius: 10px; }
    .telemetria-scroll::-webkit-scrollbar-thumb { background: rgba(217, 70, 239, 0.4); border-radius: 10px; }
  `}</style>
);

function Dashboard() {
  const [cargando, setCargando] = useState(true);
  const [satelites, setSatelites] = useState([]);
  const [lanzamientos, setLanzamientos] = useState([]);
  const [ubicacion, setUbicacion] = useState("Localizando base...");
  const starsArray = Array.from({ length: 40 });

  useEffect(() => {
    const cargarTelemetria = async () => {
      setCargando(true);
      try {
        let lat = 41.38;
        let lng = 2.17;
        let geoFallo = false;

        if (navigator.geolocation) {
          const position = await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(resolve, () => {
              geoFallo = true;
              resolve(null);
            }, { timeout: 5000 });
          });
          
          if (position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            
            try {
              const resGeo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
              const geoData = await resGeo.json();
              const ciudad = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || "Base Secreta";
              setUbicacion(`${ciudad}, ${geoData.address.country || "Tierra"}`);
            } catch (e) {
              setUbicacion("Coordenadas Clasificadas");
            }
          } else {
            setUbicacion("Barcelona, España (Por defecto)");
          }
        }

        // Si el usuario deniega la ubicación, avisamos sutilmente
        if (geoFallo) {
          ToastEspacial.fire({
            icon: 'info',
            title: 'GPS Offline',
            text: 'Usando coordenadas de la base central.'
          });
        }

        const [datosSatelitesRaw, datosLanzamientosRaw] = await Promise.all([
            obtenerSatelites(lat, lng),
            obtenerLanzamientos()
        ]);
        
        // Blindaje por si Ángela lo manda dentro de "data"
        const datosSatelites = datosSatelitesRaw?.data || datosSatelitesRaw;
        const datosLanzamientos = datosLanzamientosRaw?.data || datosLanzamientosRaw;
        
        setSatelites(Array.isArray(datosSatelites) ? datosSatelites : []);
        setLanzamientos(Array.isArray(datosLanzamientos) ? datosLanzamientos : []);

      } catch (error) {
        console.error(error);
        AlertaEspacial.fire({
          icon: 'error',
          title: 'Caída de Señal',
          text: 'El Centro de Mando no pudo establecer conexión con los servidores de telemetría.'
        });
      } finally {
        setCargando(false);
      }
    };
    cargarTelemetria();
  }, []);

  let textoProximoLanzamiento = "Sin misiones";
  if (lanzamientos.length > 0) {
      // Intentamos leer la fecha con el formato de David o el general
      const fechaRaw = lanzamientos[0].date || lanzamientos[0].fecha;
      if (fechaRaw) {
          const opciones = { day: 'numeric', month: 'short' };
          textoProximoLanzamiento = `Próximo: ${new Date(fechaRaw).toLocaleDateString('es-ES', opciones)}`;
      } else {
          textoProximoLanzamiento = "Programado";
      }
  }

  if (cargando) return <LoaderOrbital mensaje="Sincronizando red de satélites..." />;

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 pb-12 text-white relative overflow-hidden bg-[#05010a] animate-fade-in font-sans">
      <GlobalStyles /> 
      
      {/* Fondo estelar */}
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

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8">
        
        {/* Cabecera Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#0a0515]/80 backdrop-blur-md p-6 rounded-[30px] border border-purple-500/20 shadow-lg">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Panel de Control</h1>
            <p className="text-purple-400 font-medium mt-1">Estado de la Red Orbital y Misiones</p>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
             <MapPin size={18} className="text-fuchsia-500 animate-bounce" />
             <div className="flex flex-col">
               <span className="text-[10px] text-purple-400 uppercase font-black">Coordenadas Base</span>
               <span className="text-white font-bold text-sm">{ubicacion}</span>
             </div>
          </div>
        </div>

        {/* Grid Superior */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-[#0a0515]/80 backdrop-blur-md border border-purple-500/30 p-8 rounded-[35px] shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-fuchsia-400/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-purple-300 font-bold uppercase tracking-widest text-xs">Satélites Activos</p>
              <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all"><Satellite size={24} /></div>
            </div>
            <h2 className="text-5xl font-black text-white group-hover:text-fuchsia-400 transition-colors">
              {satelites.length}
            </h2>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-green-400"><CheckCircle2 size={16} /><span>Enlace de Datos Activo</span></div>
          </div>

          <div className="bg-[#0a0515]/80 backdrop-blur-md border border-purple-500/30 p-8 rounded-[35px] shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-fuchsia-400/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-purple-300 font-bold uppercase tracking-widest text-xs">Lanzamientos</p>
              <div className="p-3 bg-fuchsia-500/10 rounded-2xl text-fuchsia-400 border border-fuchsia-500/20 group-hover:bg-fuchsia-500/20 transition-all"><Rocket size={24} /></div>
            </div>
            <h2 className="text-5xl font-black text-white group-hover:text-fuchsia-400 transition-colors">
              {lanzamientos.length}
            </h2>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-fuchsia-300">
                <span className="uppercase tracking-widest">{textoProximoLanzamiento}</span>
            </div>
          </div>
        
          <div className="bg-[#0a0515]/80 backdrop-blur-md border border-purple-500/30 p-8 rounded-[35px] shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-fuchsia-400/50 transition-all group xl:order-last">
            <div className="flex justify-between items-start mb-4">
              <p className="text-purple-300 font-bold uppercase tracking-widest text-xs">Estado Sistema</p>
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all"><Activity size={24} /></div>
            </div>
            <h2 className="text-5xl font-black text-white group-hover:text-blue-400 transition-colors">Nominal</h2>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-400"><AlertTriangle size={16} /><span>Sin anomalías detectadas</span></div>
          </div>

          <div className="bg-[#0a0515]/80 backdrop-blur-md border border-purple-500/30 p-8 rounded-[35px] shadow-[0_0_20px_rgba(168,85,247,0.1)] xl:order-3 flex flex-col h-[240px]">
            <h3 className="text-sm font-black mb-4 flex items-center gap-2 shrink-0 uppercase tracking-widest text-fuchsia-500"><Wifi size={18} />Telemetría Real</h3>
            <div className="space-y-3 overflow-y-auto pr-2 pb-2 telemetria-scroll flex-1">
              {satelites.length === 0 ? (
                <p className="text-purple-400/50 text-sm italic text-center mt-6">Sin señales detectadas</p>
              ) : (
                satelites.map((sat) => {
                  const estado = (sat.estado || sat.status || 'activo').toLowerCase();
                  const nominal = estado.includes('activo') || estado.includes('success');
                  return (
                    <div key={sat.id || sat.vehiculo_id || Math.random()} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-fuchsia-500/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${nominal ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight w-[100px] truncate">
                            {sat.name || sat.nombre || "Desconocido"}
                          </p>
                          <p className="text-[10px] text-purple-300 font-mono">
                            {parseFloat(sat.lat || sat.latitud || 0).toFixed(2)}, {parseFloat(sat.lng || sat.longitud || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${nominal ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {nominal ? 'Nominal' : 'Revisión'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modulo Radar */}
        <div className="bg-[#0a0515]/90 backdrop-blur-xl border border-purple-500/40 p-8 rounded-[40px] shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center relative min-h-[450px]">
          <div className="absolute top-8 left-8">
            <h3 className="text-xs font-black text-fuchsia-500 uppercase tracking-[0.3em] mb-1 flex items-center gap-2">
              <Search size={16} /> Escáner Activo
            </h3>
            <p className="text-purple-300 font-mono text-[10px]">RADAR DE LARGO ALCANCE (GPS)</p>
          </div>
          
          <div className="w-72 h-72 md:w-96 md:h-96 rounded-full border border-purple-500/30 relative bg-[#05010a] p-2 flex items-center justify-center shadow-[inset_0_0_50px_rgba(168,85,247,0.1)] overflow-hidden mt-8">
            {[1, 2, 3].map(ring => (<div key={ring} className="absolute border border-purple-500/20 rounded-full" style={{ width: `${ring * 33}%`, height: `${ring * 33}%` }} />))}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-purple-500/20" />
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-purple-500/20" />
            
            {satelites.map((sat, index) => {
              const lat = parseFloat(sat.lat || sat.latitud || 0);
              const lng = parseFloat(sat.lng || sat.longitud || 0);
              const topPos = Math.max(5, Math.min(95, 50 - (lat / 90) * 45)); 
              const leftPos = Math.max(5, Math.min(95, 50 + (lng / 180) * 45));
              const estado = (sat.estado || sat.status || 'activo').toLowerCase();
              const nominal = estado.includes('activo') || estado.includes('success');

              return (
                <div key={`radar-${sat.id || index}`} className={`absolute w-2.5 h-2.5 rounded-full ${nominal ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse cursor-pointer hover:scale-150 transition-transform`}
                  style={{ top: `${topPos}%`, left: `${leftPos}%`, boxShadow: `0 0 15px ${nominal ? 'rgba(74,222,128,0.8)' : 'rgba(250,204,21,0.8)'}` }}
                  title={`${sat.name || sat.nombre} - ${nominal ? 'Nominal' : 'Revisión'}`}
                />
              );
            })}

            <div className="absolute top-1/2 left-1/2 h-[50%] w-[1px] origin-top bg-gradient-to-t from-fuchsia-500 to-transparent animate-radar-sweep z-0">
              <div className="absolute top-0 -left-16 w-32 h-[100%] bg-fuchsia-500/20 rounded-full blur-2xl origin-top transform -rotate-[10deg]" />
            </div>
            
            <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,1)] relative z-10" />
          </div>
          
          <div className="absolute bottom-8 right-8 text-right">
             <p className="text-purple-400 font-black text-4xl leading-none">{satelites.length}</p>
             <p className="text-purple-300/60 uppercase text-[10px] tracking-widest font-bold">Objetos Fichados</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
import React, { useState, useEffect } from 'react';
import LoaderOrbital from '../components/LoaderOrbital';
import { Satellite, Rocket, Activity, CheckCircle2, AlertTriangle, Wifi, Search, MapPin, ShieldCheck } from 'lucide-react';
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
    
    .telemetria-scroll::-webkit-scrollbar { width: 4px; }
    .telemetria-scroll::-webkit-scrollbar-track { background: rgba(168, 85, 247, 0.05); }
    .telemetria-scroll::-webkit-scrollbar-thumb { background: rgba(217, 70, 239, 0.4); border-radius: 10px; }
  `}</style>
);

function Dashboard() {
  const [cargando, setCargando] = useState(true);
  const [satelites, setSatelites] = useState([]);
  const [lanzamientos, setLanzamientos] = useState([]);
  const [ubicacion, setUbicacion] = useState("Localizando base...");
  
  const [clickCount, setClickCount] = useState(0);
  const [latencia, setLatencia] = useState(42);
  const [lastSync, setLastSync] = useState(0);
  const [infoMisiones, setInfoMisiones] = useState({ 
    reloj: "00:00:00", 
    nombreProximo: "Sincronizando...",
    totalFuturos: 0,
    esFutura: false 
  });
  
  const starsArray = Array.from({ length: 40 });

  const activarAlertaSimulada = () => {
    setClickCount(prev => {
        const nuevoConteo = prev + 1;
        if (nuevoConteo === 3) {
            AlertaEspacial.fire({
                icon: 'warning',
                title: '¡ALERTA DE PROXIMIDAD!',
                html: `
                    <div className="text-left space-y-2">
                        <p>Objeto detectado: <b class="text-fuchsia-400">ISS (ZARYA)</b></p>
                        <p>Trayectoria: <b class="text-white">Intersección Inminente</b></p>
                    </div>
                `,
                confirmButtonText: 'Iniciar Rastreo',
                background: '#1a0533',
                backdrop: `rgba(139, 92, 246, 0.2)`
            });
            return 0; 
        }
        return nuevoConteo;
    });
  };

  useEffect(() => {
    const cargarTelemetria = async () => {
      setCargando(true);
      try {
        let lat = 41.38;
        let lng = 2.17;
        
        if (navigator.geolocation) {
          const position = await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), { timeout: 5000 });
          });
          if (position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            try {
              const resGeo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
              const geoData = await resGeo.json();
              setUbicacion(`${geoData.address.city || geoData.address.state}, ${geoData.address.country}`);
            } catch (e) { setUbicacion("Coordenadas Clasificadas"); }
          }
        }

        const [datosSatelitesRaw, datosLanzamientosRaw] = await Promise.all([
            obtenerSatelites(lat, lng),
            obtenerLanzamientos()
        ]);
        
        setSatelites(datosSatelitesRaw?.data || datosSatelitesRaw || []);
        setLanzamientos(datosLanzamientosRaw?.data || datosLanzamientosRaw || []);
        setLastSync(0);

      } catch (error) {
        AlertaEspacial.fire({ icon: 'error', title: 'Caída de Señal', text: 'Error de conexión.' });
      } finally { setCargando(false); }
    };
    cargarTelemetria();

    const intervalLatencia = setInterval(() => {
        setLatencia(prev => Math.max(38, Math.min(65, prev + (Math.random() > 0.5 ? 1 : -1))));
        setLastSync(prev => prev + 1);
    }, 1000);

    return () => clearInterval(intervalLatencia);
  }, []);

  useEffect(() => {
    if (!lanzamientos || lanzamientos.length === 0) return;
    const ahoraTimestamp = new Date().getTime();
    const misionesOrdenadas = [...lanzamientos].sort((a, b) => new Date(a.date || a.fecha) - new Date(b.date || b.fecha));
    const misionesFuturas = misionesOrdenadas.filter(l => new Date(l.date || l.fecha).getTime() > ahoraTimestamp);
    const proxima = misionesFuturas.length > 0 ? misionesFuturas[0] : misionesOrdenadas[misionesOrdenadas.length - 1];
    const fechaObjetivo = new Date(proxima.date || proxima.fecha).getTime();

    const intervalo = setInterval(() => {
      const ahora = new Date().getTime();
      const distancia = fechaObjetivo - ahora;
      if (distancia < 0) {
        setInfoMisiones({ reloj: "MISIÓN EN CURSO", nombreProximo: proxima.name || proxima.nombre, totalFuturos: misionesFuturas.length, esFutura: false });
        clearInterval(intervalo);
      } else {
        const d = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const h = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distancia % (1000 * 60)) / 1000);
        setInfoMisiones({
          reloj: `T- ${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`,
          nombreProximo: proxima.name || proxima.nombre,
          totalFuturos: misionesFuturas.length,
          esFutura: true
        });
      }
    }, 1000);
    return () => clearInterval(intervalo);
  }, [lanzamientos]);

  if (cargando) return <LoaderOrbital mensaje="Sincronizando red de satélites..." />;

  const sistemaSalud = satelites.length > 0 && lanzamientos.length > 0 ? 'NOMINAL' : 'DEGRADADO';

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 pb-12 text-white relative overflow-hidden bg-[#05010a] animate-fade-in font-sans">
      <GlobalStyles /> 
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        {starsArray.map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full animate-pulse-star"
            style={{ width: `${Math.random() * 3}px`, height: `${Math.random() * 3}px`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#0a0515]/80 backdrop-blur-md p-6 rounded-[30px] border border-purple-500/20 shadow-lg">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Panel de Control</h1>
            <p className="text-purple-400 font-medium mt-1">Centro de Mando Orbital</p>
          </div>
          <div 
            onClick={activarAlertaSimulada}
            className="flex items-center gap-3 px-5 py-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl cursor-help transition-all active:scale-95"
          >
             <MapPin size={18} className="text-fuchsia-500 animate-bounce" />
             <div className="flex flex-col">
               <span className="text-[10px] text-purple-400 uppercase font-black">Ubicación Actual</span>
               <span className="text-white font-bold text-sm">{ubicacion}</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-[#0a0515]/80 backdrop-blur-md border border-purple-500/30 p-8 rounded-[35px] hover:border-fuchsia-400/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-purple-300 font-bold uppercase tracking-widest text-xs">Objetos Activos</p>
              <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all"><Satellite size={24} /></div>
            </div>
            <h2 className="text-5xl font-black text-white group-hover:text-fuchsia-400 transition-colors">{satelites.length}</h2>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-green-400"><CheckCircle2 size={16} /><span>Transmisión Estable</span></div>
          </div>

          <div className="bg-[#0a0515]/80 backdrop-blur-md border border-purple-500/30 p-8 rounded-[35px] hover:border-fuchsia-400/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-purple-300 font-bold uppercase tracking-widest text-xs">Agenda Global</p>
              <div className="p-3 bg-fuchsia-500/10 rounded-2xl text-fuchsia-400 border border-fuchsia-500/20 group-hover:bg-fuchsia-500/20 transition-all"><Rocket size={24} /></div>
            </div>
            <div className="flex items-baseline gap-3">
                <h2 className="text-5xl font-black text-white group-hover:text-fuchsia-400 transition-colors">{infoMisiones.totalFuturos}</h2>
                <div className="flex flex-col">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-md ${infoMisiones.esFutura ? 'text-white' : 'text-fuchsia-400 animate-pulse'}`}>
                        {infoMisiones.reloj}
                    </span>
                    <span className="text-[8px] text-purple-400 uppercase font-black mt-1">PRÓXIMO T-</span>
                </div>
            </div>
            <div className="mt-6 flex flex-col gap-1">
                <span className="text-[10px] text-purple-200 font-bold uppercase tracking-widest truncate">{infoMisiones.nombreProximo}</span>
                <div className="h-1 w-full bg-purple-900/30 rounded-full overflow-hidden mt-1"><div className="h-full bg-fuchsia-500 w-1/3 opacity-50"></div></div>
            </div>
          </div>
        
          <div className="bg-[#0a0515]/80 backdrop-blur-md border border-purple-500/30 p-8 rounded-[35px] hover:border-blue-400/50 transition-all group xl:order-last">
            <div className="flex justify-between items-start mb-4">
              <p className="text-purple-300 font-bold uppercase tracking-widest text-xs">Telemetría Core</p>
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all"><Activity size={24} /></div>
            </div>
            <h2 className={`text-4xl font-black transition-colors ${sistemaSalud === 'NOMINAL' ? 'text-white' : 'text-yellow-400'}`}>
                {sistemaSalud}
            </h2>
            <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                    <span className="text-purple-400">Latencia API:</span>
                    <span className="text-blue-400 font-mono">{latencia}ms</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                    <span className="text-purple-400">Sync:</span>
                    <span className="text-blue-400 font-mono">{lastSync}s ago</span>
                </div>
                <div className="h-1.5 w-full bg-blue-900/20 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse w-full"></div>
                </div>
            </div>
          </div>

          <div className="bg-[#0a0515]/80 backdrop-blur-md border border-purple-500/30 p-8 rounded-[35px] xl:order-3 flex flex-col h-[240px]">
            <h3 className="text-sm font-black mb-4 flex items-center gap-2 shrink-0 uppercase tracking-widest text-fuchsia-500"><Wifi size={18} />Enlace Directo</h3>
            <div className="space-y-3 overflow-y-auto pr-2 telemetria-scroll flex-1">
              {satelites.slice(0, 10).map((sat, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-fuchsia-500/20 transition-all">
                    <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                    <div>
                        <p className="text-xs font-bold text-white truncate w-[100px]">{sat.name || "UNNAMED-SAT"}</p>
                        <p className="text-[9px] text-purple-400 font-mono">P-LOD: {parseFloat(sat.lat || 0).toFixed(1)}°</p>
                    </div>
                    </div>
                    <ShieldCheck size={14} className="text-blue-500/50" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0a0515]/90 backdrop-blur-xl border border-purple-500/40 p-8 rounded-[40px] shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center relative min-h-[400px]">
          <div className="absolute top-8 left-8"><h3 className="text-xs font-black text-fuchsia-500 uppercase tracking-[0.3em] flex items-center gap-2"><Search size={16} /> Escáner de Proximidad</h3></div>
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-purple-500/30 relative bg-[#05010a] p-2 flex items-center justify-center overflow-hidden">
            {[1, 2, 3].map(ring => (<div key={ring} className="absolute border border-purple-500/20 rounded-full" style={{ width: `${ring * 33}%`, height: `${ring * 33}%` }} />))}
            <div className="absolute top-1/2 left-1/2 h-[50%] w-[1px] origin-top bg-gradient-to-t from-fuchsia-500 to-transparent animate-radar-sweep z-0"></div>
            <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,1)] z-10" />
            {satelites.slice(0, 12).map((sat, index) => (
                <div key={index} className="absolute w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                  style={{ top: `${Math.random() * 70 + 15}%`, left: `${Math.random() * 70 + 15}%`, boxShadow: '0 0 8px rgba(74,222,128,0.4)' }}
                />
            ))}
          </div>
          <div className="absolute bottom-8 right-8 text-right">
             <p className="text-purple-400 font-black text-4xl leading-none">{satelites.length}</p>
             <p className="text-purple-300/60 uppercase text-[8px] tracking-widest font-black">Vectores en Radar</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
import React, { useState, useEffect } from 'react';
import LoaderOrbital from '../components/LoaderOrbital';
import { Satellite, Rocket, Activity, CheckCircle2, AlertTriangle, Wifi, Search, MapPin } from 'lucide-react';

const GlobalStyles = () => (
  <style>{`
    @keyframes radar-sweep {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse-star {
      0%, 100% { opacity: 0.1; transform: scale(0.8); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    .animate-radar-sweep {
      animation: radar-sweep 6s linear infinite;
    }
    .animate-pulse-star {
      animation: pulse-star 3s ease-in-out infinite;
    }
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

function Dashboard() {
  const [cargando, setCargando] = useState(true);
  const starsArray = Array.from({ length: 40 });

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setCargando(false);
    }, 2000);
    return () => clearTimeout(temporizador);
  }, []);

  if (cargando) {
    return <LoaderOrbital mensaje="Sincronizando red de satélites..." />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 text-white relative overflow-hidden bg-[#05010a] animate-fade-in">
      <GlobalStyles /> 

      <div className="absolute inset-0 z-0 pointer-events-none">
        {starsArray.map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse-star"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`
            }}
          />
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-800/10 via-fuchsia-800/20 to-purple-800/10 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#1a0b36]/40 p-4 rounded-2xl border border-purple-500/10">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">
              Panel de Control
            </h1>
            <p className="text-purple-300/70 mt-1 text-sm">Estado de la Red Orbital y Misiones</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-300">
             <MapPin size={14} className="text-fuchsia-400" />
             Estación de Control Terreno: <span className="text-white font-bold">Valencia (ESP)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
          <div className="bg-[#1a0b36]/70 backdrop-blur-md border border-purple-500/30 p-6 rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-fuchsia-400/50 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-purple-300/80 text-sm font-medium">Satélites Activos</p>
              <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/20">
                <Satellite size={20} />
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-white group-hover:text-fuchsia-300 transition-colors drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">1,204</h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
              <CheckCircle2 size={14} />
              <span>98% Cobertura Nominal</span>
            </div>
          </div>

          <div className="bg-[#1a0b36]/70 backdrop-blur-md border border-purple-500/30 p-6 rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-fuchsia-400/50 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-purple-300/80 text-sm font-medium">Próximos Lanzamientos</p>
              <div className="p-2.5 bg-fuchsia-500/20 rounded-xl text-fuchsia-400 border border-fuchsia-500/20">
                <Rocket size={20} />
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-white group-hover:text-fuchsia-300 transition-colors drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">3</h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-purple-300">
              <span className="font-bold text-fuchsia-300 animate-pulse">T-minus 4h 20m</span>
            </div>
          </div>
        
          <div className="bg-[#1a0b36]/70 backdrop-blur-md border border-purple-500/30 p-6 rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-fuchsia-400/50 transition-all group xl:order-last">
            <div className="flex justify-between items-start mb-2">
              <p className="text-purple-300/80 text-sm font-medium">Estado del Sistema</p>
              <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/20">
                <Activity size={20} />
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-white group-hover:text-fuchsia-300 transition-colors drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">Estable</h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-yellow-400">
              <AlertTriangle size={14} />
              <span>1 Alerta menor (Nodo 4)</span>
            </div>
          </div>

          <div className="bg-[#1a0b36]/70 backdrop-blur-md border border-purple-500/30 p-6 rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.1)] xl:order-3">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
               <Wifi size={18} className="text-fuchsia-400" />
               Seguimiento
            </h3>
            
            <div className="space-y-3.5">
              {[
                { name: 'Hubble', orbit: 'LEO', state: 'Nominal', color: 'green' },
                { name: 'Sentinel-3B', orbit: 'HEO', state: 'Revisión', color: 'yellow' },
                { name: 'ISS', orbit: 'LEO', state: 'Nominal', color: 'green' },
              ].map(sat => (
                <div key={sat.name} className="flex items-center justify-between p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 hover:border-fuchsia-400/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${sat.color === 'green' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{sat.name}</p>
                      <p className="text-[10px] text-purple-300/70">{sat.orbit}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${sat.color === 'green' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {sat.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#1a0b36]/80 backdrop-blur-xl border border-purple-500/40 p-8 rounded-[40px] shadow-[0_0_40px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center relative min-h-[400px]">
          <h3 className="absolute top-6 left-6 text-sm font-bold text-purple-200 flex items-center gap-2">
            <Search size={16} className="text-fuchsia-400" />
            BARRIDO ORBITAL (LEO/MEO)
          </h3>
          
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-purple-500/40 relative bg-[#0a0515] p-2 flex items-center justify-center shadow-inner">
            {[1, 2, 3].map(ring => (
              <div key={ring} className={`absolute border border-purple-500/20 rounded-full`} style={{ width: `${ring * 33}%`, height: `${ring * 33}%` }} />
            ))}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-purple-500/20" />
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-purple-500/20" />
            <div className="absolute w-2 h-2 rounded-full bg-green-400 top-1/4 left-1/3 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
            <div className="absolute w-2 h-2 rounded-full bg-yellow-400 top-2/3 right-1/4 animate-pulse delay-500 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            <div className="absolute w-2 h-2 rounded-full bg-fuchsia-400 bottom-1/3 left-1/2 animate-pulse delay-1000 shadow-[0_0_10px_rgba(217,70,239,0.8)]" />
            <div className="absolute top-1/2 left-1/2 h-[50%] w-[1px] origin-top bg-gradient-to-t from-fuchsia-400 to-fuchsia-400/0 animate-radar-sweep shadow-[0_0_10px_rgba(217,70,239,0.5)]">
              <div className="absolute top-0 -left-16 w-32 h-[320px] bg-fuchsia-500/10 rounded-full blur-xl origin-top transition-transform transform -rotate-[5deg]" />
            </div>
            <div className="w-4 h-4 rounded-full bg-purple-600 border border-purple-400 shadow-[0_0_10px_rgba(168,85,247,1)] relative z-10" />
          </div>
          <p className="absolute bottom-6 text-xs text-purple-300 font-mono">Actualizando telemetría... 1204 objetos detectados</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
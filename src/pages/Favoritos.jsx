import React from 'react';
import { Star, Satellite, Orbit, Activity, Map, Eye } from "lucide-react";

const GlobalStyles = () => (
  <style>{`
    @keyframes pulse-star {
      0%, 100% { opacity: 0.1; transform: scale(0.8); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    .animate-pulse-star {
      animation: pulse-star 3s ease-in-out infinite;
    }
  `}</style>
);

function Favoritos() {
  const favoritos = [
    {
      id: 1,
      nombre: "Telescopio Hubble",
      tipo: "Observatorio Espacial",
      orbita: "LEO (Baja Terrestre)",
      altitud: "535 km",
      estado: "Nominal",
      colorEstado: "text-green-400 bg-green-400/10 border-green-400/20"
    },
    {
      id: 2,
      nombre: "ISS (Estación Espacial)",
      tipo: "Estación Orbital",
      orbita: "LEO (Baja Terrestre)",
      altitud: "408 km",
      estado: "Operativa",
      colorEstado: "text-green-400 bg-green-400/10 border-green-400/20"
    },
    {
      id: 3,
      nombre: "Sentinel-3B",
      tipo: "Observación Terrestre",
      orbita: "Heliosíncrona",
      altitud: "814 km",
      estado: "En Revisión",
      colorEstado: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
    },
    {
      id: 4,
      nombre: "James Webb",
      tipo: "Telescopio Infrarrojo",
      orbita: "L2 (Punto de Lagrange)",
      altitud: "1.500.000 km",
      estado: "Rendimiento Óptimo",
      colorEstado: "text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/20"
    }
  ];

  const starsArray = Array.from({ length: 40 });

  return (
    <div className="min-h-screen bg-[#05010a] text-white pt-12 md:pt-24 px-6 relative overflow-x-hidden font-sans">
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
    
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
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
              Acceso rápido a la telemetría de tus activos orbitales y constelaciones prioritarias.
            </p>
          </div>
          <button className="px-6 py-3 bg-purple-500/10 border border-purple-500/30 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10 rounded-xl transition-all font-medium text-purple-200 hover:text-white flex items-center gap-2">
            <Map size={18} />
            Ver en Mapa Satelital
          </button>
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {favoritos.map((item) => (
            <div key={item.id} className="bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl hover:border-fuchsia-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 group flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              
              {/* Icono del Satélite */}
              <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/10 group-hover:border-fuchsia-500/30 group-hover:bg-fuchsia-500/10 transition-all shrink-0 relative">
                <Satellite className="text-purple-400 group-hover:text-fuchsia-300 transition-colors" size={40} strokeWidth={1.5} />
                <div className="absolute -top-2 -right-2 bg-[#05010a] rounded-full p-1">
                  <Star className="text-fuchsia-500 fill-fuchsia-500 w-4 h-4" />
                </div>
              </div>

              {/* Información */}
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-300 transition-colors">{item.nombre}</h3>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${item.colorEstado}`}>
                    {item.estado}
                  </span>
                </div>
                
                <p className="text-purple-300/70 text-sm mb-4 font-medium">{item.tipo}</p>

               
                <div className="grid grid-cols-2 gap-3 text-sm text-purple-200/80 mb-5">
                  <div className="flex items-center gap-2 bg-purple-900/20 px-3 py-2 rounded-lg border border-purple-500/10">
                    <Orbit size={14} className="text-fuchsia-400" />
                    <span className="truncate">{item.orbita}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-900/20 px-3 py-2 rounded-lg border border-purple-500/10">
                    <Activity size={14} className="text-fuchsia-400" />
                    <span>Alt: {item.altitud}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 border border-fuchsia-400/50 rounded-xl font-medium transition-all text-white hover:shadow-[0_0_15px_rgba(217,70,239,0.4)] flex items-center justify-center gap-2 text-sm">
                    <Eye size={16} />
                    Telemetría
                  </button>
                  <button className="px-4 py-2.5 bg-purple-500/10 border border-purple-500/30 hover:border-red-400/50 hover:bg-red-500/10 rounded-xl transition-all text-purple-300 hover:text-red-300 group/btn">
                    <Star className="w-5 h-5 group-hover/btn:fill-transparent group-hover/btn:text-red-400 fill-purple-300 text-purple-300 transition-all" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favoritos;
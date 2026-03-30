import React from 'react';
import { Rocket, Calendar, MapPin, Clock } from "lucide-react";

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

function Lanzamientos() {
  const misiones = [
    {
      id: 1,
      nombre: "Starlink Misión 7-10",
      agencia: "SpaceX",
      fecha: "15 Abril 2026",
      hora: "22:30 UTC",
      ubicacion: "Cabo Cañaveral, Florida",
      estado: "Programado",
      colorEstado: "text-green-400 bg-green-400/10 border-green-400/20"
    },
    {
      id: 2,
      nombre: "Artemis III",
      agencia: "NASA",
      fecha: "TBD 2026",
      hora: "TBD",
      ubicacion: "Centro Espacial Kennedy, Florida",
      estado: "En Preparación",
      colorEstado: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
    },
    {
      id: 3,
      nombre: "Ariane 6 Flight 2",
      agencia: "ESA",
      fecha: "30 Junio 2026",
      hora: "14:00 UTC",
      ubicacion: "Puerto Espacial de Kourou, Guayana Francesa",
      estado: "Preparación",
      colorEstado: "text-blue-400 bg-blue-400/10 border-blue-400/20"
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
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-[0_0_10px_rgba(217,70,239,0.3)]">
            Próximos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Lanzamientos</span>
          </h1>
          <p className="text-purple-200/60 text-lg max-w-2xl">
            Sigue de cerca el calendario orbital. Datos actualizados de las principales agencias espaciales del mundo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {misiones.map((mision) => (
            <div key={mision.id} className="bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl hover:border-fuchsia-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 group">
              
              
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:bg-fuchsia-500/20 transition-colors border border-purple-500/10 group-hover:border-fuchsia-500/30">
                  <Rocket className="text-purple-400 group-hover:text-fuchsia-400 transition-colors" size={28} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${mision.colorEstado}`}>
                  {mision.estado}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-1 text-white group-hover:text-fuchsia-300 transition-colors">{mision.nombre}</h3>
              <p className="text-purple-300 font-medium text-sm mb-6">{mision.agencia}</p>

      
    
              <div className="space-y-3 text-sm text-purple-200/70">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-fuchsia-400" />
                  <span>{mision.fecha}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-fuchsia-400" />
                  <span>{mision.hora}</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-fuchsia-400 shrink-0" />
                  <span>{mision.ubicacion}</span>
                </div>
              </div>

              {/* Botón */}
              <button className="w-full mt-8 py-3 bg-purple-600/20 hover:bg-gradient-to-r hover:from-purple-600 hover:to-fuchsia-600 border border-purple-500/30 hover:border-fuchsia-400/50 rounded-xl font-medium transition-all duration-300 text-purple-200 hover:text-white hover:shadow-[0_0_15px_rgba(217,70,239,0.4)]">
                Ver Detalles de Misión
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Lanzamientos;
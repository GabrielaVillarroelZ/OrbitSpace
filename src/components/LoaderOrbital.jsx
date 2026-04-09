import React from 'react';
import { Satellite } from 'lucide-react';

function LoaderOrbital({ mensaje = "Estableciendo conexión orbital..." }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px]">
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
        
        <div className="absolute inset-0 border-4 border-transparent border-t-fuchsia-500 rounded-full animate-spin shadow-[0_0_15px_rgba(217,70,239,0.5)]"></div>
        <div className="absolute inset-4 border-4 border-transparent border-b-purple-400 rounded-full animate-[spin_1.5s_linear_reverse] shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
        
        <div className="absolute inset-0 bg-purple-500/10 rounded-full animate-pulse"></div>
        
        <Satellite size={32} className="text-white animate-bounce relative z-10" />
      </div>

      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
        </span>
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 tracking-widest uppercase">
          {mensaje}
        </h3>
      </div>
    </div>
  );
}

export default LoaderOrbital;
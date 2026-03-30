import React, { useState } from 'react';
import { Settings, Bell, Shield, Monitor, Wifi, Database, Moon, Sun, Save, AlertCircle } from "lucide-react";

const GlobalStyles = () => (
  <style>{`
    @keyframes pulse-star {
      0%, 100% { opacity: 0.1; transform: scale(0.8); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    .animate-pulse-star {
      animation: pulse-star 3s ease-in-out infinite;
    }
    .toggle-checkbox:checked {
      right: 0;
      border-color: #d946ef;
    }
    .toggle-checkbox:checked + .toggle-label {
      background-color: rgba(217, 70, 239, 0.2);
      border-color: rgba(217, 70, 239, 0.5);
    }
    .toggle-checkbox:checked + .toggle-label:after {
      transform: translateX(100%);
      background-color: #d946ef;
      box-shadow: 0 0 10px #d946ef;
    }
  `}</style>
);

const Toggle = ({ id, label, defaultChecked }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-purple-500/10 last:border-0">
      <label htmlFor={id} className="text-sm text-purple-200 cursor-pointer select-none">
        {label}
      </label>
      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
        <input 
          type="checkbox" 
          name={id} 
          id={id} 
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 opacity-0"
        />
        <label 
          htmlFor={id} 
          className="toggle-label block overflow-hidden h-6 rounded-full bg-[#15092a] border border-purple-500/30 cursor-pointer transition-all duration-300 relative before:absolute before:inset-0 before:bg-fuchsia-500/20 before:opacity-0"
        >
          <span className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-all duration-300 ${isChecked ? 'translate-x-6 bg-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.8)]' : 'bg-purple-500/50'}`}></span>
        </label>
      </div>
    </div>
  );
};

function Configuracion() {
  const starsArray = Array.from({ length: 40 });
  
  // ESTADO PARA CONTROLAR EL TEMA SELECCIONADO (Por defecto: oscuro)
  const [temaSeleccionado, setTemaSeleccionado] = useState('oscuro');

  return (
    <div className="min-h-screen bg-[#05010a] text-white pt-12 md:pt-24 px-6 relative overflow-x-hidden font-sans pb-20">
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

      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="mb-10 border-b border-purple-500/20 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-[0_0_10px_rgba(217,70,239,0.3)] flex items-center gap-4">
            Parámetros del <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Sistema</span>
            <Settings className="text-fuchsia-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]" size={36} />
          </h1>
          <p className="text-purple-200/60 text-lg">
            Ajusta las preferencias de la estación de control, telemetría y seguridad de la red orbital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl hover:border-purple-500/40 transition-all">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/20"><Bell size={20} className="text-fuchsia-400" /></div>
              Alertas del Centro Espacial
            </h3>
            <div className="space-y-2">
              <Toggle id="t1" label="Alertas de Colisión Crítica" defaultChecked={true} />
              <Toggle id="t2" label="Avisos de Mantenimiento Programado" defaultChecked={true} />
              <Toggle id="t3" label="Reportes de Tormentas Solares" defaultChecked={false} />
              <Toggle id="t4" label="Sonido en Alertas Nivel 1" defaultChecked={true} />
            </div>
          </div>

          <div className="bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl hover:border-purple-500/40 transition-all">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/20"><Wifi size={20} className="text-blue-400" /></div>
              Conexión y Telemetría
            </h3>
            <div className="space-y-2">
              <Toggle id="c1" label="Actualización de Datos en Tiempo Real" defaultChecked={true} />
              <Toggle id="c2" label="Descarga Automática de Logs" defaultChecked={false} />
              <div className="py-3 mt-2 border-t border-purple-500/10">
                <label className="text-sm text-purple-200 block mb-2">Frecuencia de Ping Orbital</label>
                <select className="w-full bg-[#15092a] border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-purple-100 outline-none focus:border-fuchsia-400/50">
                  <option>Alta Frecuencia (1s)</option>
                  <option>Estándar (5s)</option>
                  <option>Modo Ahorro de Ancho de Banda (30s)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl hover:border-purple-500/40 transition-all">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-green-500/20 rounded-xl border border-green-500/20"><Shield size={20} className="text-green-400" /></div>
              Seguridad y Encriptación
            </h3>
            <div className="space-y-2">
              <Toggle id="s1" label="Autenticación de Dos Pasos (2FA)" defaultChecked={true} />
              <Toggle id="s2" label="Encriptación de Comando a Extremo" defaultChecked={true} />
              <button className="w-full mt-4 py-2.5 text-sm text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all">
                Revocar Sesiones Activas
              </button>
            </div>
          </div>

          <div className="bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl hover:border-purple-500/40 transition-all">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-yellow-500/20 rounded-xl border border-yellow-500/20"><Monitor size={20} className="text-yellow-400" /></div>
              Preferencias de Interfaz
            </h3>
            
            {/* BOTONES DE TEMA INTERACTIVOS */}
            <div className="flex gap-4 mb-4">
              <button 
                onClick={() => setTemaSeleccionado('oscuro')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${temaSeleccionado === 'oscuro' ? 'border-fuchsia-500/50 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(217,70,239,0.2)]' : 'border-purple-500/10 hover:border-purple-500/30 bg-[#15092a]/50'}`}
              >
                <Moon size={24} className={temaSeleccionado === 'oscuro' ? 'text-fuchsia-300' : 'text-purple-400'} />
                <span className={`text-xs font-bold ${temaSeleccionado === 'oscuro' ? 'text-fuchsia-200' : 'text-purple-300'}`}>Tema Oscuro</span>
              </button>
              
              <button 
                onClick={() => setTemaSeleccionado('claro')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${temaSeleccionado === 'claro' ? 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-purple-500/10 hover:border-purple-500/30 bg-[#15092a]/50'}`}
              >
                <Sun size={24} className={temaSeleccionado === 'claro' ? 'text-blue-300' : 'text-purple-400'} />
                <span className={`text-xs font-bold ${temaSeleccionado === 'claro' ? 'text-blue-200' : 'text-purple-300'}`}>Tema Claro</span>
              </button>
            </div>

            {/* AVISO DE SISTEMA SI SELECCIONAN TEMA CLARO */}
            {temaSeleccionado === 'claro' && (
              <div className="mb-6 flex items-start gap-2 text-xs text-blue-300 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 animate-pulse">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <p>El tema claro se aplicará globalmente tras reiniciar los terminales de la estación. Aumenta el consumo energético un 15%.</p>
              </div>
            )}
            
            <Toggle id="i1" label="Reducir Animaciones del Radar" defaultChecked={false} />
          </div>

        </div>

        <div className="mt-10 flex justify-end">
          <button className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 border border-fuchsia-400/50 rounded-xl font-bold transition-all text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] hover:scale-105 flex items-center justify-center gap-3 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
            <Save size={20} />
            Aplicar Cambios en el Sistema
          </button>
        </div>

      </div>
    </div>
  );
}

export default Configuracion;
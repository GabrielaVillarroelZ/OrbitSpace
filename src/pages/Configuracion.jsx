import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Monitor, Wifi, Zap, Battery, Save, AlertCircle } from "lucide-react";
// 👉 Importamos nuestras alertas
import { AlertaEspacial, ToastEspacial } from '../Servicios/alertas';

const usePerformanceMode = () => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('performanceMode') || 'high';
  });

  useEffect(() => {
    localStorage.setItem('performanceMode', mode);
    window.dispatchEvent(new Event('modeChange'));
  }, [mode]);

  return [mode, setMode];
};

const GlobalStyles = () => (
  <style>{`
    .toggle-checkbox:checked + .toggle-label {
      background-color: rgba(217, 70, 239, 0.2);
      border-color: rgba(217, 70, 239, 0.5);
    }
    .toggle-checkbox:checked + .toggle-label span {
      transform: translateX(1.5rem);
      background-color: #d946ef;
      box-shadow: 0 0 10px #d946ef;
    }
  `}</style>
);

// 👉 Toggle refactorizado para enviar los cambios al estado padre
const Toggle = ({ id, label, isChecked, onChange, disabled }) => {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-purple-500/10 last:border-0 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <label htmlFor={id} className="text-sm text-purple-200 cursor-pointer select-none font-medium">
        {label}
      </label>
      <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
        <input 
          type="checkbox" 
          id={id} 
          checked={isChecked}
          onChange={() => onChange(id, !isChecked)}
          disabled={disabled}
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 opacity-0"
        />
        <label 
          htmlFor={id} 
          className="toggle-label block overflow-hidden h-6 rounded-full bg-[#15092a] border border-purple-500/30 cursor-pointer transition-all duration-300 relative"
        >
          <span className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-all duration-300 bg-purple-500/50`}></span>
        </label>
      </div>
    </div>
  );
};

function Configuracion() {
  const [mode, setMode] = usePerformanceMode();

  // 👉 Estado centralizado para todos los parámetros
  const [ajustes, setAjustes] = useState({
    alertaColision: true,
    avisoMantenimiento: true,
    tormentasSolares: false,
    tiempoReal: true,
    auth2FA: true,
    encriptacion: true,
    frecuenciaPing: '5s'
  });

  const handleToggleChange = (id, newValue) => {
    setAjustes(prev => ({ ...prev, [id]: newValue }));
  };

  const handleFrecuenciaChange = (e) => {
    setAjustes(prev => ({ ...prev, frecuenciaPing: e.target.value }));
  };

  // 👉 Función para aplicar cambios visualmente
  const guardarConfiguracion = () => {
    ToastEspacial.fire({
      icon: 'success',
      title: 'Parámetros guardados',
      text: 'La estación de control ha sido recalibrada.'
    });
  };

  // 👉 Función de Seguridad Extrema
  const revocarSesiones = () => {
    AlertaEspacial.fire({
      icon: 'warning',
      title: 'Protocolo de Seguridad',
      text: '¿Deseas desconectar todos los terminales vinculados a esta cuenta?',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Rojo para peligro
      confirmButtonText: 'Sí, revocar acceso',
      cancelButtonText: 'Abortar'
    }).then((result) => {
      if (result.isConfirmed) {
        ToastEspacial.fire({
          icon: 'info',
          title: 'Conexiones externas purgadas.'
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#05010a] text-white pt-12 md:pt-24 px-6 relative overflow-x-hidden font-sans pb-20">
      <GlobalStyles />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-10 border-b border-purple-500/20 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center gap-4 text-white">
            Parámetros del <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Sistema</span>
            <Settings className="text-fuchsia-400" size={36} />
          </h1>
          <p className="text-purple-200/60 text-lg">
            Ajusta las preferencias de la estación de control, telemetría y rendimiento de la interfaz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Alertas */}
          <div className={`bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl transition-all ${mode === 'high' ? 'hover:border-purple-500/40 shadow-lg' : 'bg-[#15092a]/80 border-purple-900/30'}`}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/20"><Bell size={20} className="text-fuchsia-400" /></div>
              Alertas del Centro Espacial
            </h3>
            <div className="space-y-2">
              <Toggle id="alertaColision" label="Alertas de Colisión Crítica" isChecked={ajustes.alertaColision} onChange={handleToggleChange} />
              <Toggle id="avisoMantenimiento" label="Avisos de Mantenimiento Programado" isChecked={ajustes.avisoMantenimiento} onChange={handleToggleChange} />
              <Toggle id="tormentasSolares" label="Reportes de Tormentas Solares" isChecked={ajustes.tormentasSolares} onChange={handleToggleChange} />
            </div>
          </div>

          {/* Telemetría */}
          <div className={`bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl transition-all ${mode === 'high' ? 'hover:border-purple-500/40 shadow-lg' : 'bg-[#15092a]/80 border-purple-900/30'}`}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/20"><Wifi size={20} className="text-blue-400" /></div>
              Conexión y Telemetría
            </h3>
            <div className="space-y-2">
              <Toggle id="tiempoReal" label="Actualización de Datos en Tiempo Real" isChecked={mode === 'eco' ? false : ajustes.tiempoReal} onChange={handleToggleChange} disabled={mode === 'eco'} />
              <div className="py-3 mt-2 border-t border-purple-500/10">
                <label className="text-sm text-purple-200 block mb-2 font-medium">Frecuencia de Ping Orbital</label>
                <select 
                  className="w-full bg-[#15092a] border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-purple-100 outline-none focus:border-fuchsia-400/50 cursor-pointer"
                  value={mode === 'eco' ? "30s" : ajustes.frecuenciaPing}
                  disabled={mode === 'eco'}
                  onChange={handleFrecuenciaChange}
                >
                  <option value="1s">Alta Frecuencia (1s)</option>
                  <option value="5s">Estándar (5s)</option>
                  <option value="30s">Modo Ahorro (30s)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className={`bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl transition-all ${mode === 'high' ? 'hover:border-purple-500/40 shadow-lg' : 'bg-[#15092a]/80 border-purple-900/30'}`}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-green-500/20 rounded-xl border border-green-500/20"><Shield size={20} className="text-green-400" /></div>
              Seguridad y Encriptación
            </h3>
            <div className="space-y-2">
              <Toggle id="auth2FA" label="Autenticación de Dos Pasos (2FA)" isChecked={ajustes.auth2FA} onChange={handleToggleChange} />
              <Toggle id="encriptacion" label="Encriptación de Comando a Extremo" isChecked={ajustes.encriptacion} onChange={handleToggleChange} />
              <button 
                onClick={revocarSesiones}
                className="w-full mt-4 py-2.5 text-sm text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all font-medium active:scale-95"
              >
                Revocar Sesiones Activas
              </button>
            </div>
          </div>

          {/* Rendimiento */}
          <div className={`bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl transition-all ${mode === 'high' ? 'hover:border-purple-500/40 shadow-lg' : 'bg-[#15092a]/80 border-2 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]'}`}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className={`p-2 rounded-xl border ${mode === 'high' ? 'bg-yellow-500/20 border-yellow-500/20' : 'bg-green-500/20 border-green-500/20'}`}>
                <Monitor size={20} className={mode === 'high' ? "text-yellow-400" : "text-green-400"} />
              </div>
              Rendimiento Visual
            </h3>
            <div className="flex gap-4 mb-4">
              <button 
                onClick={() => setMode('high')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all active:scale-95 ${mode === 'high' ? 'border-fuchsia-500/50 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(217,70,239,0.2)]' : 'border-purple-500/10 hover:border-purple-500/30 bg-[#15092a]/50'}`}
              >
                <Zap size={24} className={mode === 'high' ? 'text-fuchsia-400' : 'text-purple-400'} />
                <span className={`text-xs font-bold ${mode === 'high' ? 'text-fuchsia-300' : 'text-purple-300'}`}>Máxima Calidad</span>
              </button>
              <button 
                onClick={() => setMode('eco')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all active:scale-95 ${mode === 'eco' ? 'border-green-500/50 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'border-purple-500/10 hover:border-purple-500/30 bg-[#15092a]/50'}`}
              >
                <Battery size={24} className={mode === 'eco' ? 'text-green-400' : 'text-purple-400'} />
                <span className={`text-xs font-bold ${mode === 'eco' ? 'text-green-300' : 'text-purple-300'}`}>Modo Eco</span>
              </button>
            </div>
            {mode === 'eco' && (
              <div className="flex items-start gap-2 text-xs text-green-300 bg-green-500/10 p-3 rounded-xl border border-green-500/20 animate-in fade-in">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <p>Modo Sigilo activo. Se han optimizado los recursos para ahorrar batería y CPU.</p>
              </div>
            )}
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="mt-10 flex justify-end">
          <button 
            onClick={guardarConfiguracion}
            className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 border border-fuchsia-400/50 rounded-xl font-bold transition-all text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] active:scale-95 flex items-center justify-center gap-3"
          >
            <Save size={20} />
            Aplicar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}

export default Configuracion;
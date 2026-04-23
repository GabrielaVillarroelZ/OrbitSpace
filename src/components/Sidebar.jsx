import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Home, Rocket, Globe, Settings, LogOut, Star, User, X } from "lucide-react";
import logo from "../pages/OrbitSpace-Logo.svg"; 
import { obtenerDatosUsuario, cerrarSesion } from '../Servicios/api';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  
  const [usuario, setUsuario] = useState({ nombre: 'Comandante', iniciales: 'CO' });

  useEffect(() => {
    const datos = obtenerDatosUsuario();
    if (datos) {
      const nombreCompleto = datos.nombre || datos.name || 'Comandante';
      const iniciales = nombreCompleto
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
        
      setUsuario({
        nombre: nombreCompleto,
        iniciales: iniciales || 'CO'
      });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [profileMenuRef]);

  useEffect(() => {
    if (isOpen) onClose();
  }, [location.pathname]);

  const linkClasses = (path) => {
    const baseClasses = "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all border text-sm";
    if (location.pathname === path) {
      return `${baseClasses} bg-gradient-to-r from-purple-600/40 to-fuchsia-600/10 text-white border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]`;
    }
    return `${baseClasses} text-purple-200/70 border-transparent hover:text-white hover:bg-purple-500/10`;
  };

  const iconColor = (path) => {
    return location.pathname === path ? "text-purple-300" : "text-purple-400/60";
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    cerrarSesion();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen w-72 bg-[#1a0b36] md:bg-[#1e103c]/60 backdrop-blur-2xl border-r border-purple-500/20 
        flex flex-col justify-between p-6 z-[70] transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <img src={logo} alt="OrbitSpace Logo" className="w-32 h-auto drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]" />
            
            <button onClick={onClose} className="md:hidden text-purple-400 p-1 hover:text-white">
              <X size={24} />
            </button>

            <div className="relative hidden md:block" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isProfileMenuOpen 
                    ? 'border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.5)]' 
                    : 'border-purple-500/30 hover:border-fuchsia-400/80'
                } bg-[#1a0b36] overflow-hidden`}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-xs">
                  {usuario.iniciales}
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute left-0 top-full mt-3 w-56 bg-[#1a0b36] border border-purple-500/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-purple-500/10 bg-white/5">
                    <p className="text-[10px] text-fuchsia-400 uppercase tracking-widest font-bold mb-1">Sesión Iniciada</p>
                    <p className="text-sm font-bold text-white">{usuario.nombre}</p>
                  </div>
                  <nav className="p-2 space-y-1">
                    <Link to="/perfil" className="flex items-center gap-3 px-3 py-2 text-sm text-purple-100 hover:bg-purple-500/20 rounded-xl transition-colors">
                      <User size={16} className="text-purple-400" /> Mi Perfil
                    </Link>
                    <Link to="/configuracion" className="flex items-center gap-3 px-3 py-2 text-sm text-purple-100 hover:bg-purple-500/20 rounded-xl transition-colors">
                      <Settings size={16} className="text-purple-400" /> Ajustes
                    </Link>
                    <div className="h-px bg-purple-500/10 my-1 mx-2" />
                    <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden mb-8 p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 to-fuchsia-900/10 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center font-bold text-white">
                {usuario.iniciales}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{usuario.nombre}</h4>
                <p className="text-[10px] text-fuchsia-400 uppercase tracking-wider">Comandante</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Link to="/perfil" className="flex items-center justify-center gap-2 py-2 bg-white/5 rounded-lg text-xs font-medium text-purple-200 hover:bg-white/10">
                    <User size={14} /> Perfil
                </Link>
                <Link to="/configuracion" className="flex items-center justify-center gap-2 py-2 bg-white/5 rounded-lg text-xs font-medium text-purple-200 hover:bg-white/10">
                    <Settings size={14} /> Ajustes
                </Link>
            </div>
          </div>

          <nav className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-[10px] text-purple-400/60 uppercase tracking-[0.2em] font-bold ml-4 mb-4">Navegación</p>
            <Link to="/dashboard" className={linkClasses("/dashboard")}><Home size={18} className={iconColor("/dashboard")} /> <span className="font-semibold">Panel de Control</span></Link>
            <Link to="/mapa" className={linkClasses("/mapa")}><Globe size={18} className={iconColor("/mapa")} /> <span className="font-semibold">Mapa Satelital</span></Link>
            <Link to="/lanzamientos" className={linkClasses("/lanzamientos")}><Rocket size={18} className={iconColor("/lanzamientos")} /> <span className="font-semibold">Lanzamientos</span></Link>
            <Link to="/favoritos" className={linkClasses("/favoritos")}><Star size={18} className={iconColor("/favoritos")} /> <span className="font-semibold">Mis Favoritos</span></Link>
            
            <div className="pt-4 mt-4 border-t border-purple-500/10">
                <p className="text-[10px] text-purple-400/60 uppercase tracking-[0.2em] font-bold ml-4 mb-4">Sistema</p>
                <Link to="/configuracion" className={linkClasses("/configuracion")}><Settings size={18} className={iconColor("/configuracion")} /> <span className="font-semibold">Configuración</span></Link>
                <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold">
                    <LogOut size={18} /> <span>Cerrar Sesión</span>
                </button>
            </div>
          </nav>
        </div>

        <div className="text-[9px] text-purple-400/30 text-center pt-6 uppercase tracking-[0.3em] font-bold border-t border-purple-500/5">
           OrbitSpace© 2026
        </div>
      </aside>
    </>
  );
}

export default Sidebar;





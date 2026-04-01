import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Home, Rocket, Globe, Settings, LogOut, Star, User, X } from "lucide-react";
import logo from "../pages/OrbitSpace-Logo.svg"; 

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [profileMenuRef]);

  // Cerrar menú móvil automáticamente al cambiar de página
  useEffect(() => {
    if (isOpen) onClose();
  }, [location]);

  const linkClasses = (path) => {
    const baseClasses = "flex items-center gap-3 px-4 py-2 rounded-xl transition-all border text-sm";
    if (location.pathname === path) {
      return `${baseClasses} bg-gradient-to-r from-purple-600/40 to-fuchsia-600/10 text-white border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]`;
    }
    return `${baseClasses} text-purple-200/70 border-transparent hover:text-white hover:bg-purple-500/10`;
  };

  const iconColor = (path) => {
    return location.pathname === path ? "text-purple-300" : "text-purple-400/60";
  };

  return (
    <>
      {/* Overlay para móvil: Se activa con la prop isOpen */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Principal */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-[#1a0b36] md:bg-[#1e103c]/40 backdrop-blur-xl border-r border-purple-500/20 
        flex flex-col justify-between p-6 z-[70] transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="flex items-center justify-between mb-8 gap-3">
            <img src={logo} alt="OrbitSpace Logo" className="w-32 h-auto drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]" />
            
            {/* Botón X solo visible en móvil dentro del menú */}
            <button onClick={onClose} className="md:hidden text-purple-400 p-1">
              <X size={24} />
            </button>

            <div className="relative hidden md:block" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-300 ${
                  isProfileMenuOpen 
                    ? 'border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.5)]' 
                    : 'border-purple-500/30 hover:border-fuchsia-400/80'
                } bg-[#1a0b36] overflow-hidden`}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-sm">
                  GV
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-60 bg-[#1a0b36] border border-purple-500/40 rounded-2xl shadow-[0_10px_30px_rgba(168,85,247,0.3)] z-[100] overflow-hidden">
                  <div className="p-4 border-b border-purple-500/20 bg-[#15092a]/50 flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-sm">GV</div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Gabriela V.</h4>
                      <p className="text-[10px] text-fuchsia-300 uppercase tracking-wider">Comandante</p>
                    </div>
                  </div>
                  <nav className="p-2 space-y-1 text-sm">
                    <button className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-purple-100 hover:bg-purple-500/10 transition-colors">
                      <User size={16} className="text-purple-400" /> <span>Mi Perfil</span>
                    </button>
                    <button className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-purple-100 hover:bg-purple-500/10 transition-colors">
                      <Settings size={16} className="text-purple-400" /> <span>Ajustes</span>
                    </button>
                    <div className="border-t border-purple-500/20 my-2"></div>
                    <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut size={16} /> <span className="font-medium">Cerrar Sesión</span>
                    </Link>
                  </nav>
                </div>
              )}
            </div>
          </div>

          <nav className="space-y-3">
            <Link to="/dashboard" className={linkClasses("/dashboard")}><Home size={18} className={iconColor("/dashboard")} /> <span className="font-medium">Panel de Control</span></Link>
            <Link to="/mapa" className={linkClasses("/mapa")}><Globe size={18} className={iconColor("/mapa")} /> <span className="font-medium">Mapa Satelital</span></Link>
            <Link to="/lanzamientos" className={linkClasses("/lanzamientos")}><Rocket size={18} className={iconColor("/lanzamientos")} /> <span className="font-medium">Lanzamientos</span></Link>
            <Link to="/favoritos" className={linkClasses("/favoritos")}><Star size={18} className={iconColor("/favoritos")} /> <span className="font-medium">Mis Favoritos</span></Link>
            <Link to="/configuracion" className={linkClasses("/configuracion")}><Settings size={18} className={iconColor("/configuracion")} /> <span className="font-medium">Configuración</span></Link>
          </nav>
        </div>

        <div className="text-[10px] text-purple-400/40 text-center pb-2 uppercase tracking-widest font-bold">
           OrbitSpace© 2026
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
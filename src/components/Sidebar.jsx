import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Home, Rocket, Globe, Settings, LogOut, Star, User, ChevronDown } from "lucide-react";
import logo from "../pages/OrbitSpace-Logo.svg"; 

function Sidebar() {
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
    <aside className="w-64 h-screen bg-[#1e103c]/40 backdrop-blur-xl border-r border-purple-500/20 flex flex-col justify-between p-6 z-20 fixed left-0 top-0">
      <div>
    
        <div className="flex items-center justify-between mb-8 gap-3">
     
          <img src={logo} alt="OrbitSpace Logo" className="w-32 h-auto drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]" />

    
          <div className="relative" ref={profileMenuRef}>
        
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-300 ${
                isProfileMenuOpen 
                  ? 'border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.5)] scale-105' 
                  : 'border-purple-500/30 hover:border-fuchsia-400/80 hover:scale-105'
              } bg-[#1a0b36] overflow-hidden group`}
            >
           
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-sm group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">
                GV
              </div>
            </button>

           
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-3 w-60 bg-[#1a0b36]/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl shadow-[0_10px_30px_rgba(168,85,247,0.3)] z-50 overflow-hidden transform origin-top-right scale-100 transition-all">
                
                {/* Cabecera del menú (Datos simulados)*/}
                <div className="p-4 border-b border-purple-500/20 bg-[#15092a]/50 flex items-center gap-3">
                  <div className="w-12 h-12 shrink-0 rounded-full border border-fuchsia-400/50 bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-lg">
                    GV
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Gabriela V.</h4>
                    <p className="text-xs text-fuchsia-300">Commandante Orbital</p>
                    <p className="text-[10px] text-purple-300/60 mt-0.5">gabriela@orbitspace</p>
                  </div>
                </div>

               
                <nav className="p-2 space-y-1 text-sm">
                  <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-purple-100 hover:bg-purple-500/10 hover:text-white transition-colors">
                    <User size={16} className="text-purple-400" />
                    <span>Mi Perfil</span>
                  </button>
                  <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-purple-100 hover:bg-purple-500/10 hover:text-white transition-colors">
                    <Settings size={16} className="text-purple-400" />
                    <span>Ajustes de Cuenta</span>
                  </button>
                  <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-purple-100 hover:bg-purple-500/10 hover:text-white transition-colors">
                    <Star size={16} className="text-purple-400" />
                    <span>Suscripción Premium</span>
                  </button>
                  
                  <div className="border-t border-purple-500/20 my-2"></div>

                  <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                    <LogOut size={16} />
                    <span className="font-medium">Cerrar Sesión</span>
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>


        <nav className="space-y-3">
          <Link to="/dashboard" className={linkClasses("/dashboard")}>
            <Home size={18} className={iconColor("/dashboard")} />
            <span className="font-medium">Panel de Control</span>
          </Link>

          <Link to="/mapa" className={linkClasses("/mapa")}>
            <Globe size={18} className={iconColor("/mapa")} />
            <span className="font-medium">Mapa Satelital</span>
          </Link>

          <Link to="/lanzamientos" className={linkClasses("/lanzamientos")}>
            <Rocket size={18} className={iconColor("/lanzamientos")} />
            <span className="font-medium">Lanzamientos</span>
          </Link>

          <Link to="/favoritos" className={linkClasses("/favoritos")}>
            <Star size={18} className={iconColor("/favoritos")} />
            <span className="font-medium">Mis Favoritos</span>
          </Link>

          <Link to="/configuracion" className={linkClasses("/configuracion")}>
            <Settings size={18} className={iconColor("/configuracion")} />
            <span className="font-medium">Configuración</span>
          </Link>
        </nav>
      </div>

      
      <div className="text-xs text-purple-400/40 text-center pb-2">
         OrbitSpace© 2026 - Todos los derechos reservados
      </div>
    </aside>
  );
}

export default Sidebar;

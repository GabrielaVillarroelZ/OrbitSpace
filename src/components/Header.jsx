import React, { useState, useEffect } from 'react';
import { Menu } from "lucide-react";
import { obtenerDatosUsuario } from '../Servicios/api';

const Header = ({ onMenuClick }) => {
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

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0414]/90 backdrop-blur-xl border-b border-purple-500/20 px-6 flex items-center justify-between md:hidden">

            <button onClick={onMenuClick} className="p-2 -ml-2 text-purple-400 hover:text-fuchsia-400 transition-colors">
                <Menu size={28} />
            </button>

            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-700 border border-fuchsia-400/30 flex items-center justify-center text-[10px] font-bold shadow-[0_0_10px_rgba(217,70,239,0.3)] text-white">
                    {usuario.iniciales}
                </div>
                <span className="text-[11px] font-bold tracking-widest text-white/90 uppercase">
                    {usuario.nombre}
                </span>
            </div>

            <div className="text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
                OrbitSpace
            </div>

        </header>
    );
};

export default Header;
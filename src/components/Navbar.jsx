import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obtenerDatosUsuario, cerrarSesion } from "../Servicios/api";
import { User, LogOut } from "lucide-react";

function Navbar() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const datos = obtenerDatosUsuario();
        if (datos && localStorage.getItem('orbitToken')) {
            setUsuario(datos);
        }
    }, []);

    const handleLogout = () => {
        cerrarSesion();
    };

    return (
        <nav className="flex justify-between items-center p-6 bg-[#05010a]/50 backdrop-blur-md border-b border-purple-500/10">
            <h1 className="text-xl font-bold text-white">
                OrbitSpace
            </h1>

            <div className="flex items-center gap-4">
                {usuario ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
                            <User size={16} className="text-fuchsia-400" />
                            <span className="text-sm font-medium text-purple-100">
                                {usuario.nombre || usuario.name || "Comandante"}
                            </span>
                        </div>
                        
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold rounded-lg transition-all border border-red-500/20"
                        >
                            <LogOut size={16} />
                            Salir
                        </button>
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            Acceso
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
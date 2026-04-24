import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { Heart, X, Info, Radio, Zap } from 'lucide-react';
import { obtenerSatelites, obtenerFavoritos, toggleFavorito } from '../Servicios/api'; 

function Mapa() {
    const globeEl = useRef();
    const [selectedSat, setSelectedSat] = useState(null);
    const [favoritos, setFavoritos] = useState([]);
    const [satellites, setSatellites] = useState([]);

    const cargarDatos = async () => {
        try {
            const datos = await obtenerSatelites();
            if (!datos || !Array.isArray(datos)) return;

            const mapeados = datos.map(sat => ({
                id: sat.id || sat.satid || sat.vehiculo_id || Math.random(),
                lat: parseFloat(sat.lat || sat.satlat || sat.latitud || 0),
                lng: parseFloat(sat.lng || sat.satlng || sat.longitud || 0),
                name: sat.name || sat.satname || sat.nombre || 'Objeto Orbital',
                type: 'Satélite',
                estado: 'ACTIVO',
                speed: sat.speed || sat.satvelocity || '27,500 km/h', 
                alt: sat.alt || sat.satalt || '400 km',
                color: '#4ade80'
            }));
            
            setSatellites(mapeados);
        } catch (error) {
            console.error("Error al cargar satélites:", error);
        }
    };

    const cargarFavs = async () => {
        const favsDelServidor = await obtenerFavoritos();
        if (Array.isArray(favsDelServidor)) {
            setFavoritos(favsDelServidor);
        }
    };

    useEffect(() => {
        cargarDatos();
        cargarFavs();
        const interval = setInterval(cargarDatos, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (globeEl.current) {
                globeEl.current.controls().autoRotate = true;
                globeEl.current.controls().autoRotateSpeed = 0.5;
                globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2 });
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleToggleFavorite = async (sat) => {
        const idSatelite = sat.id || sat.vehiculo_id;
        const exito = await toggleFavorito(idSatelite);
        
        if (exito) {
            const esFavorito = favoritos.find(f => f.vehiculo_id === idSatelite || f.id === idSatelite);
            
            if (esFavorito) {
                setFavoritos(favoritos.filter(f => f.vehiculo_id !== idSatelite && f.id !== idSatelite));
            } else {
                setFavoritos([...favoritos, { id: idSatelite, vehiculo_id: idSatelite }]);
            }
        }
    };

    const isFav = (satId) => {
        return favoritos.find(f => f.id === satId || f.vehiculo_id === satId);
    };

    return (
        <div className="w-full h-screen bg-[#05010a] text-white flex flex-col p-4 md:p-8 pt-24 md:pl-24 relative overflow-hidden">
            
            <div className="mb-6 z-10">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                    Radar Orbital Terrestre 3D
                </h1>
                <p className="text-purple-300/70 text-sm mt-1">
                    {satellites.length > 0 ? `Señal establecida: ${satellites.length} activos` : 'Buscando satélites...'}
                </p>
            </div>

            <div className="flex-1 w-full rounded-3xl overflow-hidden border-2 border-purple-500/30 relative z-0">
                <Globe
                    ref={globeEl}
                    backgroundColor={'#0a0414'}
                    globeImageUrl={'//unpkg.com/three-globe/example/img/earth-dark.jpg'}
                    atmosphereColor={'#f472b6'}
                    atmosphereAltitude={0.15}
                    pointsData={satellites}
                    pointColor={d => d.color}
                    pointAltitude={0.1}
                    pointRadius={0.7}
                    onPointClick={(point) => {
                        setSelectedSat(point);
                        globeEl.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1 }, 1000);
                    }}
                    labelsData={satellites}
                    labelLat={d => d.lat}
                    labelLng={d => d.lng}
                    labelText={d => d.name}
                    labelColor={d => d.color}
                    labelSize={0.5}
                    labelDotRadius={0.4}
                />

                {selectedSat && (
                    <div className="absolute top-6 right-6 w-80 bg-[#1a0b36]/90 backdrop-blur-xl border border-purple-500/40 rounded-3xl p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-right-8">
                        <button onClick={() => setSelectedSat(null)} className="absolute top-4 right-4 text-purple-300 hover:text-white">
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-purple-500/20" style={{ color: selectedSat.color }}>
                                <Radio size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-white">{selectedSat.name}</h3>
                                <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">Telemetría Orbital</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-sm text-purple-300 flex items-center gap-2"><Zap size={14}/> Altitud</span>
                                <span className="text-sm font-mono text-white">{selectedSat.alt}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-sm text-purple-300 flex items-center gap-2"><Info size={14}/> GPS</span>
                                <span className="text-xs font-mono text-white">{selectedSat.lat.toFixed(2)}, {selectedSat.lng.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleToggleFavorite(selectedSat)}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                                isFav(selectedSat.id) ? 'bg-fuchsia-600 text-white' : 'bg-white/10 text-purple-200 border border-white/10'
                            }`}
                        >
                            <Heart size={20} fill={isFav(selectedSat.id) ? "white" : "none"} />
                            {isFav(selectedSat.id) ? 'En Favoritos' : 'Seguir Satélite'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Mapa;
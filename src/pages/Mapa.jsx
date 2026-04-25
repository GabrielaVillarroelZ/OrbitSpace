import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { Heart, X, Info, Radio, Zap } from 'lucide-react';
import { obtenerSatelites, obtenerFavoritos, toggleFavorito } from '../Servicios/api'; 

const GlobalStyles = () => (
  <style>{`
    @keyframes pulse-star { 0%, 100% { opacity: 0.1; transform: scale(0.8); } 50% { opacity: 0.8; transform: scale(1.1); } }
    .animate-pulse-star { animation: pulse-star 3s ease-in-out infinite; }
    .cursor-estrella { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="%23d946ef" stroke="%23fdf4ff" stroke-width="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>') 14 14, auto; }
    .cursor-estrella:active { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="%23f472b6" stroke="%23fdf4ff" stroke-width="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>') 11 11, grabbing; }
  `}</style>
);

function Mapa() {
    const globeEl = useRef();
    const [selectedSat, setSelectedSat] = useState(null);
    const [satellites, setSatellites] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const starsArray = Array.from({ length: 40 });

    const cargarDatos = async (l, n) => {
        const datos = await obtenerSatelites(l, n);
        if (Array.isArray(datos)) {
            setSatellites(datos.map(sat => ({
                id: sat.satid || sat.id || sat.vehiculo_id,
                lat: parseFloat(sat.lat || sat.latitud || 0),
                lng: parseFloat(sat.lng || sat.longitud || 0),
                name: sat.name || sat.nombre || 'Objeto Orbital',
                speed: sat.velocity || sat.speed || '27,500 km/h', 
                alt: sat.altitude || sat.alt || '400 km'
            })));
        }
    };

    const cargarFavs = async () => {
        const favsServer = await obtenerFavoritos();
        if (Array.isArray(favsServer)) setFavoritos(favsServer);
    };

    const isFav = (satId) => favoritos.some(f => String(f.id) === String(satId) || String(f.vehiculo_id) === String(satId));

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                cargarDatos(pos.coords.latitude, pos.coords.longitude);
                cargarFavs();
            }, () => {
                cargarDatos(41.38, 2.17);
                cargarFavs();
            });
        }
        const interval = setInterval(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => cargarDatos(pos.coords.latitude, pos.coords.longitude));
            }
            cargarFavs();
        }, 10000);
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
        const exito = await toggleFavorito(sat.id);
        if (exito) await cargarFavs();
    };

    return (
        <div className="w-full h-screen bg-[#05010a] text-white flex flex-col p-4 md:p-8 pt-24 md:pl-24 relative overflow-hidden">
            <GlobalStyles />
            
            <div className="absolute inset-0 z-0 pointer-events-none">
                {starsArray.map((_, i) => (
                    <div key={i} className="absolute bg-white rounded-full animate-pulse-star"
                        style={{
                            width: `${Math.random() * 3}px`, height: `${Math.random() * 3}px`,
                            top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`, animationDuration: `${Math.random() * 2 + 2}s`
                        }}
                    />
                ))}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-800/10 via-fuchsia-800/20 to-purple-800/10 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <div className="mb-6 z-10">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.3)]">Radar Orbital 3D</h1>
                <p className="text-purple-300/70 text-sm mt-1 uppercase tracking-widest font-mono">
                    {satellites.length > 0 ? `📡 Señal establecida: ${satellites.length} activos` : '⌛ Sincronizando...'}
                </p>
            </div>

            <div className="flex-1 w-full h-full rounded-3xl overflow-hidden border-2 border-purple-500/30 relative z-0 flex items-center justify-center bg-transparent cursor-estrella">
                <Globe
                    ref={globeEl}
                    backgroundColor={'rgba(0,0,0,0)'}
                    globeImageUrl={'//unpkg.com/three-globe/example/img/earth-dark.jpg'}
                    atmosphereColor={'#f472b6'}
                    atmosphereAltitude={0.15}
                    pointsData={satellites}
                    pointColor={d => isFav(d.id) ? '#d946ef' : '#4ade80'}
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
                    labelColor={d => isFav(d.id) ? '#d946ef' : '#4ade80'}
                    labelSize={0.5}
                />

                {selectedSat && (
                    <div className="absolute top-6 right-6 w-80 bg-[#1a0b36]/90 backdrop-blur-xl border border-purple-500/40 rounded-3xl p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-right-8">
                        <button onClick={() => setSelectedSat(null)} className="absolute top-4 right-4 text-purple-300 hover:text-white"><X size={20} /></button>
                        <h3 className="font-bold text-xl text-white mb-6 truncate">{selectedSat.name}</h3>
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
                        <button onClick={() => handleToggleFavorite(selectedSat)} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isFav(selectedSat.id) ? 'bg-fuchsia-600 text-white' : 'bg-white/10 text-purple-200 border border-white/10'}`}>
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
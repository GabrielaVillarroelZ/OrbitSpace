import { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { Heart, X, Info, Radio, Zap } from 'lucide-react';

function Mapa() {
    const globeEl = useRef();
    const [selectedSat, setSelectedSat] = useState(null);
    const [favoritos, setFavoritos] = useState([]);

    // 1️⃣ DATOS  DE SATÉLITES
    const [satellites] = useState([
        { id: 1, lat: 40.4168, lng: -3.7038, name: 'ISS (Zarya)', type: 'Estación Espacial', country: 'Internacional', speed: '27,600 km/h', alt: '408 km', color: '#f472b6' },
        { id: 2, lat: 51.5074, lng: -0.1278, name: 'Sentinel-1A', type: 'Radar/Clima', country: 'ESA', speed: '28,000 km/h', alt: '693 km', color: '#a855f7' },
        { id: 3, lat: 34.0522, lng: -118.2437, name: 'Hubble', type: 'Telescopio', country: 'NASA', speed: '27,300 km/h', alt: '547 km', color: '#4ade80' },
    ]);

    useEffect(() => {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.5;
        globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2 });
    }, []);

    // Función para añadir/quitar de favoritos
    const toggleFavorite = (sat) => {
        if (favoritos.find(f => f.id === sat.id)) {
            setFavoritos(favoritos.filter(f => f.id !== sat.id));
        } else {
            setFavoritos([...favoritos, sat]);
        }
    };

    return (
        <div className="w-full h-screen bg-[#05010a] text-white flex flex-col p-4 md:p-8 pt-24 md:pl-24 relative overflow-hidden">
            
            <div className="mb-6 z-10">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                    Radar Orbital Terrestre 3D
                </h1>
                <p className="text-purple-300/70 text-sm mt-1"> Haz clic en un satélite para ver su telemetría </p>
            </div>

            {/* CONTENEDOR DEL GLOBO */}
            <div className="flex-1 w-full rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] relative z-0">
                <Globe
                    ref={globeEl}
                    backgroundColor={'#0a0414'}
                    globeImageUrl={'//unpkg.com/three-globe/example/img/earth-dark.jpg'}
                    atmosphereColor={'#f472b6'}
                    atmosphereAltitude={0.15}
                    
                    pointsData={satellites}
                    pointColor={d => d.color}
                    pointAltitude={0.1}
                    pointRadius={0.6}
                    
                    // 2️⃣ DETECTAR CLIC EN EL PUNTO
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
                    labelAltitude={0.15}
                />

                {/* 3️⃣ PANEL DE DETALLES (Aparece al seleccionar un satélite) */}
                {selectedSat && (
                    <div className="absolute top-6 right-6 w-80 bg-[#1a0b36]/90 backdrop-blur-xl border border-purple-500/40 rounded-3xl p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-right-8 duration-300">
                        <button 
                            onClick={() => setSelectedSat(null)}
                            className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                                <Radio size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-white leading-none">{selectedSat.name}</h3>
                                <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">{selectedSat.type}</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-sm text-purple-300 flex items-center gap-2"><Zap size={14}/> Velocidad</span>
                                <span className="text-sm font-mono text-white">{selectedSat.speed}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-sm text-purple-300 flex items-center gap-2"><Info size={14}/> Altitud</span>
                                <span className="text-sm font-mono text-white">{selectedSat.alt}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => toggleFavorite(selectedSat)}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                                favoritos.find(f => f.id === selectedSat.id)
                                ? 'bg-fuchsia-600 text-white shadow-[0_0_20px_rgba(219,39,119,0.4)]'
                                : 'bg-white/10 text-purple-200 hover:bg-white/20 border border-white/10'
                            }`}
                        >
                            <Heart size={20} fill={favoritos.find(f => f.id === selectedSat.id) ? "white" : "none"} />
                            {favoritos.find(f => f.id === selectedSat.id) ? 'En Favoritos' : 'Añadir a Favoritos'}
                        </button>
                    </div>
                )}
            </div>
            
           
            <div className="absolute bottom-10 right-10 bg-purple-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/30 text-xs font-bold text-purple-200 z-10">
                🛰️ {favoritos.length} Satélites en seguimiento
            </div>
        </div>
    );
}

export default Mapa;
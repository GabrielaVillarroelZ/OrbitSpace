import { useState } from "react";
import { Link } from "react-router-dom";
import Login from "./Login";
import Logo from "./OrbitSpace-Logo.svg";
import { Rocket, Shield, Globe, X, Satellite, Sparkles, Play } from "lucide-react";
import Footer from "../components/Footer.jsx";
function Home() {
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const scrollToDemo = () => {
        const demoSection = document.getElementById("demo-video");
        demoSection?.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <div className="min-h-screen bg-[#05010a] text-white relative overflow-hidden font-sans flex flex-col">
            <div className="absolute inset-0 bg-estrellas opacity-40 pointer-events-none"></div>
            <div className="absolute top-[-15%] left-[-10%] w-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-fuchsia-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <nav className="w-full p-4 md:p-8 flex justify-center items-center z-10">
                <img src={Logo} alt="OrbitSpace Logo" 
                className="w-[200px] md:w-[350px] min-w-[200px] md:min-w-[350px] h-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,246,0.5)]" />
            </nav>

            <main className="flex flex-col items-center justify-center text-center px-4 pt-4 md:pt-6 pb-24 z-10 relative">
                <div className="-mt-8 md:-mt-12 mb-6 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-fuchsia-400/50 bg-[#1a0b36]/90 backdrop-blur-md shadow-[0_0_25px_rgba(217,70,239,0.25)] hover:border-fuchsia-300 transition-colors cursor-default">
                    <Sparkles size={18} className="text-fuchsia-300 animate-pulse" />
                    <span className="text-fuchsia-100 text-[13px] md:text-sm font-bold tracking-[0.2em] uppercase">
                        Bienvenidos a OrbitSpace
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight max-w-4xl">
                    Explora el <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Universo</span> en Tiempo Real
                </h1>

                <p className="text-lg md:text-xl text-purple-200/70 mb-10 max-w-2xl">
                    Accede a datos en vivo de misiones espaciales, sigue la trayectoria de los satélites y descubre los secretos de la órbita terrestre con nuestra plataforma interactiva.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                <button
                onClick={() => setMostrarLogin(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transform hover:-translate-y-1">
                    Acceso Privado
                </button>

                <button
                onClick={scrollToDemo}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-purple-500/50 hover:bg-purple-900/30 hover:border-purple-400 text-white rounded-full font-bold text-lg transition-all"
                >
                    Ver Demo
                </button>
                </div>
            </main>

            <section id="demo-video" className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center w-full">
                <p className="text-purple-300 font-medium uppercase tracking-widest mb-3 text-sm">Echa un vistazo</p>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white text-balance">Así funciona OrbitSpace</h2>

                <div className="relative aspect-video bg-[#1e103c]/40 backdrop-blur-xl border-4 border-purple-500/20 rounded-3xl p-6 shadow-2xl group hover:border-purple-500/50 transition-all duration-500 overflow-hidden">
                    <div className="w-full h-full bg-[#130927] rounded-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:scale-105 transition-transform duration-700">
                            <Satellite size={200} className="absolute -top-10 -right-20 text-purple-900" />
                            <Globe size={300} className="absolute -bottom-20 -left-40 text-fuchsia-900" />
                        </div>
                        
                        <button className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300">
                            <Play size={40} className="fill-white" />
                        </button>
                        
                        <p className="relative mt-8 text-xl font-bold text-purple-100">Reproducir Demo de Sistema</p>
                    </div>
                </div>
            </section>


            

            <section className="relative z-10 max-w-6xl mx-auto px-6 mt-32 pb-32 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                
                <div className="bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-8 rounded-3xl hover:border-purple-500/60 hover:-translate-y-2 transition-all duration-300 shadpw-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_15px_30px_rgba(168,85,247,0.15)] group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform">
                    <Satellite className="text-blue-400" size={32} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Telemetría en Vivo</h3>
                <p className="text-purple-200/70 leading-relaxed">
                    Sigue en tiempo real la posición, velocidad y estado de los satélites en órbita. Visualiza datos actualizados al instante y descubre el movimiento de los objetos espaciales.
                </p>
                </div>
                <div className="bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-8 rounded-3xl hover:border-fuchsia-500/60 hover:-translate-y-2 transition-all duration-300 shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_15px_30px_rgba(217,70,239,0.15)] group">
                <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-fuchsia-500/30 group-hover:scale-110 transition-transform">
                    <Rocket className="text-fuchsia-400" size={32} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Archivo de Misiones</h3>
                <p className="text-purple-200/70 leading-relaxed">
                    Accede a una base de datos cronológica detallada con planes de vuelo de próximos lanzamientos y misiones históricas.
                </p>
            
                </div>

                <div className="bg-[#1e103c]/40 backdrop-blur-xl border border-purple-500/20 p-8 rounded-3xl hover:border-purple-400/60 hover:-translate-y-2 transition-all duration-300 shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_15px_30px_rgba(168,85,247,0.2)] group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30 group-hover:scale-110 transition-transform">
                    <Sparkles className="text-purple-400" size={32} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Guía Estelar IA</h3>
                <p className="text-purple-200/70 leading-relaxed">
                    Descubre patrones orbitales y analiza riesgos de colisión interactuando directamente con nuestro asistente inteligente.
                </p>
                </div>


                
                </section>


            {mostrarLogin && (
                <Login onClose={() => setMostrarLogin(false)} />
            )}
            <Footer />
        </div>
    );
}

export default Home;
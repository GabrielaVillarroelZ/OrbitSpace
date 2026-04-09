import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Lanzamientos from './pages/Lanzamientos.jsx';
import Favoritos from './pages/Favoritos.jsx';
import Configuracion from './pages/Configuracion.jsx';
import Mapa from './pages/Mapa.jsx';
import Perfil from './pages/Perfil.jsx';
import Sidebar from './components/Sidebar.jsx';
import Assistant from './components/Assistant.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('orbitspace_auth') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const GlobalStyles = () => (
  <style>{`
    @keyframes pulse-star {
      0%, 100% { opacity: 0.1; transform: scale(0.8); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    .animate-pulse-star {
      animation: pulse-star 3s ease-in-out infinite;
    }
  `}</style>
);

function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem('performanceMode') || 'high');

  useEffect(() => {
    const handleModeChange = () => {
      setMode(localStorage.getItem('performanceMode') || 'high');
    };
    window.addEventListener('modeChange', handleModeChange);
    return () => window.removeEventListener('modeChange', handleModeChange);
  }, []);

  const starsArray = Array.from({ length: 40 });

  return (
    <div className="flex h-screen bg-[#05010a] text-white overflow-hidden relative">
      <GlobalStyles />

      {mode === 'high' && (
        <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000">
          {starsArray.map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white rounded-full animate-pulse-star"
              style={{
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`
              }}
            />
          ))}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-800/10 via-fuchsia-800/10 to-purple-800/10 rounded-full blur-[120px] opacity-40"></div>
        </div>
      )}

      <div className="md:hidden absolute top-0 left-0 right-0 z-50">
        <Header onMenuClick={() => setIsMenuOpen(true)} />
      </div>

      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-y-auto transition-all duration-500 ease-in-out md:ml-[310px] pt-20 md:pt-8 px-4 md:px-8 pb-8 custom-scrollbar relative z-10">
        <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col min-h-full">
          <main className="flex-1 pb-16">
            <Outlet />
          </main>
          
          <div className="mt-auto pt-10 border-t border-purple-500/10">
            <Footer />
          </div>
        </div>
      </div>
      
      <div className="relative z-50">
        <Assistant />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lanzamientos" element={<Lanzamientos />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
} 

export default App;

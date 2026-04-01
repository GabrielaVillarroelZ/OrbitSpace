import {BrowserRouter, Routes, Route, Outlet} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Lanzamientos from './pages/Lanzamientos.jsx';
import Sidebar from './components/Sidebar.jsx';
import Assistant from './components/Assistant.jsx';
import Favoritos from './pages/Favoritos.jsx';
import Configuracion from './pages/Configuracion.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

const MapaTemp = () => <div className="min-h-screen bg-[#05010a] text-white p-24 text-2xl font-bold"> Mapa Satelital (En Construcción) </div>

function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#05010a] overflow-x-hidden">
      <Header onMenuClick={() => setIsMenuOpen (true)} />

      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="flex-1 ml-0 md:ml-64 overflow-x-hidden transition-all duration-300 md:ml-64 pt-16 md:pt-0">
        <main className="flex-1">
        <Outlet />
        </main>

        <Footer />
      </div>
      <Assistant />
    </div>
  );
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lanzamientos" element={<Lanzamientos />} />
          <Route path="/mapa" element={<MapaTemp />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
} 

export default App;

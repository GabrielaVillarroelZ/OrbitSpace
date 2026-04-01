import React from 'react';

const Footer = () => (
    <footer className="w-full py-10 mt-12 border-t border-purple-500/10 bg-[#05010a]/80 backdrop-blur-md text-center">
        <div className="max-w-6xl mx-auto px-6">
            <p className="text-purple-300/40 text-[10px] uppercase tracking-[0.2em] mb-4">
            © 2026 OrbitSpace Control Systems. Todos los derechos reservados.
            </p>
            <div className="flex justify-center gap-6 text-[10px] text-fuchsia-400/60 font-bold uppercase tracking-widest">
            
                <a href="#" className="hover:text-fuchsia-300 transition-colors">Contacto</a>
                <a href="#" className="hover:text-fuchsia-300 transition-colors">Términos de Uso</a>
                <a href="#" className="hover:text-fuchsia-300 transition-colors">Política de Privacidad</a>
            </div>
        </div>
    </footer>
);

export default Footer;
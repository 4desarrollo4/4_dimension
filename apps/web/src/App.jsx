import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import HomePage from './pages/HomePage';
import CalzadoPage from './pages/CalzadoPage';
import RopaPage from './pages/RopaPage';
import DotacionesPage from './pages/DotacionesPage';
import InsumosPage from './pages/InsumosPage';
import NosotrosPage from './pages/NosotrosPage';
import ContactoPage from './pages/ContactoPage';

function AnimatedRoutes() {
    const location = useLocation();
    return (
        // Quién se salta la primera animación es PageTransition, no esto:
        // `initial={false}` aquí lo heredarían también los Reveal y se perderían
        // las entradas al hacer scroll.
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/calzado" element={<CalzadoPage />} />
                <Route path="/ropa" element={<RopaPage />} />
                <Route path="/dotaciones" element={<DotacionesPage />} />
                <Route path="/insumos" element={<InsumosPage />} />
                <Route path="/nosotros" element={<NosotrosPage />} />
                <Route path="/contacto" element={<ContactoPage />} />
            </Routes>
        </AnimatePresence>
    );
}

// El Router NO vive aquí: lo pone cada entrada. `main.jsx` usa BrowserRouter y
// `entry-server.jsx` usa StaticRouter, que es lo que permite prerenderizar las
// 7 rutas en el build (docs/06-backlog.md → P0-04).
function App() {
    return (
        <>
            <ScrollToTop />
            <a href="#contenido" className="skip-link">
                Saltar al contenido
            </a>
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                <main id="contenido">
                    <AnimatedRoutes />
                </main>
                <Footer />
                <WhatsAppFab />
            </div>
        </>
    );
}

export default App;

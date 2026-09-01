import React from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CalzadoPage from './pages/CalzadoPage';
import RopaPage from './pages/RopaPage';
import DotacionesPage from './pages/DotacionesPage';
import NosotrosPage from './pages/NosotrosPage';
import ContactoPage from './pages/ContactoPage';

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/calzado" element={<CalzadoPage />} />
                <Route path="/ropa" element={<RopaPage />} />
                <Route path="/dotaciones" element={<DotacionesPage />} />
                <Route path="/nosotros" element={<NosotrosPage />} />
                <Route path="/contacto" element={<ContactoPage />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                <AnimatedRoutes />
                <Footer />
            </div>
        </Router>
    );
}

export default App;

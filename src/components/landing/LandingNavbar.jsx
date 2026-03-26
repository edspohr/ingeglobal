import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

export default function LandingNavbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-[#0A0F18]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* Left — Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo_full.jpg" alt="Ingeglobal logo" className="h-9 rounded object-contain" />
          <span className="text-white font-bold tracking-widest text-sm uppercase">INGEGLOBAL</span>
        </div>

        {/* Center — Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="text-gray-400 hover:text-brand-gold transition-colors duration-200 text-sm"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right — Acceder button (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="hidden md:flex items-center gap-2 border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-black px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
          >
            <LogIn className="w-5 h-5" />
            Acceder
          </button>

          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0F18]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="text-gray-400 hover:text-brand-gold transition-colors duration-200 text-sm py-1"
            >
              {label}
            </a>
          ))}
          <button
            onClick={() => { setMobileOpen(false); navigate('/login'); }}
            className="flex items-center justify-center gap-2 border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-black px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 mt-2"
          >
            <LogIn className="w-5 h-5" />
            Acceder
          </button>
        </div>
      )}
    </nav>
  );
}

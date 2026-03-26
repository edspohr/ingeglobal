import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const SERVICE_LINKS = [
  'Escáner Láser 3D',
  'Topografía Clásica',
  'Fotogrametría',
  'GPS de Alta Precisión',
  'Cálculo de Volúmenes',
];

export default function LandingFooter() {
  return (
    <footer className="bg-[#050914] border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Col 1: Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo_full.jpg" alt="Ingeglobal logo" className="h-8 rounded object-contain" />
            <span className="text-white font-bold tracking-widest text-sm uppercase">INGEGLOBAL</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Tecnología de precisión al servicio de la industria.
          </p>
          <p className="text-gray-600 text-xs mt-6">
            © 2024 Ingeglobal. Todos los derechos reservados.
          </p>
        </div>

        {/* Col 2: Services */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Servicios</h4>
          <ul className="flex flex-col gap-2">
            {SERVICE_LINKS.map((name) => (
              <li key={name}>
                <a
                  href="#servicios"
                  className="text-gray-400 hover:text-brand-gold text-sm transition-colors"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Platform */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Plataforma</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                to="/login"
                className="text-brand-gold hover:text-yellow-300 text-sm transition-colors font-semibold"
              >
                Acceder a la Plataforma
              </Link>
            </li>
            <li>
              <a
                href="#contacto"
                className="text-gray-400 hover:text-brand-gold text-sm transition-colors"
              >
                Solicitar Demo
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 text-xs">
          Ingeglobal Platform — Sistema de Gestión Operacional
        </p>
        <div className="flex items-center gap-4">
          <a href="mailto:info@ingeglobal.cl" aria-label="Email" className="text-gray-500 hover:text-brand-gold transition-colors">
            <Mail className="w-5 h-5" />
          </a>
          <a href="tel:+56981586984" aria-label="Teléfono" className="text-gray-500 hover:text-brand-gold transition-colors">
            <Phone className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}


import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/logo';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
         
            <div className="flex items-center gap-3 mb-4">
              <Logo size="sm" withText />
            </div>
            <h3 className="text-xl font-bold mb-4">Plataforma AltarHub</h3>
           

            <p className="text-gray-400">
              A solução completa para gestão da sua igreja.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
              <li><Link to="/library" className="text-gray-400 hover:text-white">Biblioteca</Link></li>
              <li><Link to="/calendar" className="text-gray-400 hover:text-white">Agenda</Link></li>
              <li><Link to="/finance" className="text-gray-400 hover:text-white">Ofertar</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <p className="text-gray-400">
              contato@imw.com<br />
              (11) 1234-5678
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 text-center text-gray-400">
          <p>&copy; 2025 Plataforma <span className="font-bold text-church-red">AltarHub</span>. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

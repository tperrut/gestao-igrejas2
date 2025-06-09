
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
     {/*          <li><Link to="https://x.com/tperrut" className="text-gray-400 hover:text-white">X</Link></li>
              <li><Link to="/library" className="text-gray-400 hover:text-white">Instagram</Link></li>
 */}              <li><Link to="https://linkedin.com/tperrut" className="text-gray-400 hover:text-white"> <svg
      mlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"x
    >
      <path d="M19 0h-14c-2.761...z" /> {/* Pode colar o path completo do LinkedIn */}
    </svg>Linkedin</Link></li>
              <li><Link to="https://perrutinho-resume.lovable.app" className="text-gray-400 hover:text-white">Resume</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <p className="text-gray-400">
              thi.perrut@gmail.com.com<br />
              (21) 98511-0076
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

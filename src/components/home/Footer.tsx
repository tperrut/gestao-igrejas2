
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
            <h3 className="text-xl font-bold mb-4">Plataforma BetelHub</h3>
            <p className="text-gray-400">
              A solução completa para gestão da sua igreja.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="https://linkedin.com/in/tperrut" className="text-gray-400 hover:text-white flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn
                </Link>
              </li>
              <li><Link to="https://perrutinho-resume.lovable.app" className="text-gray-400 hover:text-white">Resume</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <p className="text-gray-400">
              thi.perrut@gmail.com<br />
              (21) 98511-0076
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 text-center text-gray-400">
          <p>&copy; 2025 Plataforma <span className="font-bold text-church-red">BetelHub</span>. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

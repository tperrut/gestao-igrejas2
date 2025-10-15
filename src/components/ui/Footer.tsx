import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ChevronUp, ChevronDown } from 'lucide-react';

const Footer: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <footer className={`bg-gray-800 text-white transition-all duration-300 ${expanded ? 'py-8' : 'py-2'} mt-auto`}>
      <div className="container mx-auto px-4">
        {/* Botão de expandir/recolher */}
        <div className="flex justify-center mb-2">
          <button
            aria-label={expanded ? 'Recolher rodapé' : 'Expandir rodapé'}
            onClick={() => setExpanded((e) => !e)}
            className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors flex items-center gap-2"
          >
            {expanded ? (
              <>
                <ChevronDown className="h-5 w-5 transition-transform" />
                <span className="hidden sm:inline">Recolher</span>
              </>
            ) : (
              <>
                <ChevronUp className="h-5 w-5 transition-transform" />
                <span className="hidden sm:inline">Expandir</span>
              </>
            )}
          </button>
        </div>

        {/* Conteúdo do footer */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo e Nome */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://images.seeklogo.com/logo-png/27/1/imw-igreja-metodista-wesleyana-logo-png_seeklogo-275760.png?v=1962823770704272104" 
                  alt="Igreja Metodista Wesleyana Logo" 
                  className="h-10 w-auto" 
                />
                <span className="hidden font-montserrat font-bold text-xl text-white sm:inline-block">
                  Igreja Metodista Wesleyana
                </span>
                <span className="font-montserrat font-bold text-xl text-white sm:hidden">
                  IMW
                </span>
              </div>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(21) 2719-3106</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>imwcentraldeniteroi@gmail.com</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1" />
                  <div>
                    <p>Rua Barão do Amazonas, 207</p>
                    <p>Centro, Niterói - RJ</p>
                    <p>CEP: 24030-111</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horários */}
            <div>
              <h3 className="text-lg font-bold mb-4">Nossas Reuniões</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 font-semibold">
                    <Clock className="h-4 w-4" />
                    <span>Quintas:</span>
                  </div>
                  <p className="ml-6">Culto da Benção - 19:30h</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold">
                    <Clock className="h-4 w-4" />
                    <span>Domingos:</span>
                  </div>
                  <p className="ml-6">Escola Bíblica Dominical - 9h</p>
                  <p className="ml-6">Culto de Celebração - 18h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 mt-8 text-center text-gray-400">
          <p>&copy; 2025 Igreja Metodista Wesleyana. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

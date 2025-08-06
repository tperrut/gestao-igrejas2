
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-church-blue to-blue-600 opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Logo size="lg" withText />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-church-blue to-church-red text-transparent bg-clip-text font-bold">Plataforma</span> <span className="bg-gradient-to-r from-church-red to-amber-400 text-transparent bg-clip-text font-bold">AltarHub</span>, a gestão da sua igreja 100% Online!
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300">
            A plataforma completa para gestão da sua igreja. Integre membros, recursos e atividades em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/commercial-contact">
              <Button 
                size="lg" 
                className="bg-church-blue text-white hover:bg-church-blue/90"
                aria-label="Entrar em contato para demonstração comercial da plataforma"
              >
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

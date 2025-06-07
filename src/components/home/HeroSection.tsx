
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-church-blue py-16 md:py-24">
      <div className="container mx-auto px-4 relative z-10 text-white">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Logo size="lg" withText />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text font-bold">Plataforma</span> <span className="bg-gradient-to-r from-church-red to-amber-400 text-transparent bg-clip-text font-bold">AltarHub</span>, a gestão da sua igreja 100% Online!
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-8">
            A plataforma completa para gestão da sua igreja. Integre membros, recursos e atividades em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* <Link to="/dashboard">
              <Button size="lg" className="bg-white text-church-blue hover:bg-gray-100">
                Acessar Sistema
              </Button>
            </Link> */}
            <Link to="/contact">
              <Button size="lg" className="bg-white text-church-blue hover:bg-orange-100">
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-church-blue-dark to-church-blue opacity-90"></div>
    </section>
  );
};

export default HeroSection;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-church-red text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Pronto para transformar a gestão da sua igreja?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Junte-se a centenas de igrejas que estão usando a <span className="font-bold text-yellow-200">Plataforma AltarHub</span> para simplificar sua administração.
        </p>
        <Link to="/commercial-contact">
          <Button 
            size="lg" 
            className="bg-white text-church-red hover:bg-gray-100"
            aria-label="Começar agora - entrar em contato comercial para demonstração"
          >
            Começar Agora
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;

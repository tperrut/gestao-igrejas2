
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-bold text-church-blue">404</h1>
        <h2 className="text-2xl font-semibold">Página não encontrada</h2>
        <p className="text-muted-foreground">
          A página que você está procurando não existe ou foi movida para outro local.
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button className="btn-primary">
              Voltar para a Página Inicial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

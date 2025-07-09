
import React from 'react';
import LoanManagement from '@/components/library/LoanManagement';
import { Button } from '@/components/ui/button';

const Loans: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empréstimos</h1>
          <p className="text-muted-foreground">
            Gerenciamento de empréstimos e devoluções de livros.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.href = '/library'}>
          Voltar para Biblioteca
        </Button>
      </div>
      
      <LoanManagement />
    </div>
  );
};

export default Loans;

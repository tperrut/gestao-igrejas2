
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface BookFilterHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddBook: () => void;
}

const BookFilterHeader: React.FC<BookFilterHeaderProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onAddBook 
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row justify-between">
      <div className="w-full md:w-1/3">
        <Input
          placeholder="Pesquisar livros por título, autor ou categoria..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="default" className="btn-primary" onClick={onAddBook}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Novo Livro
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/loans'}>
          Gerenciar Empréstimos
        </Button>
      </div>
    </div>
  );
};

export default BookFilterHeader;

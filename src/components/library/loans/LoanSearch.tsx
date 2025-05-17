
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface LoanSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const LoanSearch: React.FC<LoanSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-full sm:w-auto flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por livro ou pessoa..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default LoanSearch;

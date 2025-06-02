
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface MembersFilterProps {
  searchName: string;
  onSearchNameChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
}

const MembersFilter: React.FC<MembersFilterProps> = ({
  searchName,
  onSearchNameChange,
  roleFilter,
  onRoleFilterChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={searchName}
          onChange={(e) => onSearchNameChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={roleFilter} onValueChange={onRoleFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Filtrar por função" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as funções</SelectItem>
          <SelectItem value="pastor">Pastor</SelectItem>
          <SelectItem value="lider">Líder</SelectItem>
          <SelectItem value="diacono">Diácono</SelectItem>
          <SelectItem value="membro">Membro</SelectItem>
          <SelectItem value="visitante">Visitante</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MembersFilter;

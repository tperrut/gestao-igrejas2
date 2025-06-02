
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Filter } from 'lucide-react';

interface EventsFilterProps {
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  viewMode: string;
  onViewModeChange: (value: string) => void;
}

const EventsFilter: React.FC<EventsFilterProps> = ({
  typeFilter,
  onTypeFilterChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-2 flex-1">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select value={viewMode} onValueChange={onViewModeChange}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Visualização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="day">Por Dia</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mês</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2 flex-1">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="culto">Culto</SelectItem>
            <SelectItem value="reuniao">Reunião</SelectItem>
            <SelectItem value="conferencia">Conferência</SelectItem>
            <SelectItem value="treinamento">Treinamento</SelectItem>
            <SelectItem value="social">Social</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EventsFilter;

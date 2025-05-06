
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'culto' | 'reuniao' | 'conferencia' | 'treinamento' | 'social';
  organizer: string;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Culto de Domingo',
    date: '14/05/2023',
    time: '10:00 - 12:00',
    location: 'Auditório Principal',
    type: 'culto',
    organizer: 'Pastor João'
  },
  {
    id: 2,
    title: 'Reunião de Líderes',
    date: '16/05/2023',
    time: '19:00 - 21:00',
    location: 'Sala 103',
    type: 'reuniao',
    organizer: 'Pastor João'
  },
  {
    id: 3,
    title: 'Conferência de Louvor',
    date: '20/05/2023',
    time: '15:00 - 21:00',
    location: 'Auditório Principal',
    type: 'conferencia',
    organizer: 'Ministério de Louvor'
  },
  {
    id: 4,
    title: 'Treinamento de Novos Membros',
    date: '25/05/2023',
    time: '14:00 - 16:00',
    location: 'Sala 102',
    type: 'treinamento',
    organizer: 'Diác. Marina'
  },
  {
    id: 5,
    title: 'Café & Comunhão',
    date: '28/05/2023',
    time: '09:00 - 10:00',
    location: 'Área Externa',
    type: 'social',
    organizer: 'Ministério de Integração'
  },
];

const getTypeLabel = (type: Event['type']) => {
  const labels = {
    culto: 'Culto',
    reuniao: 'Reunião',
    conferencia: 'Conferência',
    treinamento: 'Treinamento',
    social: 'Social'
  };
  return labels[type];
};

const getTypeBadgeVariant = (type: Event['type']): "default" | "secondary" | "destructive" | "outline" => {
  const variants = {
    culto: 'default',
    reuniao: 'secondary',
    conferencia: 'destructive',
    treinamento: 'outline',
    social: 'secondary'
  };
  return variants[type] as "default" | "secondary" | "destructive" | "outline";
};

const EventsCompactList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events] = useState<Event[]>(mockEvents);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-full sm:w-[250px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1 w-full sm:w-auto">
              <Filter className="h-4 w-4" />
              <span>Filtrar por tipo</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Todos</DropdownMenuItem>
            <DropdownMenuItem>Cultos</DropdownMenuItem>
            <DropdownMenuItem>Reuniões</DropdownMenuItem>
            <DropdownMenuItem>Conferências</DropdownMenuItem>
            <DropdownMenuItem>Treinamentos</DropdownMenuItem>
            <DropdownMenuItem>Eventos Sociais</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Organizador</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.time}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <Badge variant={getTypeBadgeVariant(event.type)}>
                    {getTypeLabel(event.type)}
                  </Badge>
                </TableCell>
                <TableCell>{event.organizer}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum evento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventsCompactList;


import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MoreHorizontal, 
  Search, 
  ArrowUpDown, 
  ChevronDown, 
  Filter 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type EventType = 'culto' | 'reuniao' | 'conferencia' | 'treinamento' | 'social';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  organizer: string;
  capacity: number;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Culto de Domingo',
    date: '12/05/2023',
    time: '10:00 - 12:00',
    location: 'Auditório Principal',
    type: 'culto',
    organizer: 'Pastor João',
    capacity: 200
  },
  {
    id: 2,
    title: 'Reunião de Líderes',
    date: '15/05/2023',
    time: '19:00 - 21:00',
    location: 'Sala 103',
    type: 'reuniao',
    organizer: 'Pastor João',
    capacity: 30
  },
  {
    id: 3,
    title: 'Conferência de Louvor',
    date: '20/05/2023',
    time: '15:00 - 21:00',
    location: 'Auditório Principal',
    type: 'conferencia',
    organizer: 'Ministério de Louvor',
    capacity: 150
  },
  {
    id: 4,
    title: 'Treinamento de Novos Membros',
    date: '25/05/2023',
    time: '14:00 - 16:00',
    location: 'Sala 102',
    type: 'treinamento',
    organizer: 'Diác. Marina',
    capacity: 40
  },
  {
    id: 5,
    title: 'Café & Comunhão',
    date: '28/05/2023',
    time: '09:00 - 10:00',
    location: 'Área Externa',
    type: 'social',
    organizer: 'Ministério de Integração',
    capacity: 100
  },
];

const getTypeLabel = (type: EventType) => {
  const labels = {
    culto: 'Culto',
    reuniao: 'Reunião',
    conferencia: 'Conferência',
    treinamento: 'Treinamento',
    social: 'Social'
  };
  return labels[type];
};

const getTypeBadgeVariant = (type: EventType): "default" | "secondary" | "destructive" | "outline" => {
  const variants = {
    culto: 'default',
    reuniao: 'secondary',
    conferencia: 'destructive',
    treinamento: 'outline',
    social: 'secondary'
  };
  return variants[type] as "default" | "secondary" | "destructive" | "outline";
};

const EventsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-[150px] sm:w-[250px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
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
            <TableHead className="w-[250px]">
              <div className="flex items-center gap-1">
                Título
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Organizador</TableHead>
            <TableHead>Capacidade</TableHead>
            <TableHead className="w-[50px]"></TableHead>
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
                <TableCell>{event.capacity}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Cancelar Evento
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhum evento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventsList;

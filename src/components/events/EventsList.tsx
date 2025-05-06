
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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
  description?: string;
}

// Mock data for event list
const mockEvents: Event[] = [
  {
    id: 1,
    title: "Culto de Domingo",
    date: "2023-05-07",
    time: "10:00 - 12:00",
    location: "Auditório Principal",
    type: "culto",
    organizer: "Pastor João",
    capacity: 200,
    description: "Culto dominical com louvor e pregação."
  },
  {
    id: 2,
    title: "Reunião de Líderes",
    date: "2023-05-10",
    time: "19:30 - 21:00",
    location: "Sala de Reuniões",
    type: "reuniao",
    organizer: "Pastor Carlos",
    capacity: 30,
    description: "Reunião mensal dos líderes de ministério."
  },
  {
    id: 3,
    title: "Conferência de Jovens",
    date: "2023-05-20",
    time: "16:00 - 22:00",
    location: "Auditório Principal",
    type: "conferencia",
    organizer: "Ministério de Jovens",
    capacity: 150,
    description: "Conferência anual para jovens com palestrantes convidados."
  },
  {
    id: 4,
    title: "Treinamento de Novos Membros",
    date: "2023-05-14",
    time: "09:00 - 12:00",
    location: "Sala 3",
    type: "treinamento",
    organizer: "Equipe de Integração",
    capacity: 40,
    description: "Treinamento para integração de novos membros à igreja."
  }
];

const getEventTypeBadge = (type: EventType) => {
  const styles = {
    culto: "bg-blue-500 hover:bg-blue-600",
    reuniao: "bg-green-500 hover:bg-green-600",
    conferencia: "bg-purple-500 hover:bg-purple-600",
    treinamento: "bg-amber-500 hover:bg-amber-600",
    social: "bg-pink-500 hover:bg-pink-600"
  };

  const labels = {
    culto: "Culto",
    reuniao: "Reunião",
    conferencia: "Conferência",
    treinamento: "Treinamento",
    social: "Social"
  };

  return (
    <Badge className={styles[type]}>{labels[type]}</Badge>
  );
};

interface EventsListProps {
  onEdit?: (event: Event) => void;
}

const EventsList: React.FC<EventsListProps> = ({ onEdit }) => {
  const { toast } = useToast();

  const handleDelete = (eventId: number) => {
    toast({
      title: "Evento removido",
      description: "O evento foi removido com sucesso."
    });
  };

  const handleView = (eventId: number) => {
    toast({
      title: "Visualizar detalhes",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Título</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Organizador</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>{new Date(event.date).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>{event.time}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                {getEventTypeBadge(event.type)}
              </TableCell>
              <TableCell>{event.organizer}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(event.id)}>
                      <Eye className="mr-2 h-4 w-4" /> Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit && onEdit(event)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600" 
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventsList;

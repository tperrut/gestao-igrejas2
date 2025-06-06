
import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Event } from '@/types/libraryTypes';
import { supabase } from '@/integrations/supabase/client';
import EventViewModal from './EventViewModal';
import { useAuth } from '@/contexts/AuthContext';

type EventType = 'culto' | 'reuniao' | 'conferencia' | 'treinamento' | 'social';

const getEventTypeBadge = (type: string) => {
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
    <Badge className={styles[type as keyof typeof styles] || "bg-gray-500"}>
      {labels[type as keyof typeof labels] || type}
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  // O banco de dados retorna datas no formato YYYY-MM-DD
  // Vamos criar a data corretamente para evitar problemas de timezone
  const dateParts = dateString.split('-');
  const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
  return date.toLocaleDateString('pt-BR');
};

interface EventsListProps {
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}

const EventsList: React.FC<EventsListProps> = ({ onEdit, onDelete }) => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState<'today' | 'day' | 'week' | 'month'>('month');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        setEvents(data as Event[]);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar eventos",
        description: "Ocorreu um erro ao buscar os eventos.",
        variant: "destructive"
      });
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    let filtered = events;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Filtro por período
    switch (viewFilter) {
      case 'today':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date + 'T00:00:00');
          return eventDate.toDateString() === today.toDateString();
        });
        break;
      case 'day':
        // Para "day", mostramos eventos do dia atual + próximos 7 dias
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date + 'T00:00:00');
          return eventDate >= today && eventDate <= nextWeek;
        });
        break;
      case 'week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date + 'T00:00:00');
          return eventDate >= startOfWeek && eventDate <= endOfWeek;
        });
        break;
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date + 'T00:00:00');
          return eventDate >= startOfMonth && eventDate <= endOfMonth;
        });
        break;
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    return filtered;
  };

  const handleView = (event: Event) => {
    setViewingEvent(event);
    setIsViewModalOpen(true);
  };

  const filteredEvents = getFilteredEvents();

  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <p>Carregando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={viewFilter} onValueChange={(value: any) => setViewFilter(value)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="day">Próximos 7 dias</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
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

        {filteredEvents.length === 0 ? (
          <div className="rounded-md border">
            <div className="p-8 text-center">
              <p>Nenhum evento encontrado para os filtros selecionados.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
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
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{formatDate(event.date)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleView(event)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                          </DropdownMenuItem>
                          {isAdmin() && (
                            <>
                              <DropdownMenuItem onClick={() => onEdit && onEdit(event)}>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => onDelete && onDelete(event)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <EventViewModal
        isOpen={isViewModalOpen}
        onClose={setIsViewModalOpen}
        event={viewingEvent}
      />
    </>
  );
};

export default EventsList;

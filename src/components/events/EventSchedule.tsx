import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CalendarIcon, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import EventModal from './EventModal';

export type EventType = 'culto' | 'reuniao' | 'conferencia' | 'treinamento' | 'social';

interface ScheduledEvent {
  id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  type: EventType;
  status: 'confirmado' | 'pendente' | 'cancelado';
}

// Dados de exemplo para eventos
const mockEvents: ScheduledEvent[] = [
  {
    id: 1,
    title: "Culto de Domingo",
    date: new Date(2023, 4, 7),
    time: "10:00 - 12:00",
    location: "Auditório Principal",
    type: "culto",
    status: "confirmado"
  },
  {
    id: 2,
    title: "Reunião de Líderes",
    date: new Date(2023, 4, 10),
    time: "19:30 - 21:00",
    location: "Sala de Reuniões",
    type: "reuniao",
    status: "confirmado"
  },
  {
    id: 3,
    title: "Conferência Jovem",
    date: new Date(2023, 4, 20),
    time: "15:00 - 18:00",
    location: "Auditório Principal",
    type: "conferencia",
    status: "pendente"
  }
];

const getEventTypeColor = (type: EventType): string => {
  const colors = {
    culto: "bg-blue-100 text-blue-800",
    reuniao: "bg-green-100 text-green-800",
    conferencia: "bg-purple-100 text-purple-800",
    treinamento: "bg-amber-100 text-amber-800",
    social: "bg-pink-100 text-pink-800"
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

const getStatusColor = (status: string): string => {
  const colors = {
    confirmado: "bg-green-100 text-green-800",
    pendente: "bg-amber-100 text-amber-800",
    cancelado: "bg-red-100 text-red-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const EventSchedule: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [events] = useState<ScheduledEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtra eventos pela data selecionada
  const selectedDayEvents = date ? events.filter(event => 
    event.date.getDate() === date.getDate() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getFullYear() === date.getFullYear()
  ) : [];

  const handleScheduleEvent = () => {
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: any) => {
    toast({
      title: "Evento agendado",
      description: "O evento foi agendado com sucesso."
    });
    setIsModalOpen(false);
  };

  // Função para marcar dias com eventos no calendário
  const isDayWithEvent = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agendamento</h1>
          <p className="text-muted-foreground">
            Visualize e agende eventos no calendário da igreja.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agendar Novo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
              <CardDescription>
                Selecione uma data para visualizar os eventos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={ptBR}
                  className="rounded-md border pointer-events-auto"
                  modifiers={{
                    hasEvent: isDayWithEvent
                  }}
                  modifiersClassNames={{
                    hasEvent: "bg-primary/10 font-bold"
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Selecionada</CardTitle>
                <CardDescription>
                  {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Nenhuma data selecionada"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {selectedDayEvents.length === 0 
                    ? "Não há eventos agendados para esta data." 
                    : `${selectedDayEvents.length} evento(s) agendado(s).`}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Eventos do Dia</CardTitle>
                <CardDescription>
                  {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length === 0 ? (
                <div className="py-8 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">Sem eventos</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Não há eventos agendados para esta data.
                  </p>
                  <Button onClick={() => setIsModalOpen(true)} variant="outline" className="mt-4">
                    Agendar Evento
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className={`h-2 ${getEventTypeColor(event.type).split(' ')[0]}`} />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{event.title}</CardTitle>
                          <Badge className={cn("ml-2", getStatusColor(event.status))}>
                            {event.status}
                          </Badge>
                        </div>
                        <CardDescription>{event.time} • {event.location}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2 pb-4">
                        <div className="flex items-center justify-between w-full">
                          <Badge variant="outline" className={cn(getEventTypeColor(event.type))}>
                            {event.type === 'culto' ? 'Culto' : 
                              event.type === 'reuniao' ? 'Reunião' :
                              event.type === 'conferencia' ? 'Conferência' :
                              event.type === 'treinamento' ? 'Treinamento' : 'Social'}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Detalhes</Button>
                            <Button size="sm">Editar</Button>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
          toast({
            title: "Evento agendado",
            description: "O evento foi agendado com sucesso."
          });
          setIsModalOpen(false);
        }}
        title="Agendar Novo Evento"
      />
    </div>
  );
};

export default EventSchedule;

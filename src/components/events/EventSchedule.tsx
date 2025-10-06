
import React, { useState, useEffect } from 'react';
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
import { useToast } from "@/hooks/use-toast";
import EventModal from './EventModal';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/libraryTypes';
import { getDefaultTenantId } from '@/utils/tenant';

const EventSchedule: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar eventos:', error);
        throw error;
      }

      console.log('Eventos carregados no calendário:', data);

      const formattedEvents: Event[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        type: event.type,
        organizer: event.organizer,
        capacity: event.capacity,
        image_url: event.image_url,
        created_at: event.created_at,
        updated_at: event.updated_at
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar a lista de eventos.",
        variant: "destructive",
      });
    }
  };

  // Filtra eventos pela data selecionada - corrigindo comparação de datas
  const selectedDayEvents = date ? events.filter(event => {
    // Converter a data do evento diretamente (já está no formato YYYY-MM-DD)
    const eventDateString = event.date;
    const selectedDateString = format(date, 'yyyy-MM-dd');
    return eventDateString === selectedDateString;
  }) : [];

  const handleCreateEvent = () => {
    console.log('Abrindo modal para criar evento no calendário');
    setMode('create');
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    console.log('Editando evento:', event);
    setMode('edit');
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Salvando evento no calendário:', eventData);
      
      // Validação dos dados obrigatórios
      if (!eventData.title || !eventData.date || !eventData.time || !eventData.location || !eventData.type || !eventData.organizer) {
        toast({
          title: "Dados incompletos",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      // Validação da capacidade
      const capacity = Number(eventData.capacity);
      if (isNaN(capacity) || capacity <= 0) {
        toast({
          title: "Capacidade inválida",
          description: "A capacidade deve ser um número maior que zero.",
          variant: "destructive",
        });
        return;
      }
      
      if (mode === 'create') {
        const insertData = {
          title: eventData.title.trim(),
          description: eventData.description?.trim() || null,
          date: eventData.date,
          time: eventData.time.trim(),
          location: eventData.location.trim(),
          type: eventData.type,
          organizer: eventData.organizer.trim(),
          capacity: capacity,
          image_url: eventData.image_url || null,
          tenant_id: getDefaultTenantId(),
        };

        console.log('Dados para inserção no calendário:', insertData);

        const { data, error } = await supabase
          .from('events')
          .insert([insertData])
          .select();

        if (error) {
          console.error('Erro do Supabase ao criar evento:', error);
          throw error;
        }
        
        console.log('Evento criado com sucesso no calendário:', data);
        
        if (data && data[0]) {
          const newEvent: Event = {
            id: data[0].id,
            title: data[0].title,
            description: data[0].description,
            date: data[0].date,
            time: data[0].time,
            location: data[0].location,
            type: data[0].type,
            organizer: data[0].organizer,
            capacity: data[0].capacity,
            image_url: data[0].image_url,
            created_at: data[0].created_at,
            updated_at: data[0].updated_at
          };
          
          setEvents([...events, newEvent]);
          toast({
            title: "Evento criado",
            description: `O evento ${eventData.title} foi criado com sucesso.`,
          });
        }
      } else if (mode === 'edit' && selectedEvent) {
        const updateData = {
          title: eventData.title.trim(),
          description: eventData.description?.trim() || null,
          date: eventData.date,
          time: eventData.time.trim(),
          location: eventData.location.trim(),
          type: eventData.type,
          organizer: eventData.organizer.trim(),
          capacity: capacity,
          image_url: eventData.image_url || null,
        };

        console.log('Dados para atualização no calendário:', updateData);

        const { error } = await supabase
          .from('events')
          .update(updateData)
          .eq('id', selectedEvent.id);

        if (error) {
          console.error('Erro do Supabase ao atualizar evento:', error);
          throw error;
        }
        
        const updatedEvent: Event = {
          ...selectedEvent,
          ...eventData,
          capacity: capacity,
        };
        
        setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));
        toast({
          title: "Evento atualizado",
          description: `O evento ${eventData.title} foi atualizado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Erro ao salvar evento no calendário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "Erro ao salvar evento",
        description: `Não foi possível salvar o evento. Erro: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsModalOpen(false);
      setSelectedEvent(undefined);
    }
  };

  const handleCloseModal = () => {
    console.log('Fechando modal do calendário');
    setIsModalOpen(false);
    setSelectedEvent(undefined);
  };

  // Função para marcar dias com eventos no calendário - corrigindo comparação de datas
  const isDayWithEvent = (day: Date) => {
    const dayString = format(day, 'yyyy-MM-dd');
    return events.some(event => event.date === dayString);
  };

  const getEventTypeColor = (type: string): string => {
    const colors = {
      culto: "bg-blue-100 text-blue-800",
      reuniao: "bg-green-100 text-green-800",
      conferencia: "bg-purple-100 text-purple-800",
      treinamento: "bg-amber-100 text-amber-800",
      social: "bg-pink-100 text-pink-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      confirmado: "bg-green-100 text-green-800",
      pendente: "bg-amber-100 text-amber-800",
      cancelado: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Agendamento</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Visualize e agende eventos no calendário da igreja.
          </p>
        </div>
        <Button onClick={handleCreateEvent} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Agendar Novo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Calendário</CardTitle>
              <CardDescription className="text-sm">
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
                  className="rounded-md border w-full"
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
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Data Selecionada</CardTitle>
                <CardDescription className="text-sm">
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
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 sm:pb-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">Eventos do Dia</CardTitle>
                <CardDescription className="text-sm">
                  {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={handleCreateEvent} className="w-full sm:w-auto">
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
                  <Button onClick={handleCreateEvent} variant="outline" className="mt-4 w-full sm:w-auto">
                    Agendar Evento
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className={`h-2 ${getEventTypeColor(event.type).split(' ')[0]}`} />
                      <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <CardTitle className="text-base sm:text-lg">{event.title}</CardTitle>
                          <Badge className={cn("ml-0 sm:ml-2 w-fit", getStatusColor('confirmado'))}>
                            Confirmado
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">{event.time} • {event.location}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                          <Badge variant="outline" className={cn(getEventTypeColor(event.type), "w-fit")}>
                            {event.type === 'culto' ? 'Culto' : 
                              event.type === 'reuniao' ? 'Reunião' :
                              event.type === 'conferencia' ? 'Conferência' :
                              event.type === 'treinamento' ? 'Treinamento' : 'Social'}
                          </Badge>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">Detalhes</Button>
                            <Button size="sm" onClick={() => handleEditEvent(event)} className="w-full sm:w-auto">Editar</Button>
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
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        event={selectedEvent}
        title={mode === 'edit' ? "Editar Evento" : "Agendar Novo Evento"}
      />
    </div>
  );
};

export default EventSchedule;

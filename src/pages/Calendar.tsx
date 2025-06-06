
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin, Clock, User, Eye } from 'lucide-react';
import { Event } from '@/types/libraryTypes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EventViewModal from '@/components/events/EventViewModal';

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
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
      console.error('Error fetching events:', error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar os eventos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const getEventsForDate = (selectedDate: Date) => {
    if (!selectedDate) return [];
    
    const dateString = selectedDate.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const eventsForSelectedDate = date ? getEventsForDate(date) : [];

  const isDateWithEvents = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.some(event => event.date === dateString);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="text-center">
          <p>Carregando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Agenda da Igreja</h1>
        <p className="text-muted-foreground">
          Visualize todos os eventos e atividades da igreja.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendário
            </CardTitle>
            <CardDescription>
              Selecione uma data para ver os eventos programados.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasEvents: (date) => isDateWithEvents(date)
              }}
              modifiersStyles={{
                hasEvents: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 'bold'
                }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Eventos para {date?.toLocaleDateString('pt-BR')}
            </CardTitle>
            <CardDescription>
              {eventsForSelectedDate.length === 0 
                ? "Nenhum evento programado para esta data" 
                : `${eventsForSelectedDate.length} evento(s) programado(s)`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventsForSelectedDate.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      {getEventTypeBadge(event.type)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <User className="h-4 w-4" />
                      <span>Organizador: {event.organizer}</span>
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEvent(event)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <EventViewModal
        isOpen={isViewModalOpen}
        onClose={setIsViewModalOpen}
        event={selectedEvent}
      />
    </div>
  );
};

export default CalendarPage;

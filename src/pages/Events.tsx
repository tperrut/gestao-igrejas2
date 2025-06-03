
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EventsList from '@/components/events/EventsList';
import EventModal from '@/components/events/EventModal';
import EventSchedule from '@/components/events/EventSchedule';
import EventsFilter from '@/components/events/EventsFilter';
import { useToast } from '@/components/ui/use-toast';
import { Event } from '@/types/libraryTypes';
import { supabase } from '@/integrations/supabase/client';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

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

  const handleCreateEvent = () => {
    setMode('create');
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setMode('edit');
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', selectedEvent.id);
        
      if (error) throw error;
      
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      toast({
        title: "Evento excluído",
        description: `O evento ${selectedEvent.title} foi excluído com sucesso.`,
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro ao excluir evento",
        description: "Não foi possível excluir o evento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedEvent(undefined);
    }
  };

  const handleSaveEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (mode === 'create') {
        const { data, error } = await supabase
          .from('events')
          .insert([
            {
              title: eventData.title,
              description: eventData.description,
              date: eventData.date,
              time: eventData.time,
              location: eventData.location,
              type: eventData.type,
              organizer: eventData.organizer,
              capacity: eventData.capacity,
            }
          ])
          .select();

        if (error) throw error;
        
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
        const { error } = await supabase
          .from('events')
          .update({
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            location: eventData.location,
            type: eventData.type,
            organizer: eventData.organizer,
            capacity: eventData.capacity,
          })
          .eq('id', selectedEvent.id);

        if (error) throw error;
        
        const updatedEvent: Event = {
          ...selectedEvent,
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          type: eventData.type,
          organizer: eventData.organizer,
          capacity: eventData.capacity,
        };
        
        setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));
        toast({
          title: "Evento atualizado",
          description: `O evento ${eventData.title} foi atualizado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Erro ao salvar evento",
        description: "Não foi possível salvar o evento. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os eventos da igreja
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handleCreateEvent} className="bg-church-blue flex-1 sm:flex-none">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Evento
          </Button>
        </div>
      </div>

      <EventsFilter
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-0 space-y-4">
          <EventsList 
            onEdit={handleEditEvent} 
            onDelete={handleDeleteEvent} 
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0">
          <EventSchedule />
        </TabsContent>
      </Tabs>

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
        title={mode === 'edit' ? "Editar Evento" : "Novo Evento"}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá excluir permanentemente o evento{' '}
              <span className="font-bold">{selectedEvent?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Events;


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
import { useToast } from '@/components/ui/use-toast';
import { Event } from '@/types/libraryTypes';
import { supabase } from '@/integrations/supabase/client';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();

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

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-0 space-y-4">
          <EventsList onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0">
          <EventSchedule />
        </TabsContent>
      </Tabs>

      {selectedEvent && mode === 'edit' ? (
        <EventModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          event={selectedEvent}
          title="Editar Evento"
        />
      ) : (
        <EventModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          title="Novo Evento"
        />
      )}

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

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar } from 'lucide-react';
import EventsList from '@/components/events/EventsList';
import EventModal from '@/components/events/EventModal';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type EventType = 'culto' | 'reuniao' | 'conferencia' | 'treinamento' | 'social';

interface Event {
  id?: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  organizer: string;
  capacity: number;
  description?: string;
}

const Events: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  const { toast } = useToast();

  const handleOpenCreateModal = () => {
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: Omit<Event, 'id'>) => {
    if (editingEvent?.id) {
      // Update existing event
      toast({
        title: "Evento atualizado",
        description: `${event.title} foi atualizado com sucesso.`
      });
    } else {
      // Create new event
      toast({
        title: "Evento adicionado",
        description: `${event.title} foi adicionado com sucesso.`
      });
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os eventos da igreja nesta seção.
            </p>
          </div>
          <Button className="sm:self-end" onClick={handleOpenCreateModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Evento
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Eventos
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">36</div>
              <p className="text-xs text-muted-foreground">
                Nos próximos 30 dias
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Eventos Recorrentes
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Cultos e reuniões semanais
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Eventos Especiais
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Conferências e celebrações
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Eventos Agendados Hoje
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Acontecendo hoje
              </p>
            </CardContent>
          </Card>
        </div>

        <EventsList onEdit={handleOpenEditModal} />

        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          event={editingEvent}
          title={editingEvent ? "Editar Evento" : "Novo Evento"}
        />
      </div>
    </>
  );
};

export default Events;

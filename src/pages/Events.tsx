
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar } from 'lucide-react';
import EventsList from '@/components/events/EventsList';
import EventModal from '@/components/events/EventModal';
import EventSchedule from '@/components/events/EventSchedule';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

export type EventType = 'culto' | 'reuniao' | 'conferencia' | 'treinamento' | 'social';

export interface Event {
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  organizer: string;
  capacity: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

const Events: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("lista");
  const [stats, setStats] = useState({
    total: 0,
    recurring: 0,
    special: 0,
    today: 0
  });

  useEffect(() => {
    fetchEventStats();
  }, []);

  async function fetchEventStats() {
    try {
      // Total de eventos nos próximos 30 dias
      const thirtyDaysAhead = new Date();
      thirtyDaysAhead.setDate(thirtyDaysAhead.getDate() + 30);
      
      const { count: totalCount, error: totalError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .lte('date', thirtyDaysAhead.toISOString().split('T')[0])
        .gte('date', new Date().toISOString().split('T')[0]);

      // Eventos recorrentes (cultos e reuniões)
      const { count: recurringCount, error: recurringError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .in('type', ['culto', 'reuniao']);

      // Eventos especiais (conferências)
      const { count: specialCount, error: specialError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'conferencia');

      // Eventos de hoje
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount, error: todayError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('date', today);

      if (totalError || recurringError || specialError || todayError) {
        throw new Error('Erro ao buscar estatísticas');
      }

      setStats({
        total: totalCount || 0,
        recurring: recurringCount || 0,
        special: specialCount || 0,
        today: todayCount || 0
      });

    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  }

  const handleOpenCreateModal = () => {
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (event: Omit<Event, 'id'>) => {
    try {
      if (editingEvent?.id) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update({
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            type: event.type,
            organizer: event.organizer,
            capacity: event.capacity,
            description: event.description || null
          })
          .eq('id', editingEvent.id);

        if (error) throw error;
        
        toast({
          title: "Evento atualizado",
          description: `${event.title} foi atualizado com sucesso.`
        });
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert([{
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            type: event.type,
            organizer: event.organizer,
            capacity: event.capacity,
            description: event.description || null
          }]);

        if (error) throw error;
        
        toast({
          title: "Evento adicionado",
          description: `${event.title} foi adicionado com sucesso.`
        });
      }

      // Atualizar estatísticas
      fetchEventStats();
      
    } catch (error) {
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao salvar o evento.`,
        variant: "destructive"
      });
      console.error("Erro ao salvar evento:", error);
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
              <div className="text-2xl font-bold">{stats.total}</div>
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
              <div className="text-2xl font-bold">{stats.recurring}</div>
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
              <div className="text-2xl font-bold">{stats.special}</div>
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
              <div className="text-2xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground">
                Acontecendo hoje
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="lista" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-[400px] max-w-full">
            <TabsTrigger value="lista">Lista de Eventos</TabsTrigger>
            <TabsTrigger value="agenda">Agendamento</TabsTrigger>
          </TabsList>
          <TabsContent value="lista">
            <EventsList onEdit={handleOpenEditModal} />
          </TabsContent>
          <TabsContent value="agenda">
            <EventSchedule />
          </TabsContent>
        </Tabs>

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

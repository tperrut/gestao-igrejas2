import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalMembers: number;
  totalBooks: number;
  activeLoans: number;
  upcomingEvents: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalBooks: 0,
    activeLoans: 0,
    upcomingEvents: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      // Executar todas as consultas em paralelo
      const [
        { count: membersCount },
        { count: booksCount },
        { count: loansCount },
        { data: eventsData },
        { data: coursesData }
      ] = await Promise.all([
        supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active'),
        supabase
          .from('books')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('loans')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active'),
        supabase
          .from('events')
          .select('id, title, date, time, type')
          .gte('date', today.toISOString().split('T')[0])
          .lte('date', nextWeek.toISOString().split('T')[0])
          .eq('status', 'scheduled')
          .order('date', { ascending: true })
          .limit(3),
        supabase
          .from('courses')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      // Formatar apenas os eventos para exibição
      const formattedEvents: UpcomingEvent[] = (eventsData || []).map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date).toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        }),
        time: event.time,
        type: event.type === 'worship' ? 'Culto' : 
              event.type === 'meeting' ? 'Reunião' : 
              event.type === 'conference' ? 'Conferência' : 'Evento'
      }));

      setStats({
        totalMembers: membersCount || 0,
        totalBooks: booksCount || 0,
        activeLoans: loansCount || 0,
        upcomingEvents: eventsData?.length || 0,
      });

      setUpcomingEvents(formattedEvents);

    } catch (error: any) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações do dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    upcomingEvents,
    loading,
    refetch: fetchDashboardData,
  };
};
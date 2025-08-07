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

      // Buscar total de membros ativos
      const { count: membersCount, error: membersError } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (membersError) throw membersError;

      // Buscar total de livros
      const { count: booksCount, error: booksError } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });

      if (booksError) throw booksError;

      // Buscar empréstimos ativos
      const { count: loansCount, error: loansError } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (loansError) throw loansError;

      // Buscar próximos eventos (próximos 7 dias)
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, title, date, time, type')
        .gte('date', today.toISOString().split('T')[0])
        .lte('date', nextWeek.toISOString().split('T')[0])
        .eq('status', 'scheduled')
        .order('date', { ascending: true })
        .limit(3);

      if (eventsError) throw eventsError;

      // Buscar próximos cursos
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, start_date, instructor, status')
        .gte('start_date', today.toISOString().split('T')[0])
        .lte('start_date', nextWeek.toISOString().split('T')[0])
        .in('status', ['scheduled', 'active'])
        .order('start_date', { ascending: true })
        .limit(2);

      if (coursesError) throw coursesError;

      // Formatar eventos
      const formattedEvents: UpcomingEvent[] = [
        ...(eventsData || []).map(event => ({
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
        })),
        ...(coursesData || []).map(course => ({
          id: course.id,
          title: course.title,
          date: new Date(course.start_date).toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          }),
          time: '19:30',
          type: 'Curso'
        }))
      ];

      setStats({
        totalMembers: membersCount || 0,
        totalBooks: booksCount || 0,
        activeLoans: loansCount || 0,
        upcomingEvents: (eventsData?.length || 0) + (coursesData?.length || 0),
      });

      setUpcomingEvents(formattedEvents.slice(0, 3));

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
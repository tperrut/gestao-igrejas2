import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger, LogCategory } from '@/utils/logger';

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
    logger.info(LogCategory.BUSINESS_LOGIC, 'Dashboard: Iniciando carregamento dos dados');
    
    try {
      setLoading(true);
      logger.info(LogCategory.BUSINESS_LOGIC, 'Dashboard: Loading state definido como true');

      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      logger.info(LogCategory.BUSINESS_LOGIC, 'Dashboard: Período de busca calculado', {
        today: today.toISOString().split('T')[0],
        nextWeek: nextWeek.toISOString().split('T')[0]
      });

      // Buscar contadores básicos com as novas políticas seguras
      logger.info(LogCategory.DATABASE, 'Dashboard: Iniciando consultas paralelas para contadores');
      
      const [membersResult, booksResult, loansResult] = await Promise.all([
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
          .eq('status', 'active')
      ]);

      logger.info(LogCategory.DATABASE, 'Dashboard: Consultas de contadores concluídas', {
        membersCount: membersResult.count,
        membersError: membersResult.error?.message,
        booksCount: booksResult.count,
        booksError: booksResult.error?.message,
        loansCount: loansResult.count,
        loansError: loansResult.error?.message
      });

      // Buscar eventos próximos
      logger.info(LogCategory.DATABASE, 'Dashboard: Iniciando consulta de eventos');
      
      const eventsResult = await supabase
        .from('events')
        .select('id, title, date, time, type')
        .gte('date', today.toISOString().split('T')[0])
        .lte('date', nextWeek.toISOString().split('T')[0])
        .eq('status', 'scheduled')
        .order('date', { ascending: true })
        .limit(3);

      logger.info(LogCategory.DATABASE, 'Dashboard: Consulta de eventos concluída', {
        eventsCount: eventsResult.data?.length || 0,
        eventsError: eventsResult.error?.message
      });

      const eventsData = eventsResult.data || [];

      // Formatar eventos para exibição
      const formattedEvents: UpcomingEvent[] = eventsData.map(event => ({
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

      const finalStats = {
        totalMembers: membersResult.count || 0,
        totalBooks: booksResult.count || 0,
        activeLoans: loansResult.count || 0,
        upcomingEvents: eventsData.length || 0,
      };

      logger.info(LogCategory.BUSINESS_LOGIC, 'Dashboard: Atualizando estados finais', {
        stats: finalStats,
        upcomingEventsCount: formattedEvents.length
      });

      setStats(finalStats);
      setUpcomingEvents(formattedEvents);
      
      logger.info(LogCategory.BUSINESS_LOGIC, 'Dashboard: Carregamento concluído com sucesso');

    } catch (error: any) {
      logger.error(LogCategory.BUSINESS_LOGIC, 'Dashboard: Erro crítico durante carregamento', error, {
        errorMessage: error?.message,
        errorStack: error?.stack,
        errorName: error?.name
      });
      
      console.error('Erro ao buscar dados do dashboard:', error);
      
      // Definir valores padrão em caso de erro
      const fallbackStats = {
        totalMembers: 0,
        totalBooks: 0,
        activeLoans: 0,
        upcomingEvents: 0,
      };
      
      logger.warn(LogCategory.BUSINESS_LOGIC, 'Dashboard: Aplicando valores padrão devido ao erro', {
        fallbackStats
      });
      
      setStats(fallbackStats);
      setUpcomingEvents([]);
      
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações do dashboard.",
        variant: "destructive",
      });
    } finally {
      logger.info(LogCategory.BUSINESS_LOGIC, 'Dashboard: Finalizando carregamento (setLoading false)');
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
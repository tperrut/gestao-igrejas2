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
    logger.info(LogCategory.BUSINESS_LOGIC, 'Dashboard: Iniciando carregamento dos dados - VERSÃO SIMPLIFICADA');
    
    try {
      setLoading(true);
      logger.info(LogCategory.BUSINESS_LOGIC, 'Dashboard: Loading state definido como true');

      // Versão simplificada para evitar recursão infinita
      // Vamos buscar apenas dados básicos sem depender de RLS complexas
      
      logger.info(LogCategory.DATABASE, 'Dashboard: Testando conexão básica com Supabase');
      
      // Teste simples primeiro - apenas verificar se conseguimos nos conectar
      const testResult = await supabase.from('books').select('id').limit(1);
      logger.info(LogCategory.DATABASE, 'Dashboard: Teste de conexão com books', {
        success: !testResult.error,
        error: testResult.error?.message,
        count: testResult.data?.length
      });

      if (testResult.error) {
        throw new Error(`Erro na conexão básica: ${testResult.error.message}`);
      }

      // Buscar apenas contadores simples
      logger.info(LogCategory.DATABASE, 'Dashboard: Buscando contadores básicos');
      
      const booksResult = await supabase
        .from('books')
        .select('id', { count: 'exact', head: true });
      
      logger.info(LogCategory.DATABASE, 'Dashboard: Resultado livros', {
        count: booksResult.count,
        error: booksResult.error?.message
      });

      // Definir stats com valores seguros
      const finalStats = {
        totalMembers: 0, // Temporariamente fixo
        totalBooks: booksResult.count || 0,
        activeLoans: 0, // Temporariamente fixo
        upcomingEvents: 0, // Temporariamente fixo
      };

      logger.info(LogCategory.BUSINESS_LOGIC, 'Dashboard: Atualizando estados (versão simplificada)', {
        stats: finalStats
      });

      setStats(finalStats);
      setUpcomingEvents([]); // Lista vazia temporariamente
      
      logger.info(LogCategory.BUSINESS_LOGIC, 'Dashboard: Carregamento simplificado concluído com sucesso');

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
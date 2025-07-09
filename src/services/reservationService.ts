
import { supabase } from '@/integrations/supabase/client';
import { Reservation, ReservationStatus } from '@/types/reservationTypes';
import { useToast } from "@/components/ui/use-toast";
import { logger } from '@/utils/logger';

export const useReservationService = () => {
  const { toast } = useToast();

  const logReservationAction = (action: string, details: any) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    const logMessage = `[${timestamp}] ${action}`;
    
    console.log(logMessage, details);
    logger.businessLog(action, details);
  };

  const fetchReservations = async (): Promise<Reservation[]> => {
    try {
      logger.dbLog('Fetching reservations from database');
      
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          id,
          book_id,
          books:book_id (id, title, author),
          member_id,
          members:member_id (id, name, email),
          reservation_date,
          expires_at,
          status,
          created_at,
          updated_at
        `)
        .order('reservation_date', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedReservations = data?.map(reservation => ({
        id: reservation.id,
        book_id: reservation.book_id,
        book: {
          id: reservation.books.id,
          title: reservation.books.title,
          author: reservation.books.author
        },
        member_id: reservation.member_id,
        member: {
          id: reservation.members.id,
          name: reservation.members.name,
          email: reservation.members.email
        },
        reservation_date: reservation.reservation_date,
        expires_at: reservation.expires_at,
        status: reservation.status as ReservationStatus,
        created_at: reservation.created_at,
        updated_at: reservation.updated_at
      })) || [];

      // Log detailed reservation query results
      logReservationAction('CONSULTA_RESERVAS', {
        totalReservas: formattedReservations.length,
        reservasAtivas: formattedReservations.filter(r => r.status === 'active').length,
        reservasExpiradas: formattedReservations.filter(r => r.status === 'expired').length,
        reservasConvertidas: formattedReservations.filter(r => r.status === 'converted').length,
        reservasCanceladas: formattedReservations.filter(r => r.status === 'cancelled').length
      });

      logger.dbLog('Reservations fetched successfully', { count: formattedReservations.length });
      return formattedReservations;
    } catch (error) {
      logger.dbError('Failed to fetch reservations', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro ao carregar reservas",
        description: "Ocorreu um erro ao buscar as reservas.",
        variant: "destructive"
      });
      console.error("Erro ao buscar reservas:", error);
      return [];
    }
  };

  const createReservation = async (bookId: string, memberId: string): Promise<boolean> => {
    try {
      // Get book and member details for logging
      const { data: bookData } = await supabase
        .from('books')
        .select('title, author')
        .eq('id', bookId)
        .single();

      const { data: memberData } = await supabase
        .from('members')
        .select('name, email')
        .eq('id', memberId)
        .single();

      logger.businessLog('Creating new reservation', { bookId, memberId });
      
      const { error } = await supabase
        .from('reservations')
        .insert([{
          book_id: bookId,
          member_id: memberId,
          status: 'active'
        }]);

      if (error) throw error;

      // Log detailed reservation creation
      logReservationAction('RESERVA_CRIADA', {
        livro: {
          titulo: bookData?.title,
          autor: bookData?.author
        },
        membro: {
          nome: memberData?.name,
          email: memberData?.email
        },
        dataReserva: new Date().toISOString(),
        dataExpiracao: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      });

      toast({
        title: "Reserva criada",
        description: "A reserva foi criada com sucesso."
      });
      return true;
    } catch (error) {
      logger.businessError('Failed to create reservation', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a reserva.",
        variant: "destructive"
      });
      console.error("Erro ao criar reserva:", error);
      return false;
    }
  };

  const cancelReservation = async (reservationId: string): Promise<boolean> => {
    try {
      // Get reservation details for logging
      const { data: reservationData } = await supabase
        .from('reservations')
        .select(`
          books:book_id (title, author),
          members:member_id (name, email),
          status
        `)
        .eq('id', reservationId)
        .single();

      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);

      if (error) throw error;

      // Log detailed reservation cancellation
      logReservationAction('RESERVA_CANCELADA', {
        livro: {
          titulo: reservationData?.books?.title,
          autor: reservationData?.books?.author
        },
        membro: {
          nome: reservationData?.members?.name,
          email: reservationData?.members?.email
        },
        statusAnterior: reservationData?.status
      });

      toast({
        title: "Reserva cancelada",
        description: "A reserva foi cancelada com sucesso."
      });
      return true;
    } catch (error) {
      logger.businessError('Failed to cancel reservation', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cancelar a reserva.",
        variant: "destructive"
      });
      console.error("Erro ao cancelar reserva:", error);
      return false;
    }
  };

  return {
    fetchReservations,
    createReservation,
    cancelReservation
  };
};

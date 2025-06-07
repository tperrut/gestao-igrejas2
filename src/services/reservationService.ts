
import { supabase } from '@/integrations/supabase/client';
import { Reservation, ReservationStatus } from '@/types/reservationTypes';
import { useToast } from "@/components/ui/use-toast";

export const useReservationService = () => {
  const { toast } = useToast();

  const fetchReservations = async (): Promise<Reservation[]> => {
    try {
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

      return data?.map(reservation => ({
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
    } catch (error) {
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
      console.log("Criando reserva para livro:", bookId, "e membro:", memberId);
      // Verificar se já existe uma reserva ativa para este livro
      const { data: existingReservation } = await supabase
        .from('reservations')
        .select('id')
        .eq('book_id', bookId)
        .eq('status', 'active')
        .single();

      if (existingReservation) {
        toast({
          title: "Livro já reservado",
          description: "Este livro já possui uma reserva ativa.",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('reservations')
        .insert([{
          book_id: bookId,
          member_id: memberId,
          status: 'active'
        }]);

      if (error) throw error;

      // Buscar nome do membro para a mensagem
      const { data: member } = await supabase
        .from('members')
        .select('name')
        .eq('id', memberId)
        .single();

      toast({
        title: "Reserva realizada com sucesso!",
        description: `Olá ${member?.name || 'membro'}, sua reserva foi realizada, dirija-se à secretaria para retirar seu livro. Deus te abençoe!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao realizar a reserva.",
        variant: "destructive"
      });
      console.error("Erro ao criar reserva:", error);
      return false;
    }
  };

  const cancelReservation = async (reservationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);

      if (error) throw error;

      toast({
        title: "Reserva cancelada",
        description: "A reserva foi cancelada com sucesso."
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cancelar a reserva.",
        variant: "destructive"
      });
      console.error("Erro ao cancelar reserva:", error);
      return false;
    }
  };

  const convertReservationToLoan = async (reservationId: string, dueDate: string): Promise<boolean> => {
    try {
      // Buscar dados da reserva
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .select('book_id, member_id')
        .eq('id', reservationId)
        .single();

      if (reservationError || !reservation) {
        throw new Error('Reserva não encontrada');
      }

      // Criar empréstimo
      const { error: loanError } = await supabase
        .from('loans')
        .insert([{
          book_id: reservation.book_id,
          member_id: reservation.member_id,
          borrow_date: new Date().toISOString().split('T')[0],
          due_date: dueDate,
          status: 'active'
        }]);

      if (loanError) throw loanError;

      // Atualizar reserva como convertida
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ status: 'converted' })
        .eq('id', reservationId);

      if (updateError) throw updateError;

      toast({
        title: "Empréstimo aprovado",
        description: "A reserva foi convertida em empréstimo com sucesso."
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao aprovar o empréstimo.",
        variant: "destructive"
      });
      console.error("Erro ao converter reserva:", error);
      return false;
    }
  };

  return {
    fetchReservations,
    createReservation,
    cancelReservation,
    convertReservationToLoan
  };
};

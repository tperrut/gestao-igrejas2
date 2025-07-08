
import { supabase } from '@/integrations/supabase/client';
import { Loan, LoanStatus } from '@/types/libraryTypes';
import { useToast } from "@/components/ui/use-toast";
import { LoanFormValues } from '@/components/library/LoanForm';
import { logger } from '@/utils/logger';

export const useLoanService = () => {
  const { toast } = useToast();

  const fetchLoans = async (): Promise<Loan[]> => {
    try {
      logger.dbLog('Fetching loans from database');
      
      const { data, error } = await supabase
        .from('loans')
        .select(`
          id,
          book_id,
          books:book_id (id, title),
          member_id,
          members:member_id (id, name),
          borrow_date,
          due_date,
          return_date,
          notes,
          status
        `)
        .order('due_date');
        
      if (error) {
        throw error;
      }

      // Transformar dados do Supabase para o formato da interface
      const formattedLoans = data?.map(loan => ({
        id: loan.id,
        book_id: loan.book_id,
        book: {
          id: loan.books.id,
          title: loan.books.title
        },
        member_id: loan.member_id,
        member: {
          id: loan.members.id,
          name: loan.members.name
        },
        borrow_date: loan.borrow_date,
        due_date: loan.due_date,
        return_date: loan.return_date,
        notes: loan.notes,
        status: loan.status as LoanStatus
      })) || [];

      // Update overdue loans
      const today = new Date();
      formattedLoans.forEach(async loan => {
        if (loan.status === 'active' && new Date(loan.due_date) < today) {
          // Update status to 'overdue'
          await supabase
            .from('loans')
            .update({ status: 'overdue' })
            .eq('id', loan.id);
            
          loan.status = 'overdue';
        }
      });

      logger.dbLog('Loans fetched successfully', { count: formattedLoans.length });
      return formattedLoans;
    } catch (error) {
      logger.dbError('Failed to fetch loans', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro ao carregar empréstimos",
        description: "Ocorreu um erro ao buscar os empréstimos.",
        variant: "destructive"
      });
      console.error("Erro ao buscar empréstimos:", error);
      return [];
    }
  };

  const saveLoan = async (loanData: LoanFormValues): Promise<boolean> => {
    try {
      logger.businessLog('Creating new loan', { 
        bookId: loanData.book_id, 
        memberId: loanData.member_id,
        dueDate: loanData.due_date 
      });
      
      const { error } = await supabase
        .from('loans')
        .insert([{
          book_id: loanData.book_id,
          member_id: loanData.member_id,
          borrow_date: loanData.borrow_date,
          due_date: loanData.due_date,
          notes: loanData.notes || null,
          status: 'active'
        }]);

      if (error) throw error;

      logger.businessLog('Loan created successfully', { 
        bookId: loanData.book_id, 
        memberId: loanData.member_id 
      });
      
      toast({
        title: "Empréstimo registrado",
        description: "O empréstimo foi registrado com sucesso."
      });
      return true;
    } catch (error) {
      logger.businessError('Failed to create loan', error instanceof Error ? error : new Error(String(error)), {
        bookId: loanData.book_id,
        memberId: loanData.member_id
      });
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar o empréstimo.",
        variant: "destructive"
      });
      console.error("Erro ao registrar empréstimo:", error);
      return false;
    }
  };

  const returnLoan = async (loanId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('loans')
        .update({
          status: 'returned',
          return_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', loanId);

      if (error) throw error;

      toast({
        title: "Livro devolvido",
        description: "O livro foi devolvido com sucesso."
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar a devolução.",
        variant: "destructive"
      });
      console.error("Erro ao registrar devolução:", error);
      return false;
    }
  };

  const cancelLoan = async (loanId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', loanId);

      if (error) throw error;

      toast({
        title: "Empréstimo cancelado",
        description: "O empréstimo foi cancelado com sucesso."
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cancelar o empréstimo.",
        variant: "destructive"
      });
      console.error("Erro ao cancelar empréstimo:", error);
      return false;
    }
  };

  return {
    fetchLoans,
    saveLoan,
    returnLoan,
    cancelLoan
  };
};

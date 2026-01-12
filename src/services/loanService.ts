
import { supabase } from '@/integrations/supabase/client';
import { Loan, LoanStatus } from '@/types/libraryTypes';
import { useToast } from "@/components/ui/use-toast";
import { LoanFormValues } from '@/components/library/LoanForm';
import { logger } from '@/utils/logger';
import { getDefaultTenantId } from '@/utils/tenant';

export const useLoanService = () => {
  const { toast } = useToast();

  const logLoanAction = (action: string, details?: unknown) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    const logMessage = `[${timestamp}] ${action}`;
    
    console.log(logMessage, details);
    logger.businessLog(action, details);
  };

  const fetchLoans = async (): Promise<Loan[]> => {
    try {
      logger.dbLog('Fetching loans from database');
      
      const { data, error } = await supabase
        .from('loans')
        .select(`
          id,
          book_id,
          books:book_id (id, title, author),
          member_id,
          members:member_id (id, name, email, avatar_url),
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
          name: loan.members.name,
          avatar_url: loan.members.avatar_url
        },
        borrow_date: loan.borrow_date,
        due_date: loan.due_date,
        return_date: loan.return_date,
        notes: loan.notes,
        status: loan.status as LoanStatus
      })) || [];

      // Log detailed query results
      logLoanAction('CONSULTA_EMPRESTIMOS', {
        totalEmprestimos: formattedLoans.length,
        emprestimosAtivos: formattedLoans.filter(l => l.status === 'active').length,
        emprestimosAtrasados: formattedLoans.filter(l => l.status === 'overdue').length,
        emprestimosDevolvidos: formattedLoans.filter(l => l.status === 'returned').length,
        reservas: formattedLoans.filter(l => l.status === 'reserved').length
      });

      // Update overdue loans
      const today = new Date();
      formattedLoans.forEach(async loan => {
        if (loan.status === 'active' && new Date(loan.due_date) < today) {
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
      // Get book and member details for logging
      const { data: bookData } = await supabase
        .from('books')
        .select('title, author')
        .eq('id', loanData.book_id)
        .single();

      const { data: memberData } = await supabase
        .from('members')
        .select('name, email')
        .eq('id', loanData.member_id)
        .single();

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
          status: 'active',
          tenant_id: getDefaultTenantId(),
        }]);

      if (error) throw error;

      // Log detailed loan creation
      logLoanAction('EMPRESTIMO_CRIADO', {
        livro: {
          titulo: bookData?.title,
          autor: bookData?.author
        },
        membro: {
          nome: memberData?.name,
          email: memberData?.email
        },
        dataEmprestimo: loanData.borrow_date,
        dataDevolucao: loanData.due_date,
        observacoes: loanData.notes
      });

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
      // Get loan details for logging
      const { data: loanDetails } = await supabase
        .from('loans')
        .select(`
          books:book_id (title, author),
          members:member_id (name, email),
          borrow_date,
          due_date
        `)
        .eq('id', loanId)
        .single();

      const { error } = await supabase
        .from('loans')
        .update({
          status: 'returned',
          return_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', loanId);

      if (error) throw error;

      // Log detailed return
      logLoanAction('LIVRO_DEVOLVIDO', {
        livro: {
          titulo: loanDetails?.books?.title,
          autor: loanDetails?.books?.author
        },
        membro: {
          nome: loanDetails?.members?.name,
          email: loanDetails?.members?.email
        },
        dataEmprestimo: loanDetails?.borrow_date,
        dataPrevistaDevolucao: loanDetails?.due_date,
        dataRealDevolucao: new Date().toISOString().split('T')[0]
      });

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
      // Get loan details for logging
      const { data: loanDetails } = await supabase
        .from('loans')
        .select(`
          books:book_id (title, author),
          members:member_id (name, email),
          status
        `)
        .eq('id', loanId)
        .single();

      const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', loanId);

      if (error) throw error;

      // Log detailed cancellation
      logLoanAction('EMPRESTIMO_CANCELADO', {
        livro: {
          titulo: loanDetails?.books?.title,
          autor: loanDetails?.books?.author
        },
        membro: {
          nome: loanDetails?.members?.name,
          email: loanDetails?.members?.email
        },
        statusAnterior: loanDetails?.status
      });

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

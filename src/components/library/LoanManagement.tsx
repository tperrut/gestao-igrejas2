import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Search,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import LoanModal from './LoanModal';
import { supabase } from '@/integrations/supabase/client';
import { LoanFormValues } from './LoanForm';

type LoanStatus = 'active' | 'returned' | 'overdue' | 'reserved';

interface Loan {
  id: string;
  book_id: string;
  book: {
    id: string;
    title: string;
  };
  member_id: string;
  member: {
    id: string;
    name: string;
  };
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  notes: string | null;
  status: LoanStatus;
}

const getStatusBadgeVariant = (status: LoanStatus): "default" | "secondary" | "destructive" | "outline" => {
  const variants = {
    active: 'default',
    returned: 'outline',
    overdue: 'destructive',
    reserved: 'secondary'
  };
  return variants[status] as "default" | "secondary" | "destructive" | "outline";
};

const getStatusLabel = (status: LoanStatus) => {
  const labels = {
    active: 'Emprestado',
    returned: 'Devolvido',
    overdue: 'Atrasado',
    reserved: 'Reservado'
  };
  return labels[status];
};

const LoanManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Partial<LoanFormValues> | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    try {
      setLoading(true);
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

      // Fix the comparison bug in this loop
      const today = new Date();
      formattedLoans.forEach(async loan => {
        if (loan.status === 'active' && new Date(loan.due_date) < today && loan.status !== 'overdue') {
          // Atualizar status para 'overdue'
          await supabase
            .from('loans')
            .update({ status: 'overdue' })
            .eq('id', loan.id);
            
          loan.status = 'overdue';
        }
      });

      setLoans(formattedLoans);
    } catch (error) {
      toast({
        title: "Erro ao carregar empréstimos",
        description: "Ocorreu um erro ao buscar os empréstimos.",
        variant: "destructive"
      });
      console.error("Erro ao buscar empréstimos:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredLoans = loans.filter(loan => 
    loan.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeLoans = filteredLoans.filter(loan => loan.status === 'active');
  const overdueLoans = filteredLoans.filter(loan => loan.status === 'overdue');
  const returnedLoans = filteredLoans.filter(loan => loan.status === 'returned');
  const reservedBooks = filteredLoans.filter(loan => loan.status === 'reserved');

  const handleOpenCreateModal = () => {
    setEditingLoan(undefined);
    setIsModalOpen(true);
  };

  const handleSaveLoan = async (loanData: LoanFormValues) => {
    try {
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

      toast({
        title: "Empréstimo registrado",
        description: "O empréstimo foi registrado com sucesso."
      });

      // Recarregar lista de empréstimos
      fetchLoans();
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar o empréstimo.",
        variant: "destructive"
      });
      console.error("Erro ao registrar empréstimo:", error);
    }
  };

  const handleReturnBook = async (loan: Loan) => {
    try {
      const { error } = await supabase
        .from('loans')
        .update({
          status: 'returned',
          return_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', loan.id);

      if (error) throw error;

      toast({
        title: "Livro devolvido",
        description: `O livro "${loan.book.title}" foi devolvido com sucesso.`
      });

      // Recarregar lista de empréstimos
      fetchLoans();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar a devolução.",
        variant: "destructive"
      });
      console.error("Erro ao registrar devolução:", error);
    }
  };

  const handleSendReminder = (loan: Loan) => {
    toast({
      title: "Lembrete enviado",
      description: `Um lembrete foi enviado para ${loan.member.name} sobre o livro "${loan.book.title}".`
    });
  };

  const handleCancelLoan = async (loan: Loan) => {
    try {
      const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', loan.id);

      if (error) throw error;

      toast({
        title: "Empréstimo cancelado",
        description: `O empréstimo do livro "${loan.book.title}" foi cancelado.`
      });

      // Recarregar lista de empréstimos
      fetchLoans();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cancelar o empréstimo.",
        variant: "destructive"
      });
      console.error("Erro ao cancelar empréstimo:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Empréstimos</h1>
          <p className="text-muted-foreground">
            Controle os empr��stimos e reservas de livros da biblioteca.
          </p>
        </div>
        <Button className="sm:self-end" onClick={handleOpenCreateModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Empréstimo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por livro ou pessoa..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="active" className="flex-grow sm:flex-grow-0">
              Ativos
              <Badge variant="default" className="ml-2">{activeLoans.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="overdue" className="flex-grow sm:flex-grow-0">
              Atrasados
              <Badge variant="destructive" className="ml-2">{overdueLoans.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="returned" className="flex-grow sm:flex-grow-0">
              Devolvidos
              <Badge variant="outline" className="ml-2">{returnedLoans.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reserved" className="flex-grow sm:flex-grow-0">
              Reservados
              <Badge variant="secondary" className="ml-2">{reservedBooks.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="py-8 text-center">Carregando empréstimos...</div>
          ) : (
            <>
              <LoanTable 
                loans={activeLoans} 
                type="active" 
                onReturn={handleReturnBook} 
                onCancel={handleCancelLoan} 
              />
              <LoanTable 
                loans={overdueLoans} 
                type="overdue" 
                onReturn={handleReturnBook}
                onSendReminder={handleSendReminder}
                onCancel={handleCancelLoan}
              />
              <LoanTable 
                loans={returnedLoans} 
                type="returned" 
              />
              <LoanTable 
                loans={reservedBooks} 
                type="reserved" 
                onCancel={handleCancelLoan}
              />
            </>
          )}
        </Tabs>
      </div>

      <LoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLoan}
        loan={editingLoan}
        title="Novo Empréstimo"
      />
    </div>
  );
};

interface LoanTableProps {
  loans: Loan[];
  type: LoanStatus;
  onReturn?: (loan: Loan) => void;
  onSendReminder?: (loan: Loan) => void;
  onCancel?: (loan: Loan) => void;
}

const LoanTable: React.FC<LoanTableProps> = ({ 
  loans, 
  type,
  onReturn,
  onSendReminder,
  onCancel
}) => {
  return (
    <TabsContent value={type} className="p-0">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] min-w-[150px]">
                <div className="flex items-center gap-1">
                  Livro
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="min-w-[120px]">Membro</TableHead>
              {type !== 'reserved' && (
                <>
                  <TableHead className="min-w-[120px]">Data de Empréstimo</TableHead>
                  <TableHead className="min-w-[120px]">Data de Devolução</TableHead>
                </>
              )}
              {type === 'returned' && <TableHead className="min-w-[120px]">Devolvido em</TableHead>}
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.length > 0 ? (
              loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.book.title}</TableCell>
                  <TableCell>{loan.member.name}</TableCell>
                  {type !== 'reserved' && (
                    <>
                      <TableCell>{new Date(loan.borrow_date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(loan.due_date).toLocaleDateString('pt-BR')}</TableCell>
                    </>
                  )}
                  {type === 'returned' && <TableCell>
                    {loan.return_date ? new Date(loan.return_date).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>}
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(loan.status)}>
                      {getStatusLabel(loan.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {type === 'active' && onReturn && (
                          <DropdownMenuItem onClick={() => onReturn(loan)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Registrar Devolução
                          </DropdownMenuItem>
                        )}
                        {type === 'reserved' && (
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirmar Empréstimo
                          </DropdownMenuItem>
                        )}
                        {type === 'overdue' && onSendReminder && (
                          <DropdownMenuItem onClick={() => onSendReminder(loan)}>
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Enviar Lembrete
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Clock className="mr-2 h-4 w-4" />
                          Ver Histórico
                        </DropdownMenuItem>
                        {onCancel && (
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => onCancel(loan)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            {type === 'reserved' ? 'Cancelar Reserva' : 'Cancelar Empréstimo'}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={type === 'reserved' ? 4 : 6} className="h-24 text-center">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
};

export default LoanManagement;

import React, { useState } from 'react';
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

type LoanStatus = 'active' | 'returned' | 'overdue' | 'reserved';

interface Loan {
  id: number;
  bookTitle: string;
  borrowerName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
}

interface LoanFormValues {
  bookId: string;
  borrowerName: string;
  borrowDate: string;
  dueDate: string;
  notes?: string;
}

const mockLoans: Loan[] = [
  {
    id: 1,
    bookTitle: 'A Vida Cristã Prática',
    borrowerName: 'João Silva',
    borrowDate: '01/05/2023',
    dueDate: '15/05/2023',
    status: 'active',
  },
  {
    id: 2,
    bookTitle: 'Comentário Bíblico',
    borrowerName: 'Maria Oliveira',
    borrowDate: '20/04/2023',
    dueDate: '04/05/2023',
    status: 'overdue',
  },
  {
    id: 3,
    bookTitle: 'Liderança na Igreja',
    borrowerName: 'Pedro Lima',
    borrowDate: '10/04/2023',
    dueDate: '24/04/2023',
    returnDate: '22/04/2023',
    status: 'returned',
  },
  {
    id: 4,
    bookTitle: 'Adoração e Louvor',
    borrowerName: 'Ana Costa',
    borrowDate: '05/05/2023',
    dueDate: '19/05/2023',
    status: 'active',
  },
  {
    id: 5,
    bookTitle: 'História da Igreja',
    borrowerName: 'Carlos Ferreira',
    borrowDate: '',
    dueDate: '',
    status: 'reserved',
  },
];

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
  const [loans] = useState<Loan[]>(mockLoans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Partial<LoanFormValues> | undefined>(undefined);
  const { toast } = useToast();

  const filteredLoans = loans.filter(loan => 
    loan.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeLoans = filteredLoans.filter(loan => loan.status === 'active');
  const overdueLoans = filteredLoans.filter(loan => loan.status === 'overdue');
  const returnedLoans = filteredLoans.filter(loan => loan.status === 'returned');
  const reservedBooks = filteredLoans.filter(loan => loan.status === 'reserved');

  const handleOpenCreateModal = () => {
    setEditingLoan(undefined);
    setIsModalOpen(true);
  };

  const handleSaveLoan = (loan: LoanFormValues) => {
    toast({
      title: "Empréstimo registrado",
      description: `O livro foi emprestado para ${loan.borrowerName}.`
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Empréstimos</h1>
          <p className="text-muted-foreground">
            Controle os empréstimos e reservas de livros da biblioteca.
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

          <LoanTable loans={activeLoans} type="active" />
          <LoanTable loans={overdueLoans} type="overdue" />
          <LoanTable loans={returnedLoans} type="returned" />
          <LoanTable loans={reservedBooks} type="reserved" />
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
}

const LoanTable: React.FC<LoanTableProps> = ({ loans, type }) => {
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
                  <TableCell className="font-medium">{loan.bookTitle}</TableCell>
                  <TableCell>{loan.borrowerName}</TableCell>
                  {type !== 'reserved' && (
                    <>
                      <TableCell>{loan.borrowDate}</TableCell>
                      <TableCell>{loan.dueDate}</TableCell>
                    </>
                  )}
                  {type === 'returned' && <TableCell>{loan.returnDate}</TableCell>}
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
                        {type === 'active' && (
                          <DropdownMenuItem>
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
                        {type === 'overdue' && (
                          <DropdownMenuItem>
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Enviar Lembrete
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Clock className="mr-2 h-4 w-4" />
                          Ver Histórico
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <XCircle className="mr-2 h-4 w-4" />
                          {type === 'reserved' ? 'Cancelar Reserva' : 'Cancelar Empréstimo'}
                        </DropdownMenuItem>
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

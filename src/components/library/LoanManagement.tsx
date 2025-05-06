
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
  AlertCircle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const filteredLoans = loans.filter(loan => 
    loan.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeLoans = filteredLoans.filter(loan => loan.status === 'active');
  const overdueLoans = filteredLoans.filter(loan => loan.status === 'overdue');
  const returnedLoans = filteredLoans.filter(loan => loan.status === 'returned');
  const reservedBooks = filteredLoans.filter(loan => loan.status === 'reserved');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Empréstimos</h1>
          <p className="text-muted-foreground">
            Controle os empréstimos e reservas de livros da biblioteca.
          </p>
        </div>
        <Button className="sm:self-end">
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

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">
            Ativos
            <Badge variant="default" className="ml-2">{activeLoans.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Atrasados
            <Badge variant="destructive" className="ml-2">{overdueLoans.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="returned">
            Devolvidos
            <Badge variant="outline" className="ml-2">{returnedLoans.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="reserved">
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
  );
};

interface LoanTableProps {
  loans: Loan[];
  type: LoanStatus;
}

const LoanTable: React.FC<LoanTableProps> = ({ loans, type }) => {
  return (
    <TabsContent value={type} className="p-0">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center gap-1">
                  Livro
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Membro</TableHead>
              {type !== 'reserved' && (
                <>
                  <TableHead>Data de Empréstimo</TableHead>
                  <TableHead>Data de Devolução</TableHead>
                </>
              )}
              {type === 'returned' && <TableHead>Devolvido em</TableHead>}
              <TableHead>Status</TableHead>
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

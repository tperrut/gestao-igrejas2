
import React, { useState } from 'react';
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpDown, AlertCircle, CheckCircle, Clock, MoreHorizontal, XCircle } from 'lucide-react';
import { Loan, LoanStatus } from '@/types/libraryTypes';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export const getStatusBadgeVariant = (status: LoanStatus): "default" | "secondary" | "destructive" | "outline" => {
  const variants = {
    active: 'default',
    returned: 'outline',
    overdue: 'destructive',
    reserved: 'secondary'
  };
  return variants[status] as "default" | "secondary" | "destructive" | "outline";
};

export const getStatusLabel = (status: LoanStatus): string => {
  const labels = {
    active: 'Emprestado',
    returned: 'Devolvido',
    overdue: 'Atrasado',
    reserved: 'Reservado'
  };
  return labels[status];
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
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
    variant?: 'default' | 'destructive';
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
    variant: 'default'
  });

  const handleReturn = (loan: Loan) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirmar Devolução',
      description: `Confirmar a devolução do livro "${loan.book.title}" emprestado para ${loan.member.name}?`,
      action: () => onReturn?.(loan),
      variant: 'default'
    });
  };

  const handleCancel = (loan: Loan) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Cancelar Empréstimo',
      description: `Tem certeza que deseja cancelar o empréstimo do livro "${loan.book.title}" para ${loan.member.name}? Esta ação não pode ser desfeita.`,
      action: () => onCancel?.(loan),
      variant: 'destructive'
    });
  };

  const handleSendReminder = (loan: Loan) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Enviar Lembrete',
      description: `Enviar lembrete de devolução para ${loan.member.name} sobre o livro "${loan.book.title}"?`,
      action: () => onSendReminder?.(loan),
      variant: 'default'
    });
  };

  const closeDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
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
                <TableHead className="min-w-[160px]">Membro</TableHead>
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
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={loan.member.avatar_url} 
                            alt={loan.member.name}
                          />
                          <AvatarFallback className="text-xs">
                            {loan.member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{loan.member.name}</span>
                      </div>
                    </TableCell>
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
                          {(type === 'active' || type === 'overdue') && onReturn && (
                            <DropdownMenuItem onClick={() => handleReturn(loan)}>
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
                            <DropdownMenuItem onClick={() => handleSendReminder(loan)}>
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
                              onClick={() => handleCancel(loan)}
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

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeDialog}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
      />
    </>
  );
};

export default LoanTable;

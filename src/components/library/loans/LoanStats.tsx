
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, UserCheck, Clock, Calendar } from 'lucide-react';
import { Loan } from '@/types/libraryTypes';

interface LoanStatsProps {
  loans: Loan[];
}

const LoanStats: React.FC<LoanStatsProps> = ({ loans }) => {
  // Calculate statistics
  const activeLoans = loans.filter(loan => loan.status === 'active').length;
  
  // Count unique members with active or overdue loans
  const membersWithBooks = new Set(
    loans
      .filter(loan => loan.status === 'active' || loan.status === 'overdue')
      .map(loan => loan.member_id)
  ).size;

  // Count overdue books
  const overdueBooks = loans.filter(loan => loan.status === 'overdue').length;
  
  // Count books due today
  const today = new Date().toISOString().split('T')[0];
  const dueToday = loans.filter(loan => 
    loan.status === 'active' && loan.due_date === today
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Empréstimos
          </CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeLoans}</div>
          <p className="text-xs text-muted-foreground">
            Empréstimos ativos
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Membros com Livros
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{membersWithBooks}</div>
          <p className="text-xs text-muted-foreground">
            Diferentes pessoas
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Livros Atrasados
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overdueBooks}</div>
          <p className="text-xs text-muted-foreground">
            Precisam ser devolvidos
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Devoluções Hoje
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dueToday}</div>
          <p className="text-xs text-muted-foreground">
            Agendadas para hoje
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanStats;

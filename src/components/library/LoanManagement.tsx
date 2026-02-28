
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import LoanModal from './LoanModal';
import { Loan } from '@/types/libraryTypes';
import { useLoanService } from '@/services/loanService';
import LoanTable from './loans/LoanTable';
import LoanStats from './loans/LoanStats';
import LoanSearch from './loans/LoanSearch';
import { useReservationService } from '@/services/reservationService'; // importe o serviço
import { Reservation } from '@/types/reservationTypes';

const LoanManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const { fetchLoans, saveLoan, returnLoan, cancelLoan } = useLoanService();
const [reservations, setReservations] = useState<Reservation[]>([]);
const { fetchReservations } = useReservationService();
useEffect(() => {
  loadLoansAndReservations();
}, []);

const loadLoansAndReservations = async () => {
  setLoading(true);
  const [loansData, reservationsData] = await Promise.all([
    fetchLoans(),
    fetchReservations()
  ]);
  setLoans(loansData);
  // Filtra apenas reservas ativas
  setReservations(reservationsData.filter(r => r.status === 'active'));
  setLoading(false);
};

  const filteredLoans = loans.filter(loan => 
    loan.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeLoans = filteredLoans.filter(loan => loan.status === 'active');
  const overdueLoans = filteredLoans.filter(loan => loan.status === 'overdue');
  const returnedLoans = filteredLoans.filter(loan => loan.status === 'returned');
 // const reservedBooks = filteredLoans.filter(loan => loan.status === 'reserved');
  const reservationsData = reservations;
  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleSaveLoan = async (loanData) => {
    const success = await saveLoan(loanData);
    if (success) {
      await loadLoansAndReservations();
      setIsModalOpen(false);
    }
  };

  const handleReturnBook = async (loan) => {
    const success = await returnLoan(loan.id);
    if (success) {
      await loadLoansAndReservations();
    }
  };

  const handleSendReminder = (loan) => {
    toast({
      title: "Lembrete enviado",
      description: `Um lembrete foi enviado para ${loan.member.name} sobre o livro "${loan.book.title}".`
    });
  };

  const handleCancelLoan = async (loan) => {
    const success = await cancelLoan(loan.id);
    if (success) {
      await loadLoansAndReservations();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <Button className="sm:self-end" onClick={handleOpenCreateModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Empréstimo
        </Button>
      </div>

      <LoanSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {loading ? (
        <div className="py-8 text-center">Carregando empréstimos...</div>
      ) : (
        <>
          <LoanStats loans={loans} />

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
                  <Badge variant="secondary" className="ml-2">{reservationsData.length}</Badge>
                </TabsTrigger>
              </TabsList>

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
            {/* TODO Refatorar o componente para tratar reservas como reserva e não como emprestimo
              <LoanTable 
                loans={reservationsData} 
                type="reserved" 
                onCancel={handleCancelLoan}
              /> */}
            </Tabs>
          </div>
        </>
      )}

      <LoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLoan}
        loan={undefined}
        title="Novo Empréstimo"
      />
    </div>
  );
};

export default LoanManagement;

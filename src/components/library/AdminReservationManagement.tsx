
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import { Reservation } from '@/types/reservationTypes';
import { useReservationService } from '@/services/reservationService';

const AdminReservationManagement: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [dueDate, setDueDate] = useState('');

  const { fetchReservations, cancelReservation, convertReservationToLoan } = useReservationService();

  useEffect(() => {
    loadReservations();
    // Set default due date to 14 days from today
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setDueDate(defaultDueDate.toISOString().split('T')[0]);
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    const data = await fetchReservations();
    setReservations(data);
    setLoading(false);
  };

  const handleApproveReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setConvertDialogOpen(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedReservation) return;

    const success = await convertReservationToLoan(selectedReservation.id, dueDate);
    if (success) {
      await loadReservations();
      setConvertDialogOpen(false);
      setSelectedReservation(null);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    const success = await cancelReservation(reservationId);
    if (success) {
      await loadReservations();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Ativa</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expirada</Badge>;
      case 'converted':
        return <Badge variant="outline" className="border-green-500 text-green-500">Convertida</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelada</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const activeReservations = reservations.filter(r => r.status === 'active');
  const otherReservations = reservations.filter(r => r.status !== 'active');

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">Carregando reservas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Reservas</h2>
        <p className="text-muted-foreground">
          Aprove ou cancele as reservas de livros dos membros.
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReservations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiradas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.filter(r => r.status === 'expired').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convertidas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.filter(r => r.status === 'converted').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservas Ativas */}
      {activeReservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reservas Ativas - Aguardando Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Livro</TableHead>
                    <TableHead>Membro</TableHead>
                    <TableHead>Data da Reserva</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[200px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium">{reservation.book.title}</p>
                          <p className="text-sm text-muted-foreground">{reservation.book.author}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reservation.member.name}</p>
                          <p className="text-sm text-muted-foreground">{reservation.member.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(reservation.reservation_date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className={isExpired(reservation.expires_at) ? 'text-red-500' : ''}>
                          {new Date(reservation.expires_at).toLocaleString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(reservation.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveReservation(reservation)}
                            disabled={isExpired(reservation.expires_at)}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelReservation(reservation.id)}
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Cancelar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Reservas */}
      {otherReservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Livro</TableHead>
                    <TableHead>Membro</TableHead>
                    <TableHead>Data da Reserva</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium">{reservation.book.title}</p>
                          <p className="text-sm text-muted-foreground">{reservation.book.author}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reservation.member.name}</p>
                          <p className="text-sm text-muted-foreground">{reservation.member.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(reservation.reservation_date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(reservation.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {reservations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma reserva encontrada.</p>
        </div>
      )}

      {/* Dialog de Aprovação */}
      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Empréstimo</DialogTitle>
            <DialogDescription>
              Confirme os dados do empréstimo para aprovar a reserva.
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div>
                <p><strong>Livro:</strong> {selectedReservation.book.title}</p>
                <p><strong>Membro:</strong> {selectedReservation.member.name}</p>
              </div>
              <div>
                <Label htmlFor="due-date">Data de Devolução</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmApproval}>
              Confirmar Empréstimo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReservationManagement;


import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Settings, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PastoralScheduleManagement from '@/components/pastoral/PastoralScheduleManagement';

interface PastoralAppointment {
  id: string;
  user_id?: string;
  member_name: string;
  member_email: string;
  member_phone: string | null;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  message: string | null;
  status: string;
  pastor_notes: string | null;
  created_at: string;
}

const PastoralManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<PastoralAppointment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('pastoral_appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string, notes?: string) => {
    try {
      const updateData: any = { status };
      if (notes !== undefined) {
        updateData.pastor_notes = notes;
      }

      const { error } = await supabase
        .from('pastoral_appointments')
        .update(updateData)
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      });
      
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-500",
      confirmed: "bg-green-500",
      completed: "bg-blue-500",
      cancelled: "bg-red-500"
    };

    const labels = {
      pending: "Pendente",
      confirmed: "Confirmado",
      completed: "Concluído",
      cancelled: "Cancelado"
    };

    return (
      <Badge className={styles[status as keyof typeof styles] || "bg-gray-500"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Gerenciamento Pastoral</h1>
        <p className="text-muted-foreground">
          Gerencie agendamentos e configurações da agenda pastoral.
        </p>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appointments">
            <Users className="h-4 w-4 mr-2" />
            Agendamentos
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar Agenda
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Pastorais</CardTitle>
              <CardDescription>
                Gerencie as solicitações de agendamento pastoral.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                      <TableHead className="hidden lg:table-cell">Horário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{appointment.member_name}</p>
                            <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                            <div className="sm:hidden text-xs text-muted-foreground mt-1">
                              {appointment.member_email}
                            </div>
                            <div className="md:hidden text-xs text-muted-foreground">
                              {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')} às {appointment.appointment_time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div>
                            <p className="text-sm">{appointment.member_email}</p>
                            {appointment.member_phone && (
                              <p className="text-xs text-muted-foreground">{appointment.member_phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {appointment.appointment_time}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(appointment.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {appointment.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                  className="bg-green-500 hover:bg-green-600 text-xs"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Confirmar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                  className="text-xs"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Cancelar
                                </Button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                className="bg-blue-500 hover:bg-blue-600 text-xs"
                              >
                                Concluir
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {appointments.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <PastoralScheduleManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PastoralManagement;

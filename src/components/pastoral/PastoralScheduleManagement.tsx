
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PastoralSchedule {
  id: string;
  date: string;
  time: string;
  is_available: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface PastoralAppointment {
  id: string;
  user_id?: string;
  member_name: string;
  member_email: string;
  member_phone?: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  message?: string;
  status: string;
  pastor_notes?: string;
  created_at: string;
  updated_at: string;
}

const PastoralScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<PastoralSchedule[]>([]);
  const [appointments, setAppointments] = useState<PastoralAppointment[]>([]);
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    time: '',
    is_available: true,
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSchedules();
    fetchAppointments();
  }, []);

  const fetchSchedules = async () => {
    try {
      console.log('Buscando agendas pastorais...');
      const { data, error } = await supabase
        .from('pastoral_schedules')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendas:', error);
        throw error;
      }

      console.log('Agendas encontradas:', data);
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        title: "Erro ao carregar agendas",
        description: "Não foi possível carregar as agendas pastorais.",
        variant: "destructive",
      });
    }
  };

  const fetchAppointments = async () => {
    try {
      console.log('Buscando agendamentos pastorais...');
      const { data, error } = await supabase
        .from('pastoral_appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        throw error;
      }

      console.log('Agendamentos encontrados:', data);
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Não foi possível carregar os agendamentos pastorais.",
        variant: "destructive",
      });
    }
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.date || !newSchedule.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha a data e horário.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Salvando nova agenda:', newSchedule);
      
      const { data, error } = await supabase
        .from('pastoral_schedules')
        .insert([{
          date: newSchedule.date,
          time: newSchedule.time,
          is_available: newSchedule.is_available,
          notes: newSchedule.notes || null
        }])
        .select();

      if (error) {
        console.error('Erro do Supabase ao criar agenda:', error);
        throw error;
      }

      console.log('Agenda criada com sucesso:', data);
      
      if (data && data[0]) {
        setSchedules([...schedules, data[0] as PastoralSchedule]);
        setNewSchedule({ date: '', time: '', is_available: true, notes: '' });
        toast({
          title: "Agenda criada",
          description: "Horário adicionado com sucesso à agenda pastoral.",
        });
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast({
        title: "Erro ao criar agenda",
        description: "Não foi possível criar o horário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      console.log('Excluindo agenda:', id);
      const { error } = await supabase
        .from('pastoral_schedules')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir agenda:', error);
        throw error;
      }

      setSchedules(schedules.filter(schedule => schedule.id !== id));
      toast({
        title: "Agenda excluída",
        description: "Horário removido da agenda pastoral.",
      });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Erro ao excluir agenda",
        description: "Não foi possível excluir o horário.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId: string, status: string, notes?: string) => {
    try {
      console.log('Atualizando status do agendamento:', appointmentId, status);
      const { error } = await supabase
        .from('pastoral_appointments')
        .update({ 
          status,
          pastor_notes: notes || null
        })
        .eq('id', appointmentId);

      if (error) {
        console.error('Erro ao atualizar agendamento:', error);
        throw error;
      }

      fetchAppointments();
      toast({
        title: "Status atualizado",
        description: "Status do agendamento foi atualizado com sucesso.",
      });
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
    const statusConfig = {
      pending: { label: 'Pendente', className: 'bg-yellow-500' },
      confirmed: { label: 'Confirmado', className: 'bg-green-500' },
      completed: { label: 'Realizado', className: 'bg-blue-500' },
      cancelled: { label: 'Cancelado', className: 'bg-red-500' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="schedules" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedules">Gerenciar Agenda</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Horário
              </CardTitle>
              <CardDescription>
                Configure os horários disponíveis para consultas pastorais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={newSchedule.is_available}
                  onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, is_available: checked })}
                />
                <Label htmlFor="available">Disponível para agendamento</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações sobre este horário..."
                  value={newSchedule.notes}
                  onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
                />
              </div>
              
              <Button 
                onClick={handleAddSchedule} 
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                {isLoading ? 'Salvando...' : 'Adicionar Horário'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agenda Configurada ({schedules.length} horários)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum horário configurado na agenda.
                </p>
              ) : (
                <div className="space-y-2">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(schedule.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{schedule.time}</span>
                        </div>
                        {!schedule.is_available && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Indisponível
                          </span>
                        )}
                        {schedule.notes && (
                          <span className="text-xs text-muted-foreground">
                            ({schedule.notes})
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Recebidos ({appointments.length})</CardTitle>
              <CardDescription>
                Gerencie os agendamentos de consultas pastorais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum agendamento recebido.
                </p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{appointment.member_name}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.member_email}</p>
                          {appointment.member_phone && (
                            <p className="text-sm text-muted-foreground">{appointment.member_phone}</p>
                          )}
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.appointment_time}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Motivo:</p>
                        <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                      </div>
                      
                      {appointment.message && (
                        <div>
                          <p className="text-sm font-medium">Mensagem:</p>
                          <p className="text-sm text-muted-foreground">{appointment.message}</p>
                        </div>
                      )}
                      
                      {appointment.pastor_notes && (
                        <div>
                          <p className="text-sm font-medium">Notas do Pastor:</p>
                          <p className="text-sm text-muted-foreground">{appointment.pastor_notes}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        {appointment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                            >
                              Confirmar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}
                          >
                            Marcar como Realizado
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PastoralScheduleManagement;

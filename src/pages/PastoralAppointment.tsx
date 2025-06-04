import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Clock, Calendar as CalendarIcon, CheckCircle, XCircle, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PastoralScheduleManagement from '@/components/pastoral/PastoralScheduleManagement';
import MemberLookup from '@/components/pastoral/MemberLookup';

interface PastoralAppointment {
  id: string;
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

interface AvailableSchedule {
  id: string;
  date: string;
  time: string;
  is_available: boolean;
  notes?: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

const PastoralAppointment: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState<PastoralAppointment[]>([]);
  const [availableSchedules, setAvailableSchedules] = useState<AvailableSchedule[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
    fetchAvailableSchedules();
  }, []);

  useEffect(() => {
    if (date) {
      const selectedDate = format(date, 'yyyy-MM-dd');
      console.log('Selected date:', selectedDate);
      console.log('Available schedules:', availableSchedules);
      
      const timesForDate = availableSchedules
        .filter(schedule => {
          const scheduleDate = schedule.date;
          console.log('Comparing:', scheduleDate, 'with', selectedDate);
          return scheduleDate === selectedDate && 
            schedule.is_available &&
            !appointments.some(apt => 
              apt.appointment_date === selectedDate && 
              apt.appointment_time === schedule.time &&
              apt.status !== 'cancelled'
            );
        })
        .map(schedule => schedule.time);
      
      console.log('Times for date:', timesForDate);
      setAvailableTimes(timesForDate);
      setTime(""); // Reset time when date changes
    }
  }, [date, availableSchedules, appointments]);

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

  const fetchAvailableSchedules = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('pastoral_schedules')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      console.log('Fetched schedules:', data);
      setAvailableSchedules(data || []);
    } catch (error) {
      console.error('Error fetching available schedules:', error);
    }
  };

  const handleMemberSelected = (member: Member) => {
    setSelectedMember(member);
    setName(member.name);
    setEmail(member.email);
    setContactNumber(member.phone || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação completa dos campos obrigatórios
    if (!date) {
      toast({
        title: "Data não selecionada",
        description: "Por favor, selecione uma data para o agendamento.",
        variant: "destructive",
      });
      return;
    }

    if (!time) {
      toast({
        title: "Horário não selecionado",
        description: "Por favor, selecione um horário disponível.",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome completo.",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe seu email.",
        variant: "destructive",
      });
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um email válido.",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da consulta.",
        variant: "destructive",
      });
      return;
    }

    // Check if the selected time is still available
    const selectedDate = format(date, 'yyyy-MM-dd');
    console.log('Submitting appointment for date:', selectedDate, 'time:', time);
    
    const isTimeAvailable = availableSchedules.some(schedule => 
      schedule.date === selectedDate && 
      schedule.time === time && 
      schedule.is_available &&
      !appointments.some(apt => 
        apt.appointment_date === selectedDate && 
        apt.appointment_time === time &&
        apt.status !== 'cancelled'
      )
    );

    if (!isTimeAvailable) {
      toast({
        title: "Horário indisponível",
        description: "Este horário não está mais disponível. Por favor, selecione outro.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const appointmentData = {
        member_name: name.trim(),
        member_email: email.trim(),
        member_phone: contactNumber.trim() || null,
        appointment_date: selectedDate,
        appointment_time: time,
        reason: reason.trim(),
        message: message.trim() || null,
        status: 'pending'
      };

      console.log('Creating appointment with data:', appointmentData);

      const { data, error } = await supabase
        .from('pastoral_appointments')
        .insert([appointmentData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Appointment created successfully:', data);

      toast({
        title: "Solicitação enviada!",
        description: `Seu agendamento para ${format(date, "dd 'de' MMMM", { locale: ptBR })} às ${time} foi recebido e está em análise.`,
      });
      
      // Limpar formulário
      setDate(undefined);
      setTime("");
      setSelectedMember(null);
      setName("");
      setEmail("");
      setContactNumber("");
      setReason("");
      setMessage("");
      
      // Atualizar lista de agendamentos
      fetchAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "Erro ao enviar solicitação",
        description: `Não foi possível enviar sua solicitação. Erro: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const isDateAvailable = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates and weekends
    if (date < today || date.getDay() === 0 || date.getDay() === 6) {
      return true; // disabled
    }
    
    // Check if there are available schedules for this date
    const hasAvailableSchedules = availableSchedules.some(schedule => 
      schedule.date === dateString && schedule.is_available
    );
    
    return !hasAvailableSchedules; // disabled if no schedules available
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-8">
        <div className="w-full lg:w-1/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Fale com o Pastor
              </CardTitle>
              <CardDescription>
                Agende uma conversa pastoral para aconselhamento, oração ou outro assunto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">Escolha uma data disponível no calendário</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">Selecione um horário disponível</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contato Direto</CardTitle>
              <CardDescription>
                Para assuntos urgentes, utilize os contatos abaixo:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm"><strong>Telefone:</strong> (11) 1234-5678</p>
              <p className="text-sm"><strong>Email:</strong> pastor@imw.com</p>
              <p className="text-sm"><strong>Horário de Funcionamento:</strong><br />
                Segunda a Sexta: 09:00 às 18:00<br />
                Sábado: 09:00 às 12:00
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full lg:w-2/3">
          <Tabs defaultValue="member" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="member">Sou Membro</TabsTrigger>
              <TabsTrigger value="meeting">Agendar Reunião</TabsTrigger>
              <TabsTrigger value="admin">Área Pastoral (Admin)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="member">
              <Card>
                <CardHeader>
                  <CardTitle>Agendamento de Consulta Pastoral</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo para solicitar um horário com o pastor.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <MemberLookup 
                      onMemberSelected={handleMemberSelected}
                      selectedMember={selectedMember}
                    />
                    
                    {!selectedMember && (
                      <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo *</Label>
                          <Input
                            id="name"
                            placeholder="Digite seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact">Telefone</Label>
                          <Input
                            id="contact"
                            placeholder="(00) 00000-0000"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Selecione uma data *</Label>
                      <div className="flex justify-center">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={isDateAvailable}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Horário *</Label>
                      <Select value={time} onValueChange={setTime} required disabled={!date}>
                        <SelectTrigger id="time">
                          <SelectValue placeholder={date ? "Selecione um horário" : "Primeiro selecione uma data"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimes.map(slot => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {date && availableTimes.length === 0 && (
                        <p className="text-sm text-muted-foreground">Nenhum horário disponível para esta data.</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reason">Motivo da Consulta *</Label>
                      <Input
                        id="reason"
                        placeholder="Ex: Aconselhamento matrimonial, oração, etc."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem adicional</Label>
                      <Textarea
                        id="message"
                        placeholder="Descreva brevemente o assunto que gostaria de tratar..."
                        className="min-h-[100px]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handleSubmit} 
                    className="bg-church-blue hover:bg-church-blue-dark w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Solicitar Agendamento"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="meeting">
              <Card>
                <CardHeader>
                  <CardTitle>Agendar Reunião</CardTitle>
                  <CardDescription>
                    Agende uma reunião com o pastor para discussões administrativas ou de liderança.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="meeting-name">Nome do Solicitante *</Label>
                        <Input
                          id="meeting-name"
                          placeholder="Digite seu nome"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meeting-email">Email *</Label>
                        <Input
                          id="meeting-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="meeting-contact">Telefone</Label>
                      <Input
                        id="meeting-contact"
                        placeholder="(00) 00000-0000"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Selecione uma data *</Label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={isDateAvailable}
                        className="rounded-md border mx-auto"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="meeting-time">Horário *</Label>
                      <Select value={time} onValueChange={setTime} required disabled={!date}>
                        <SelectTrigger id="meeting-time">
                          <SelectValue placeholder={date ? "Selecione um horário" : "Primeiro selecione uma data"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimes.map(slot => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="meeting-reason">Assunto da Reunião *</Label>
                      <Input
                        id="meeting-reason"
                        placeholder="Ex: Planejamento ministerial, questões administrativas, etc."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="meeting-message">Agenda/Tópicos a discutir</Label>
                      <Textarea
                        id="meeting-message"
                        placeholder="Descreva os tópicos que gostaria de discutir na reunião..."
                        className="min-h-[100px]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handleSubmit} 
                    className="bg-church-blue hover:bg-church-blue-dark w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? "Agendando..." : "Agendar Reunião"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="admin">
              <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
                  <TabsTrigger value="schedule">
                    <Settings className="h-4 w-4 mr-2" />
                    Gerenciar Agenda
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gerenciamento de Agendamentos Pastorais</CardTitle>
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
                              <TableHead className="hidden sm:table-cell">Data</TableHead>
                              <TableHead className="hidden md:table-cell">Horário</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {appointments.map((appointment) => (
                              <TableRow key={appointment.id}>
                                <TableCell className="font-medium">
                                  <div>
                                    <p>{appointment.member_name}</p>
                                    <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {appointment.appointment_time}
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(appointment.status)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col sm:flex-row gap-1">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PastoralAppointment;

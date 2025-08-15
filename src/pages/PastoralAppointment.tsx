
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, Clock, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { sanitizeText } from '@/utils/validation';

const appointmentFormSchema = z.object({
  member_name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  member_email: z.string().email({ message: "E-mail inválido" }),
  member_phone: z.string().min(10, { message: "O telefone deve ter pelo menos 10 dígitos" }),
  appointment_date: z.string().min(1, { message: "Selecione uma data" }),
  appointment_time: z.string().min(1, { message: "Selecione um horário" }),
  reason: z.string().min(5, { message: "O motivo deve ter pelo menos 5 caracteres" }),
  message: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface PastoralSchedule {
  id: string;
  date: string;
  time: string;
  is_available: boolean;
}

const PastoralAppointment: React.FC = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [availableSchedules, setAvailableSchedules] = useState<PastoralSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      member_name: profile?.name || "",
      member_email: profile?.email || "",
      member_phone: "",
      appointment_date: "",
      appointment_time: "",
      reason: "",
      message: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.setValue('member_name', profile.name);
      form.setValue('member_email', profile.email);
    }
  }, [profile, form]);

  useEffect(() => {
    fetchAvailableSchedules();
  }, []);

  const fetchAvailableSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('pastoral_schedules')
        .select('*')
        .eq('is_available', true)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setAvailableSchedules(data || []);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
    }
  };

  const availableDates = [...new Set(availableSchedules.map(schedule => schedule.date))];
  const availableTimes = availableSchedules
    .filter(schedule => schedule.date === selectedDate)
    .map(schedule => schedule.time);

  async function onSubmit(data: AppointmentFormValues) {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('pastoral_appointments')
        .insert([{
          user_id: currentUser.id,
          member_name: sanitizeText(data.member_name),
          member_email: data.member_email.toLowerCase().trim(),
          member_phone: sanitizeText(data.member_phone),
          appointment_date: data.appointment_date,
          appointment_time: data.appointment_time,
          reason: sanitizeText(data.reason),
          message: data.message ? sanitizeText(data.message) : null,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Consulta agendada",
        description: "Sua consulta pastoral foi agendada com sucesso. Entraremos em contato em breve.",
      });
      
      form.reset();
      setSelectedDate('');
      fetchAvailableSchedules();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao agendar consulta. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consulta Pastoral</h1>
        <p className="text-muted-foreground">
          Agende uma consulta com nosso pastor para orientação espiritual e aconselhamento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {/* Informações da Igreja */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.seeklogo.com/logo-png/27/1/imw-igreja-metodista-wesleyana-logo-png_seeklogo-275760.png?v=1962823770704272104" 
                  alt="Igreja Metodista Wesleyana Logo" 
                  className="h-10 w-auto" 
                />
                <div>
                  <span className="hidden font-montserrat font-bold text-lg text-church-blue sm:inline-block">
                    Igreja Metodista Wesleyana
                  </span>
                  <span className="font-montserrat font-bold text-lg text-church-blue sm:hidden">
                    IMW
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Telefone</h3>
                  <p className="text-sm text-muted-foreground">(21) 2719-3106</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">E-mail</h3>
                  <p className="text-sm text-muted-foreground">imwcentraldeniteroi@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Endereço</h3>
                  <p className="text-sm text-muted-foreground">
                    Rua Barão do Amazonas, 207<br />
                    Centro, Niterói - RJ<br />
                    CEP: 24030-111
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horários de Atendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4" />
                  <span>Quintas:</span>
                </div>
                <p className="ml-6">Culto da Benção - 19:30h</p>
              </div>
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4" />
                  <span>Domingos:</span>
                </div>
                <p className="ml-6">Escola Bíblica Dominical - 9h</p>
                <p className="ml-6">Culto de Celebração - 18h</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Agendar Consulta Pastoral</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo para agendar sua consulta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="member_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="member_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="seu.email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="member_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(21) 98765-4321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="appointment_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedDate(value);
                              form.setValue('appointment_time', '');
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma data" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableDates.map(date => (
                                <SelectItem key={date} value={date}>
                                  {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="appointment_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um horário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableTimes.map(time => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo da Consulta</FormLabel>
                        <FormControl>
                          <Input placeholder="Aconselhamento, oração, orientação espiritual..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva brevemente o que gostaria de conversar..." 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="w-full sm:w-auto">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Agendar Consulta
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PastoralAppointment;

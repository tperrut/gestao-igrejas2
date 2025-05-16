
import React, { useState } from 'react';
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
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Clock, Calendar as CalendarIcon } from 'lucide-react';

// Horários pré-definidos para consultas
const availableTimeSlots = [
  "09:00", "10:00", "11:00", 
  "14:00", "15:00", "16:00", "17:00"
];

// Datas disponíveis (simulação)
const availableDates = [
  new Date(2025, 4, 20),
  new Date(2025, 4, 21),
  new Date(2025, 4, 22),
  new Date(2025, 4, 25),
  new Date(2025, 4, 28),
];

const PastoralAppointment: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  // Função para verificar se uma data está disponível
  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      availableDate => 
        availableDate.getDate() === date.getDate() && 
        availableDate.getMonth() === date.getMonth() &&
        availableDate.getFullYear() === date.getFullYear()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !name || !contactNumber || !reason) {
      toast({
        title: "Preenchimento incompleto",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    // Aqui seria feita a integração com o backend para salvar o agendamento
    toast({
      title: "Solicitação enviada!",
      description: `Seu agendamento para ${format(date, "dd 'de' MMMM", { locale: ptBR })} às ${time} foi recebido e está em análise.`,
    });
    
    // Limpar formulário
    setDate(undefined);
    setTime("");
    setName("");
    setContactNumber("");
    setReason("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-1/3">
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
        
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="member" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="member">Sou Membro</TabsTrigger>
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
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          placeholder="Digite seu nome"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                    
                    <div className="space-y-2">
                      <Label>Selecione uma data</Label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => {
                          const day = date.getDay();
                          // Desabilita finais de semana e datas não disponíveis
                          return day === 0 || day === 6 || !isDateAvailable(date);
                        }}
                        className="rounded-md border mx-auto"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Horário</Label>
                      <Select
                        value={time}
                        onValueChange={setTime}
                      >
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimeSlots.map(slot => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reason">Motivo da Consulta</Label>
                      <Textarea
                        id="reason"
                        placeholder="Descreva brevemente o motivo da sua consulta"
                        className="min-h-[100px]"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSubmit} className="bg-church-blue hover:bg-church-blue-dark">
                    Solicitar Agendamento
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Datas Disponíveis</CardTitle>
                  <CardDescription>
                    Defina as datas e horários disponíveis para consultas pastorais.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Próximos Agendamentos</h3>
                    <div className="border rounded-md p-4">
                      <p className="text-muted-foreground text-sm">Nenhum agendamento pendente.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Adicionar Novas Datas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="admin-date">Data</Label>
                        <Input
                          id="admin-date"
                          type="date"
                        />
                      </div>
                      <div>
                        <Label htmlFor="admin-times">Horários Disponíveis</Label>
                        <Select>
                          <SelectTrigger id="admin-times">
                            <SelectValue placeholder="Selecione os horários" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os Horários</SelectItem>
                            <SelectItem value="morning">Apenas Manhã (9h-12h)</SelectItem>
                            <SelectItem value="afternoon">Apenas Tarde (14h-18h)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Cancelar
                  </Button>
                  <Button className="bg-church-blue hover:bg-church-blue-dark">
                    Salvar Datas
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PastoralAppointment;

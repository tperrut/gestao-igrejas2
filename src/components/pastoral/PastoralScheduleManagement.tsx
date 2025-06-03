
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, PlusCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AvailableSchedule {
  id?: string;
  date: string;
  time: string;
  is_available: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

const PastoralScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<AvailableSchedule[]>([]);
  const [newSchedule, setNewSchedule] = useState<AvailableSchedule>({
    date: '',
    time: '',
    is_available: true,
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('pastoral_schedules')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.date || !newSchedule.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha data e horário.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('pastoral_schedules')
        .insert([{
          date: newSchedule.date,
          time: newSchedule.time,
          is_available: newSchedule.is_available,
          notes: newSchedule.notes || null
        }]);

      if (error) throw error;

      toast({
        title: "Horário adicionado",
        description: "O horário foi adicionado com sucesso à agenda pastoral.",
      });

      setNewSchedule({
        date: '',
        time: '',
        is_available: true,
        notes: ''
      });

      fetchSchedules();
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast({
        title: "Erro ao adicionar horário",
        description: "Não foi possível adicionar o horário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pastoral_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Horário removido",
        description: "O horário foi removido da agenda pastoral.",
      });

      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Erro ao remover horário",
        description: "Não foi possível remover o horário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('pastoral_schedules')
        .update({ is_available: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "A disponibilidade do horário foi atualizada.",
      });

      fetchSchedules();
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a disponibilidade.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Gerenciar Agenda Pastoral
          </CardTitle>
          <CardDescription>
            Configure os horários disponíveis para agendamentos pastorais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={newSchedule.date}
                onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Select
                value={newSchedule.time}
                onValueChange={(value) => setNewSchedule({ ...newSchedule, time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>
                      <Clock className="h-4 w-4 mr-2 inline" />
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                placeholder="Observações (opcional)"
                value={newSchedule.notes}
                onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
              />
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={handleAddSchedule}
                disabled={isLoading}
                className="w-full bg-church-blue"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horários Configurados</CardTitle>
          <CardDescription>
            Lista de todos os horários disponíveis na agenda pastoral.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      {new Date(schedule.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {schedule.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={schedule.is_available ? "default" : "secondary"}
                        className={`cursor-pointer ${
                          schedule.is_available 
                            ? "bg-green-500 hover:bg-green-600" 
                            : "bg-gray-500 hover:bg-gray-600"
                        }`}
                        onClick={() => schedule.id && toggleAvailability(schedule.id, schedule.is_available)}
                      >
                        {schedule.is_available ? "Disponível" : "Indisponível"}
                      </Badge>
                    </TableCell>
                    <TableCell>{schedule.notes || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => schedule.id && handleDeleteSchedule(schedule.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {schedules.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum horário configurado ainda.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PastoralScheduleManagement;

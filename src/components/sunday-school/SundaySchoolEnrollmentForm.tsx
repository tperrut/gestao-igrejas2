import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSundaySchool } from '@/hooks/useSundaySchool';
import { supabase } from '@/integrations/supabase/client';
import { SundaySchoolEnrollment } from '@/types/sundaySchoolTypes';

type EnrollmentFormValues = {
  member_id: string;
  class_id: string;
  enrollment_date: Date;
  status: 'active' | 'inactive' | 'transferred';
  notes?: string;
};

const formSchema = z.object({
  member_id: z.string().min(1, 'Selecione um membro'),
  class_id: z.string().min(1, 'Selecione uma turma'),
  enrollment_date: z.date({
    required_error: 'Data de matrícula é obrigatória',
  }),
  status: z.enum(['active', 'inactive', 'transferred']),
  notes: z.string().optional(),
});

interface SundaySchoolEnrollmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment?: SundaySchoolEnrollment | null;
}

export const SundaySchoolEnrollmentForm: React.FC<SundaySchoolEnrollmentFormProps> = ({
  open,
  onOpenChange,
  enrollment,
}) => {
  const { createEnrollment, updateEnrollment, classes, loading } = useSundaySchool();
  const [members, setMembers] = useState<Array<{ id: string; name: string; email?: string; birth_date?: string }>>([]);

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member_id: enrollment?.member_id || '',
      class_id: enrollment?.class_id || '',
      enrollment_date: enrollment?.enrollment_date ? new Date(enrollment.enrollment_date) : new Date(),
      status: (enrollment?.status as EnrollmentFormValues['status']) || 'active',
      notes: enrollment?.notes || '',
    },
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('id, name, email, birth_date')
          .eq('status', 'active')
          .order('name');

        if (error) throw error;
        setMembers(data || []);
      } catch (error) {
        console.error('Erro ao carregar membros:', error);
      }
    };

    if (open) {
      fetchMembers();
    }
  }, [open]);

  const onSubmit = async (data: EnrollmentFormValues) => {
    const enrollmentData = {
      ...data,
      enrollment_date: format(data.enrollment_date, 'yyyy-MM-dd'),
    };

    let success;
    if (enrollment) {
      success = await updateEnrollment(enrollment.id, enrollmentData);
    } else {
      success = await createEnrollment(enrollmentData);
    }
    
    if (success) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {enrollment ? 'Editar Matrícula' : 'Nova Matrícula'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="member_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membro *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um membro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.email}
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
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turma *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma turma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes
                        .filter(cls => cls.status === 'active')
                        .map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name} ({cls.age_group})
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
              name="enrollment_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Matrícula *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                      <SelectItem value="transferred">Transferida</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações sobre a matrícula"
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
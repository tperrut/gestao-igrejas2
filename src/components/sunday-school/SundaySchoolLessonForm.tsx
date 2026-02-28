import React from 'react';
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
import { SundaySchoolLessonFormValues } from '@/types/sundaySchoolTypes';

const formSchema = z.object({
  class_id: z.string().min(1, 'Selecione uma turma'),
  teacher_id: z.string().min(1, 'Selecione um professor'),
  lesson_date: z.date({
    required_error: 'Data da aula é obrigatória',
  }),
  topic: z.string().optional(),
  // ✅ Aceita string vazia durante digitação; valida como número no submit
  offering_amount: z.string().optional(),
  notes: z.string().optional(),
});

interface SundaySchoolLessonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: any;
}

export const SundaySchoolLessonForm: React.FC<SundaySchoolLessonFormProps> = ({
  open,
  onOpenChange,
  lesson,
}) => {
  const { createLesson, updateLesson, classes, teachers, loading } = useSundaySchool();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class_id: lesson?.class_id || '',
      teacher_id: lesson?.teacher_id || '',
      lesson_date: lesson?.lesson_date ? new Date(lesson.lesson_date) : new Date(),
      topic: lesson?.topic || '',
      // ✅ Começa vazio — placeholder "0.00" já comunica o formato esperado
      offering_amount: lesson?.offering_amount != null ? String(lesson.offering_amount) : '',
      notes: lesson?.notes || '',
    },
  });

  const onSubmit = async (data: any) => {
    const lessonData = {
      ...data,
      lesson_date: format(data.lesson_date, 'yyyy-MM-dd'),
      // ✅ Converte para número no submit; campo vazio vira 0
      offering_amount: parseFloat(data.offering_amount) || 0,
    };

    const success = lesson
      ? await updateLesson(lesson.id, lessonData)
      : await createLesson(lessonData);

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
            {lesson ? 'Editar Aula' : 'Nova Aula'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="teacher_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professor *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um professor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers
                        .filter(teacher => teacher.status === 'active')
                        .map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                            {teacher.specialization && ` (${teacher.specialization})`}
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
              name="lesson_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Aula *</FormLabel>
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
                        disabled={(date) => {
                          const day = date.getDay();
                          return day !== 0;
                        }}
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
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tópico da Aula</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Parábola do Bom Samaritano" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offering_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Oferta (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      // ✅ value controlado como string — campo começa vazio
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      // ✅ Ao sair do campo, formata para 2 casas decimais se tiver valor
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        field.onChange(isNaN(val) ? '' : val.toFixed(2));
                        field.onBlur();
                      }}
                    />
                  </FormControl>
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
                      placeholder="Observações sobre a aula"
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
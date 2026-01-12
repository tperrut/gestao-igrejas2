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
import { useSundaySchool } from '@/hooks/useSundaySchool';
import { SundaySchoolClassFormValues, SundaySchoolClass } from '@/types/sundaySchoolTypes';

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  age_group: z.string().min(1, 'Faixa etária é obrigatória'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

interface SundaySchoolClassFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  class?: SundaySchoolClass | null;
}

export const SundaySchoolClassForm: React.FC<SundaySchoolClassFormProps> = ({
  open,
  onOpenChange,
  class: classData,
}) => {
  const { createClass, updateClass, loading } = useSundaySchool();

  const form = useForm<SundaySchoolClassFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: classData?.name || '',
      age_group: classData?.age_group || '',
      description: classData?.description || '',
      status: classData?.status || 'active',
    },
  });

  const onSubmit = async (data: SundaySchoolClassFormValues) => {
    let success;
    if (classData) {
      success = await updateClass(classData.id, data);
    } else {
      success = await createClass(data);
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
            {classData ? 'Editar Turma' : 'Nova Turma'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Turma *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Berçário, Primários, Juvenis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age_group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faixa Etária *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a faixa etária" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-2 anos">0-2 anos (Berçário)</SelectItem>
                      <SelectItem value="3-5 anos">3-5 anos (Jardim)</SelectItem>
                      <SelectItem value="6-8 anos">6-8 anos (Primários)</SelectItem>
                      <SelectItem value="9-11 anos">9-11 anos (Juniores)</SelectItem>
                      <SelectItem value="12-14 anos">12-14 anos (Juvenis)</SelectItem>
                      <SelectItem value="15-17 anos">15-17 anos (Jovens)</SelectItem>
                      <SelectItem value="18+ anos">18+ anos (Adultos)</SelectItem>
                      <SelectItem value="Personalizada">Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição da turma, objetivos, características especiais..."
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
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
                    </SelectContent>
                  </Select>
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
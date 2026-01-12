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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  visitor_name: z.string().min(1, 'Nome é obrigatório'),
  present: z.boolean().default(true),
  arrival_time: z.string().optional(),
  notes: z.string().optional(),
});

type VisitorFormValues = {
  visitor_name: string;
  present: boolean;
  arrival_time?: string;
  notes?: string;
};

interface SundaySchoolVisitorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: VisitorFormValues) => void;
  loading?: boolean;
}

export const SundaySchoolVisitorForm: React.FC<SundaySchoolVisitorFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visitor_name: '',
      present: true,
      arrival_time: '',
      notes: '',
    },
  });

  const handleSubmit = async (data: VisitorFormValues) => {
    await onSubmit(data);
    if (!loading) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Visitante</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="visitor_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Visitante *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do visitante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="present"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Presente</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Marcar visitante como presente
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arrival_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário de Chegada</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
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
                    <Input placeholder="Observações sobre o visitante" {...field} />
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
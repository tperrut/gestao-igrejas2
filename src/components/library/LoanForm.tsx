
import React from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const loanFormSchema = z.object({
  bookId: z.string().min(1, { message: "Selecione um livro" }),
  borrowerName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  borrowDate: z.string().min(1, { message: "Data de empréstimo é obrigatória" }),
  dueDate: z.string().min(1, { message: "Data de devolução é obrigatória" }),
  notes: z.string().optional(),
});

type LoanFormValues = z.infer<typeof loanFormSchema>;

// Mock de dados para o exemplo
const mockBooks = [
  { id: "1", title: "A Vida Cristã Prática" },
  { id: "2", title: "Comentário Bíblico" },
  { id: "3", title: "Liderança na Igreja" },
  { id: "4", title: "Adoração e Louvor" },
];

interface LoanFormProps {
  onSubmit: (data: LoanFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<LoanFormValues>;
}

const LoanForm: React.FC<LoanFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {
    bookId: "",
    borrowerName: "",
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: "",
  },
}) => {
  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues,
  });
  const { toast } = useToast();

  const handleSubmit = (data: LoanFormValues) => {
    onSubmit(data);
    toast({
      title: "Empréstimo registrado",
      description: "O empréstimo foi registrado com sucesso.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="bookId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Livro</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um livro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockBooks.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title}
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
          name="borrowerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Solicitante</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="borrowDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Empréstimo</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Devolução</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Input placeholder="Observações adicionais" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            Registrar Empréstimo
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoanForm;

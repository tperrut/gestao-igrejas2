
import React, { useEffect, useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { Book } from './BookModal';
import { Member } from '../members/MembersList';

const loanFormSchema = z.object({
  book_id: z.string().min(1, { message: "Selecione um livro" }),
  member_id: z.string().min(1, { message: "Selecione um membro" }),
  borrow_date: z.string().min(1, { message: "Data de empréstimo é obrigatória" }),
  due_date: z.string().min(1, { message: "Data de devolução é obrigatória" }),
  notes: z.string().optional(),
});

export type LoanFormValues = z.infer<typeof loanFormSchema>;

interface LoanFormProps {
  onSubmit: (data: LoanFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<LoanFormValues>;
}

const LoanForm: React.FC<LoanFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {
    book_id: "",
    member_id: "",
    borrow_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: "",
  },
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  
  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBooksAndMembers();
  }, []);

  async function fetchBooksAndMembers() {
    setLoading(true);
    try {
      // Buscar livros disponíveis
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .gt('available_copies', 0)
        .order('title');
      
      // Buscar membros ativos
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (booksError) throw booksError;
      if (membersError) throw membersError;
      
      setBooks(booksData as Book[]);
      setMembers(membersData as Member[]);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar livros e membros.",
        variant: "destructive"
      });
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (data: LoanFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="book_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Livro</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um livro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title} - {book.author} ({book.available_copies} disponíveis)
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
          name="member_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membro</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um membro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="borrow_date"
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
            name="due_date"
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
          <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
            Registrar Empréstimo
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoanForm;

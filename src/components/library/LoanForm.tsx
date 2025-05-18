
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Member, Book } from "@/types/libraryTypes";

const loanFormSchema = z.object({
  book_id: z.string().min(1, { message: "Livro é obrigatório" }),
  member_id: z.string().min(1, { message: "Membro é obrigatório" }),
  borrow_date: z.string().min(1, { message: "Data de empréstimo é obrigatória" }),
  due_date: z.string().min(1, { message: "Data de devolução é obrigatória" }),
  notes: z.string().optional(),
});

export type LoanFormValues = z.infer<typeof loanFormSchema>;

interface LoanFormProps {
  defaultValues?: Partial<LoanFormValues>;
  onSubmit: (data: LoanFormValues) => void;
  onCancel: () => void;
}

const LoanForm: React.FC<LoanFormProps> = ({
  defaultValues = {
    book_id: "",
    member_id: "",
    borrow_date: new Date().toISOString().split("T")[0],
    due_date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split("T")[0],
    notes: "",
  },
  onSubmit,
  onCancel
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues,
  });

  useEffect(() => {
    async function fetchBooks() {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .gt('available_copies', 0)
          .order('title');

        if (error) throw error;
        setBooks(data || []);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      } finally {
        setIsLoadingBooks(false);
      }
    }

    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('status', 'active')
          .order('name');

        if (error) throw error;
        setMembers(data || []);
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      } finally {
        setIsLoadingMembers(false);
      }
    }

    fetchBooks();
    fetchMembers();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="book_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Livro</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um livro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingBooks ? (
                    <SelectItem value="loading" disabled>Carregando livros...</SelectItem>
                  ) : books.length > 0 ? (
                    books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title} - {book.author} ({book.available_copies} disponíveis)
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>Nenhum livro disponível</SelectItem>
                  )}
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um membro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingMembers ? (
                    <SelectItem value="loading" disabled>Carregando membros...</SelectItem>
                  ) : members.length > 0 ? (
                    members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>Nenhum membro ativo</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Textarea placeholder="Observações sobre o empréstimo..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};

export default LoanForm;


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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sanitizeText } from "@/utils/validation";

const bookFormSchema = z.object({
  title: z.string().min(3, { message: "Título deve ter pelo menos 3 caracteres" }),
  author: z.string().min(2, { message: "Autor deve ter pelo menos 2 caracteres" }),
  category: z.string().min(1, { message: "Categoria é obrigatória" }),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  publication_year: z.string().optional(),
  copies: z.coerce.number().min(1, { message: "Quantidade deve ser pelo menos 1" }),
  description: z.string().optional(),
  cover_url: z.string().optional(),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  defaultValues?: Partial<BookFormValues>;
  onSubmit: (data: BookFormValues) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({
  defaultValues = {
    title: "",
    author: "",
    category: "",
    isbn: "",
    publisher: "",
    publication_year: "",
    copies: 1,
    description: "",
    cover_url: "",
  },
  onSubmit,
  onCancel
}) => {
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues,
  });

  const handleSanitizedSubmit = (data: BookFormValues) => {
    const sanitized: BookFormValues = {
      title: sanitizeText(data.title),
      author: sanitizeText(data.author),
      category: sanitizeText(data.category),
      isbn: sanitizeText(data.isbn || ''),
      publisher: sanitizeText(data.publisher || ''),
      publication_year: sanitizeText(data.publication_year || ''),
      copies: Number(data.copies),
      description: sanitizeText(data.description || ''),
      cover_url: sanitizeText(data.cover_url || ''),
    };
    onSubmit(sanitized);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSanitizedSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="A Vida Cristã Prática" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Autor</FormLabel>
              <FormControl>
                <Input placeholder="João Oliveira" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Vida Cristã">Vida Cristã</SelectItem>
                    <SelectItem value="Estudo Bíblico">Estudo Bíblico</SelectItem>
                    <SelectItem value="Liderança">Liderança</SelectItem>
                    <SelectItem value="Música">Música</SelectItem>
                    <SelectItem value="História">História</SelectItem>
                    <SelectItem value="Discipulado">Discipulado</SelectItem>
                    <SelectItem value="Teologia">Teologia</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="copies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input placeholder="978-85-333-0227-3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publisher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Editora</FormLabel>
                <FormControl>
                  <Input placeholder="Editora Vida" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="publication_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano de Publicação</FormLabel>
              <FormControl>
                <Input placeholder="2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cover_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Capa</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
              </FormControl>
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
                <Textarea placeholder="Descreva o livro..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">Cancelar</Button>
          <Button type="submit" className="w-full sm:w-auto">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};

export default BookForm;

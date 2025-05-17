
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types/libraryTypes';
import { BookFormValues } from '@/components/library/BookForm';
import { useToast } from "@/components/ui/use-toast";

export const useBookService = () => {
  const { toast } = useToast();

  const fetchBooks = async (): Promise<Book[]> => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');
      
      if (error) {
        throw error;
      }
      
      return data as Book[] || [];
    } catch (error) {
      toast({
        title: "Erro ao carregar livros",
        description: "Ocorreu um erro ao buscar os livros.",
        variant: "destructive"
      });
      console.error("Erro ao buscar livros:", error);
      return [];
    }
  };

  const saveBook = async (book: BookFormValues, editingBookId?: string): Promise<boolean> => {
    try {
      if (editingBookId) {
        // Update existing book
        const { error } = await supabase
          .from('books')
          .update({
            title: book.title,
            author: book.author,
            category: book.category,
            isbn: book.isbn || null,
            publisher: book.publisher || null,
            publication_year: book.publication_year || null,
            copies: book.copies,
            description: book.description || null,
            cover_url: book.cover_url || null
          })
          .eq('id', editingBookId);

        if (error) throw error;

        toast({
          title: "Livro atualizado",
          description: `${book.title} foi atualizado com sucesso.`
        });
      } else {
        // Create new book
        const { error } = await supabase
          .from('books')
          .insert([{
            title: book.title,
            author: book.author,
            category: book.category,
            isbn: book.isbn || null,
            publisher: book.publisher || null,
            publication_year: book.publication_year || null,
            copies: book.copies,
            available_copies: book.copies,
            description: book.description || null,
            cover_url: book.cover_url || null
          }]);

        if (error) throw error;

        toast({
          title: "Livro adicionado",
          description: `${book.title} foi adicionado com sucesso.`
        });
      }
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o livro.",
        variant: "destructive"
      });
      console.error("Erro ao salvar livro:", error);
      return false;
    }
  };

  return {
    fetchBooks,
    saveBook
  };
};

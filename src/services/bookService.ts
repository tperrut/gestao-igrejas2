
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types/libraryTypes';
import { useToast } from "@/components/ui/use-toast";
import { logger } from '@/utils/logger';

export const useBookService = () => {
  const { toast } = useToast();

  const logBookAction = (action: string, details: any) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    const logMessage = `[${timestamp}] ${action}`;
    
    console.log(logMessage, details);
    logger.businessLog(action, details);
  };

  const fetchBooks = async (): Promise<Book[]> => {
    try {
      logger.dbLog('Fetching books from database');
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');

      if (error) {
        throw error;
      }

      const books = data || [];

      // Log detailed book query results
      logBookAction('CONSULTA_LIVROS', {
        totalLivros: books.length,
        livrosDisponiveis: books.filter(book => book.available_copies > 0).length,
        livrosIndisponiveis: books.filter(book => book.available_copies === 0).length,
        categorias: [...new Set(books.map(book => book.category))],
        autores: [...new Set(books.map(book => book.author))]
      });

      logger.dbLog('Books fetched successfully', { count: books.length });
      return books;
    } catch (error) {
      logger.dbError('Failed to fetch books', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro ao carregar livros",
        description: "Ocorreu um erro ao buscar os livros.",
        variant: "destructive"
      });
      console.error("Erro ao buscar livros:", error);
      return [];
    }
  };

  const saveBook = async (bookData: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    try {
      logger.businessLog('Creating new book', { title: bookData.title, author: bookData.author });
      
      const { error } = await supabase
        .from('books')
        .insert([bookData]);

      if (error) throw error;

      // Log detailed book creation
      logBookAction('LIVRO_CRIADO', {
        titulo: bookData.title,
        autor: bookData.author,
        categoria: bookData.category,
        isbn: bookData.isbn,
        copias: bookData.copies,
        copiasDisponiveis: bookData.available_copies
      });

      toast({
        title: "Livro adicionado",
        description: "O livro foi adicionado com sucesso."
      });
      return true;
    } catch (error) {
      logger.businessError('Failed to create book', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o livro.",
        variant: "destructive"
      });
      console.error("Erro ao criar livro:", error);
      return false;
    }
  };

  const updateBook = async (id: string, bookData: Partial<Book>): Promise<boolean> => {
    try {
      logger.businessLog('Updating book', { id, updates: bookData });
      
      const { error } = await supabase
        .from('books')
        .update(bookData)
        .eq('id', id);

      if (error) throw error;

      // Log detailed book update
      logBookAction('LIVRO_ATUALIZADO', {
        id,
        titulo: bookData.title,
        autor: bookData.author,
        alteracoes: Object.keys(bookData)
      });

      toast({
        title: "Livro atualizado",
        description: "O livro foi atualizado com sucesso."
      });
      return true;
    } catch (error) {
      logger.businessError('Failed to update book', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o livro.",
        variant: "destructive"
      });
      console.error("Erro ao atualizar livro:", error);
      return false;
    }
  };

  const deleteBook = async (id: string): Promise<boolean> => {
    try {
      // Get book details for logging
      const { data: bookData } = await supabase
        .from('books')
        .select('title, author')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log detailed book deletion
      logBookAction('LIVRO_REMOVIDO', {
        id,
        titulo: bookData?.title,
        autor: bookData?.author
      });

      toast({
        title: "Livro removido",
        description: "O livro foi removido com sucesso."
      });
      return true;
    } catch (error) {
      logger.businessError('Failed to delete book', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o livro.",
        variant: "destructive"
      });
      console.error("Erro ao deletar livro:", error);
      return false;
    }
  };

  return {
    fetchBooks,
    saveBook,
    updateBook,
    deleteBook
  };
};

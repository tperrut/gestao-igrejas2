
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types/libraryTypes';
import { useToast } from "@/components/ui/use-toast";
import { logger } from '@/utils/logger';
import { getDefaultTenantId } from '@/utils/tenant';

export const useBookService = () => {
  const { toast } = useToast();

  const logBookAction = (action: string, details?: unknown) => {
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

  const saveBook = async (bookData: Omit<Book, 'id' | 'created_at' | 'updated_at'>, bookId?: string): Promise<boolean> => {
    try {
      if (bookId) {
        // Update existing book
        logger.businessLog('Updating book', { id: bookId, updates: bookData });
        
        const { error } = await supabase
          .from('books')
          .update({
            title: bookData.title,
            author: bookData.author,
            category: bookData.category,
            isbn: bookData.isbn,
            publisher: bookData.publisher,
            publication_year: bookData.publication_year,
            copies: bookData.copies,
            description: bookData.description,
            cover_url: bookData.cover_url,
          })
          .eq('id', bookId);

        if (error) throw error;

        // Log detailed book update
        logBookAction('LIVRO_ATUALIZADO', {
          id: bookId,
          titulo: bookData.title,
          autor: bookData.author,
          alteracoes: Object.keys(bookData)
        });

        toast({
          title: "Livro atualizado",
          description: `${bookData.title} foi atualizado com sucesso.`
        });
      } else {
        // Create new book
        logger.businessLog('Creating new book', { title: bookData.title, author: bookData.author });
        
        const { error } = await supabase
          .from('books')
          .insert([{
            title: bookData.title,
            author: bookData.author,
            category: bookData.category,
            isbn: bookData.isbn,
            publisher: bookData.publisher,
            publication_year: bookData.publication_year,
            copies: bookData.copies,
            available_copies: bookData.available_copies,
            description: bookData.description,
            cover_url: bookData.cover_url,
            tenant_id: getDefaultTenantId(),
          }]);

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
          description: `${bookData.title} foi adicionado com sucesso.`
        });
      }
      
      return true;
    } catch (error) {
      logger.businessError('Failed to save book', error instanceof Error ? error : new Error(String(error)));
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o livro.",
        variant: "destructive"
      });
      console.error("Erro ao salvar livro:", error);
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

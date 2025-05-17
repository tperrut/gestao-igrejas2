
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Book } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import BookModal from '@/components/library/BookModal';
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/components/library/BookModal';
import { BookFormValues } from '@/components/library/BookForm';

const BookCard: React.FC<{ book: Book; onEdit: () => void }> = ({ book, onEdit }) => (
  <Card className="card-hover">
    <CardHeader className="p-0">
      <div className="h-48 overflow-hidden rounded-t-lg">
        <img
          src={book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200'}
          alt={book.title}
          className="h-full w-full object-cover"
        />
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <CardTitle className="text-lg">{book.title}</CardTitle>
      <p className="text-sm text-muted-foreground">{book.author}</p>
      <div className="mt-2 flex items-center">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${book.available_copies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {book.available_copies > 0 ? 'Disponível' : 'Emprestado'}
        </span>
        <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
          {book.category}
        </span>
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0 flex gap-2">
      <Button variant={book.available_copies > 0 ? "default" : "outline"} className="flex-1" disabled={book.available_copies <= 0}>
        {book.available_copies > 0 ? 'Emprestar Livro' : 'Reservar Livro'}
      </Button>
      <Button variant="outline" size="icon" onClick={onEdit}>
        <Book className="h-4 w-4" />
      </Button>
    </CardFooter>
  </Card>
);

const Library: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setBooks(data as Book[]);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar livros",
        description: "Ocorreu um erro ao buscar os livros.",
        variant: "destructive"
      });
      console.error("Erro ao buscar livros:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditingBook(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleSaveBook = async (book: BookFormValues) => {
    try {
      if (editingBook?.id) {
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
          .eq('id', editingBook.id);

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

      // Recarregar a lista de livros
      fetchBooks();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o livro.",
        variant: "destructive"
      });
      console.error("Erro ao salvar livro:", error);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
        <p className="text-muted-foreground">
          Gerenciar acervo, empréstimos e reservas
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row justify-between">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Pesquisar livros por título, autor ou categoria..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="default" className="btn-primary" onClick={handleOpenCreateModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Novo Livro
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/loans'}>
            Gerenciar Empréstimos
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos os Livros</TabsTrigger>
          <TabsTrigger value="available">Disponíveis</TabsTrigger>
          <TabsTrigger value="borrowed">Emprestados</TabsTrigger>
          <TabsTrigger value="reserved">Reservados</TabsTrigger>
        </TabsList>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Carregando livros...</p>
          </div>
        ) : (
          <>
            <TabsContent value="all" className="mt-0">
              {filteredBooks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum livro encontrado.
                </p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} onEdit={() => handleOpenEditModal(book)} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="available" className="mt-0">
              {filteredBooks.filter(book => book.available_copies > 0).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum livro disponível encontrado.
                </p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredBooks.filter(book => book.available_copies > 0).map((book) => (
                    <BookCard key={book.id} book={book} onEdit={() => handleOpenEditModal(book)} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="borrowed" className="mt-0">
              {filteredBooks.filter(book => book.available_copies < book.copies).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum livro emprestado encontrado.
                </p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredBooks.filter(book => book.available_copies < book.copies).map((book) => (
                    <BookCard key={book.id} book={book} onEdit={() => handleOpenEditModal(book)} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="reserved" className="mt-0">
              <p className="text-center text-muted-foreground py-8">
                Não há livros reservados no momento.
              </p>
            </TabsContent>
          </>
        )}
      </Tabs>

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBook}
        book={editingBook}
        title={editingBook ? "Editar Livro" : "Novo Livro"}
      />
    </div>
  );
};

export default Library;

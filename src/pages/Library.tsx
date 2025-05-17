
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookModal from '@/components/library/BookModal';
import { BookFormValues } from '@/components/library/BookForm';
import { Book } from '@/types/libraryTypes';
import { useBookService } from '@/services/bookService';
import BookFilterHeader from '@/components/library/BookFilterHeader';
import BookList from '@/components/library/BookList';

const Library: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { fetchBooks, saveBook } = useBookService();

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    setLoading(true);
    const fetchedBooks = await fetchBooks();
    setBooks(fetchedBooks);
    setLoading(false);
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
    const success = await saveBook(book, editingBook?.id);
    if (success) {
      loadBooks();
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
        <p className="text-muted-foreground">
          Gerenciar acervo, empréstimos e reservas
        </p>
      </div>

      <BookFilterHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddBook={handleOpenCreateModal}
      />

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
              <BookList 
                books={filteredBooks} 
                onEdit={handleOpenEditModal} 
              />
            </TabsContent>
            <TabsContent value="available" className="mt-0">
              <BookList 
                books={filteredBooks.filter(book => book.available_copies > 0)} 
                onEdit={handleOpenEditModal} 
                emptyMessage="Nenhum livro disponível encontrado."
              />
            </TabsContent>
            <TabsContent value="borrowed" className="mt-0">
              <BookList 
                books={filteredBooks.filter(book => book.available_copies < book.copies)} 
                onEdit={handleOpenEditModal} 
                emptyMessage="Nenhum livro emprestado encontrado."
              />
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

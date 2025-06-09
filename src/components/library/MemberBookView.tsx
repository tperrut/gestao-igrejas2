
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from 'lucide-react';
import { Book } from '@/types/libraryTypes';
import { useBookService } from '@/services/bookService';
import BookDetailModal from './BookDetailModal';

const MemberBookView: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const { fetchBooks } = useBookService();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    const data = await fetchBooks();
    setBooks(data);
    setLoading(false);
  };

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setDetailModalOpen(true);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(books.map(book => book.category)));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">Carregando livros...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Biblioteca</h2>
          <p className="text-muted-foreground">Explore e reserve livros da nossa biblioteca.</p>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou autor..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Livros com Imagens */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="card-hover overflow-hidden">
            <CardHeader className="p-0">
              <div className="h-48 overflow-hidden">
                <img
                  src={book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200'}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
                <Badge variant={book.available_copies > 0 ? "default" : "destructive"} className="shrink-0">
                  {book.available_copies > 0 ? "Disponível" : "Indisponível"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">por {book.author}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categoria:</span>
                  <span>{book.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cópias disponíveis:</span>
                  <span>{book.available_copies} de {book.copies}</span>
                </div>
                {book.publication_year && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ano:</span>
                    <span>{book.publication_year}</span>
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleViewDetails(book)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes e Reservar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum livro encontrado com os filtros aplicados.</p>
        </div>
      )}

      {/* Modal de Detalhes */}
      <BookDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        book={selectedBook}
        onReservationSuccess={loadBooks}
      />
    </div>
  );
};

export default MemberBookView;

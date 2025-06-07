
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, Heart, Search, Filter } from 'lucide-react';
import { Book as BookType } from '@/types/libraryTypes';
import { Reservation } from '@/types/reservationTypes';
import { useBookService } from '@/services/bookService';
import { useReservationService } from '@/services/reservationService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const MemberBookView: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentMember, setCurrentMember] = useState<any>(null);

  const { fetchBooks } = useBookService();
  const { fetchReservations, createReservation, cancelReservation } = useReservationService();
  const { user } = useAuth();

  useEffect(() => {
    loadData();
    fetchCurrentMember();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [booksData, reservationsData] = await Promise.all([
      fetchBooks(),
      fetchReservations()
    ]);
    setBooks(booksData);
    setReservations(reservationsData);
    setLoading(false);
  };

  const fetchCurrentMember = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Erro ao buscar membro:', error);
        return;
      }

      setCurrentMember(data);
    } catch (error) {
      console.error('Erro ao buscar membro:', error);
    }
  };

  const handleReserveBook = async (bookId: string) => {
    if (!currentMember) {
      console.error('Membro não encontrado');
      return;
    }

    const success = await createReservation(bookId, currentMember.id);
    if (success) {
      await loadData();
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    const success = await cancelReservation(reservationId);
    if (success) {
      await loadData();
    }
  };

  const getBookStatus = (book: BookType) => {
    const activeReservation = reservations.find(r => 
      r.book_id === book.id && r.status === 'active'
    );
    
    if (activeReservation) {
      const isMyReservation = currentMember && activeReservation.member_id === currentMember.id;
      return {
        status: isMyReservation ? 'my-reservation' : 'reserved',
        reservation: activeReservation
      };
    }
    
    if (book.available_copies > 0) {
      return { status: 'available' };
    }
    
    return { status: 'borrowed' };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-500">Disponível</Badge>;
      case 'borrowed':
        return <Badge variant="destructive">Emprestado</Badge>;
      case 'reserved':
        return <Badge variant="secondary">Reservado</Badge>;
      case 'my-reservation':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Minha Reserva</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
    
    if (statusFilter === 'all') return matchesSearch && matchesCategory;
    
    const bookStatus = getBookStatus(book).status;
    return matchesSearch && matchesCategory && bookStatus === statusFilter;
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
        <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
        <p className="text-muted-foreground">
          Visualize os livros disponíveis e faça suas reservas.
        </p>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="available">Disponível</SelectItem>
            <SelectItem value="borrowed">Emprestado</SelectItem>
            <SelectItem value="reserved">Reservado</SelectItem>
            <SelectItem value="my-reservation">Minhas Reservas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Livros */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => {
          const bookStatusInfo = getBookStatus(book);
          const canReserve = bookStatusInfo.status === 'available';
          const isMyReservation = bookStatusInfo.status === 'my-reservation';

          return (
            <Card key={book.id} className="card-hover">
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
                <CardTitle className="text-lg mb-2">{book.title}</CardTitle>
                <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {getStatusBadge(bookStatusInfo.status)}
                  <Badge variant="outline">{book.category}</Badge>
                </div>
                {book.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {book.description}
                  </p>
                )}
                <div className="flex gap-2">
                  {canReserve && (
                    <Button 
                      className="flex-1" 
                      onClick={() => handleReserveBook(book.id)}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Reservar
                    </Button>
                  )}
                  {isMyReservation && bookStatusInfo.reservation && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleCancelReservation(bookStatusInfo.reservation!.id)}
                    >
                      Cancelar Reserva
                    </Button>
                  )}
                  {!canReserve && !isMyReservation && (
                    <Button variant="outline" className="flex-1" disabled>
                      <Book className="mr-2 h-4 w-4" />
                      {bookStatusInfo.status === 'borrowed' ? 'Emprestado' : 'Reservado'}
                    </Button>
                  )}
                </div>
                {isMyReservation && bookStatusInfo.reservation && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Expira em: {new Date(bookStatusInfo.reservation.expires_at).toLocaleString('pt-BR')}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum livro encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default MemberBookView;

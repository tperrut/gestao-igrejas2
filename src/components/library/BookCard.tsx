
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Book as BookIcon, Edit } from 'lucide-react';
import { Book } from '@/types/libraryTypes';
import { useAuth } from '@/contexts/AuthContext';

interface BookCardProps {
  book: Book;
  onEdit: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit }) => {
  const { isAdmin } = useAuth();

  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="p-0">
        <div className="h-48 overflow-hidden">
          <img
            src={book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200'}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
        <p className="text-sm text-muted-foreground">por {book.author}</p>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${book.available_copies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {book.available_copies > 0 ? `${book.available_copies} disponível(is)` : 'Indisponível'}
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              {book.category}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Total: {book.copies} cópias
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {isAdmin() ? (
          <>
            <Button variant="outline" className="flex-1" disabled>
              <BookIcon className="h-4 w-4 mr-2" />
              Gerenciar
            </Button>
            <Button variant="outline" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button variant="outline" className="flex-1" disabled>
            <BookIcon className="h-4 w-4 mr-2" />
            Visualizar Detalhes
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;

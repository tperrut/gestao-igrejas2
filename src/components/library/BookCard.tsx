
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Book as BookIcon } from 'lucide-react';
import { Book } from '@/types/libraryTypes';

interface BookCardProps {
  book: Book;
  onEdit: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit }) => (
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
        <BookIcon className="h-4 w-4" />
      </Button>
    </CardFooter>
  </Card>
);

export default BookCard;


import React from 'react';
import { Book } from '@/types/libraryTypes';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  emptyMessage?: string;
}

const BookList: React.FC<BookListProps> = ({ books, onEdit, emptyMessage = "Nenhum livro encontrado." }) => {
  if (books.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onEdit={() => onEdit(book)} />
      ))}
    </div>
  );
};

export default BookList;

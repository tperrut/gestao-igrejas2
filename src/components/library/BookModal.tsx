
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BookForm from './BookForm';

interface Book {
  id?: number;
  title: string;
  author: string;
  category: string;
  isbn?: string;
  publisher?: string;
  publicationYear?: string;
  copies: number;
  description?: string;
  cover?: string;
  available?: boolean;
}

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, 'id' | 'available'>) => void;
  book?: Book;
  title: string;
}

const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  onSave,
  book,
  title
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <BookForm 
          defaultValues={book}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;

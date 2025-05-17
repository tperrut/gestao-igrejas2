
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BookForm, { BookFormValues } from './BookForm';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn?: string;
  publisher?: string;
  publication_year?: string;
  copies: number;
  available_copies: number;
  cover_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: BookFormValues) => void;
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
      <DialogContent className="w-full max-w-[95%] sm:max-w-[600px] h-[90vh] sm:h-auto overflow-y-auto">
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

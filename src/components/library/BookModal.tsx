
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BookForm, { BookFormValues } from './BookForm';
import { Book } from '@/types/libraryTypes';
import { useBookService } from '@/services/bookService';
import { useToast } from "@/components/ui/use-toast";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book | null;
  onSuccess: () => void;
}

const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  book,
  onSuccess
}) => {
  const { saveBook } = useBookService();
  const { toast } = useToast();

  const handleSave = async (formData: BookFormValues) => {
    // For new books, available_copies should equal copies
    // For existing books, preserve the current available_copies unless copies changed
    const bookData = {
      title: formData.title,
      author: formData.author,
      category: formData.category,
      isbn: formData.isbn || '',
      publisher: formData.publisher || '',
      publication_year: formData.publication_year || '',
      copies: formData.copies,
      description: formData.description || '',
      cover_url: formData.cover_url || '',
      available_copies: book 
        ? (formData.copies !== book.copies 
            ? book.available_copies + (formData.copies - book.copies)
            : book.available_copies)
        : formData.copies
    };

    const success = await saveBook(bookData, book?.id);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const title = book ? "Editar Livro" : "Adicionar Livro";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95%] sm:max-w-[600px] h-[90vh] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <BookForm 
          defaultValues={book}
          onSubmit={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;


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
    const success = await saveBook(formData, book?.id);
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

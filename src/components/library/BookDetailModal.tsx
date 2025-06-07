
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Calendar, FileText, Hash, Building, Users } from 'lucide-react';
import { Book as BookType } from '@/types/libraryTypes';
import { useReservationService } from '@/services/reservationService';
import { useAuth } from '@/contexts/AuthContext';

interface BookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookType | null;
  onReservationSuccess?: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({
  isOpen,
  onClose,
  book,
  onReservationSuccess
}) => {
  const { createReservation } = useReservationService();
  const { user } = useAuth();

  if (!book) return null;

  const handleReserve = async () => {
    if (!user) return;
    console.log("Reservando livro:", book.id, "para usuário:", user.id);
    const success = await createReservation(book.id, user.id);
    if (success) {
      onReservationSuccess?.();
      onClose();
    }
  };

  const isAvailable = book.copies > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Detalhes do Livro
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Capa e informações básicas */}
          <div className="flex flex-col sm:flex-row gap-4">
            {book.cover_url && (
              <div className="flex-shrink-0">
                <img 
                  src={book.cover_url} 
                  alt={book.title}
                  className="w-32 h-48 object-cover rounded-lg border"
                />
              </div>
            )}
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-semibold">{book.title}</h3>
                <p className="text-muted-foreground">por {book.author}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant={isAvailable ? "default" : "destructive"}>
                  {isAvailable ? "Disponível" : "Indisponível"}
                </Badge>
                <Badge variant="outline">{book.category}</Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{book.copies} cópias</span>
                </div>
                {book.publication_year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{book.publication_year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informações detalhadas */}
          <div className="grid gap-4">
            {book.description && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Descrição
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {book.isbn && (
                <div>
                  <h4 className="font-medium mb-1 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    ISBN
                  </h4>
                  <p className="text-sm text-muted-foreground">{book.isbn}</p>
                </div>
              )}
              
              {book.publisher && (
                <div>
                  <h4 className="font-medium mb-1 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Editora
                  </h4>
                  <p className="text-sm text-muted-foreground">{book.publisher}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={handleReserve}
              disabled={!isAvailable}
              className="flex-1"
            >
              {isAvailable ? "Reservar Livro" : "Livro Indisponível"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailModal;


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

  const isAvailable = book.available_copies > 0;

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
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <img 
                src={book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200'} 
                alt={book.title}
                className="w-40 h-60 object-cover rounded-lg border shadow-md"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold leading-tight">{book.title}</h3>
                <p className="text-muted-foreground text-lg">por {book.author}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant={isAvailable ? "default" : "destructive"}>
                  {isAvailable ? `${book.available_copies} disponível(is)` : "Indisponível"}
                </Badge>
                <Badge variant="outline">{book.category}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{book.copies} cópias total</span>
                </div>
                {book.publication_year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{book.publication_year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informações detalhadas */}
          <div className="space-y-4">
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

            {/* Informação sobre reserva */}
            {isAvailable && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Como funciona a reserva?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Você terá 24 horas para retirar o livro na secretaria</li>
                  <li>• Após esse prazo, a reserva será cancelada automaticamente</li>
                  <li>• Leve um documento de identificação para retirada</li>
                </ul>
              </div>
            )}
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

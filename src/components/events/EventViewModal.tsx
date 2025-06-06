
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, User, Clock, FileText, ImageIcon } from 'lucide-react';
import { Event } from '@/types/libraryTypes';

interface EventViewModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  event?: Event | null;
}

const EventViewModal: React.FC<EventViewModalProps> = ({
  isOpen,
  onClose,
  event
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!event) return null;

  const getEventTypeBadge = (type: string) => {
    const styles = {
      culto: "bg-blue-500",
      reuniao: "bg-green-500",
      conferencia: "bg-purple-500",
      treinamento: "bg-amber-500",
      social: "bg-pink-500"
    };

    const labels = {
      culto: "Culto",
      reuniao: "Reunião",
      conferencia: "Conferência",
      treinamento: "Treinamento",
      social: "Social"
    };

    return (
      <Badge className={styles[type as keyof typeof styles] || "bg-gray-500"}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-[95%] sm:max-w-[700px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {getEventTypeBadge(event.type)}
            </div>

            {event.image_url && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ImageIcon className="h-4 w-4" />
                    Imagem do Evento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-md border cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setIsImageModalOpen(true)}
                    title="Clique para ampliar a imagem"
                  />
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-4 w-4" />
                    Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{new Date(event.date).toLocaleDateString('pt-BR')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4" />
                    Horário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{event.time}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="h-4 w-4" />
                    Local
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{event.location}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4" />
                    Organizador
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{event.organizer}</p>
                </CardContent>
              </Card>
            </div>

            {event.capacity && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4" />
                    Capacidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{event.capacity} pessoas</p>
                </CardContent>
              </Card>
            )}

            {event.description && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    Descrição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para exibir imagem ampliada */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="w-full max-w-[95vw] max-h-[95vh] p-2">
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img 
              src={event.image_url} 
              alt={event.title}
              className="max-w-full max-h-[80vh] object-contain rounded-md"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventViewModal;

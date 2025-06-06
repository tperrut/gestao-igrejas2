
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Member } from '@/types/libraryTypes';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mail, Phone, Calendar, UserRound, X } from 'lucide-react';

interface MemberViewModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  member: Member | null;
}

const MemberViewModal: React.FC<MemberViewModalProps> = ({
  isOpen,
  onClose,
  member
}) => {
  const [imageZoomed, setImageZoomed] = useState(false);

  if (!member) return null;

  const getInitials = (name: string): string => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Membro</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar 
                className="h-24 w-24 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => member.avatar_url && setImageZoomed(true)}
              >
                {member.avatar_url ? (
                  <AvatarImage src={member.avatar_url} alt={member.name} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {getInitials(member.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <h3 className="text-2xl font-bold">{member.name}</h3>
              <Badge 
                variant={member.status === 'active' ? "default" : "outline"}
                className={member.status === 'active' ? "bg-green-500" : ""}
              >
                {member.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">E-mail</p>
                  <p className="text-sm">{member.email}</p>
                </div>
              </div>

              {member.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                    <p className="text-sm">{member.phone}</p>
                  </div>
                </div>
              )}

              {member.role && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserRound className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Função</p>
                    <p className="text-sm">{member.role}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Data de Entrada</p>
                  <p className="text-sm">{formatDate(member.join_date)}</p>
                </div>
              </div>

              {member.birth_date && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
                    <p className="text-sm">{formatDate(member.birth_date)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Zoom da Imagem */}
      {imageZoomed && member.avatar_url && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setImageZoomed(false)}
        >
          <div className="relative max-w-2xl max-h-full">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/10 border-white/20 text-white hover:bg-white/20 z-10"
              onClick={() => setImageZoomed(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img 
              src={member.avatar_url} 
              alt={member.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MemberViewModal;


import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Course } from '@/types/libraryTypes';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, MapPin, Users, BookOpen, Image, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CourseViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

const CourseViewModal: React.FC<CourseViewModalProps> = ({
  isOpen,
  onClose,
  course
}) => {
  const [imageZoomed, setImageZoomed] = useState(false);

  if (!course) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', className: 'bg-green-500 hover:bg-green-600' },
      inactive: { label: 'Inativo', className: 'bg-gray-500 hover:bg-gray-600' },
      completed: { label: 'Concluído', className: 'bg-blue-500 hover:bg-blue-600' },
      coming_soon: { label: 'Em Breve', className: 'bg-orange-500 hover:bg-orange-600' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels = {
      biblia: 'Bíblia',
      lideranca: 'Liderança',
      discipulado: 'Discipulado',
      evangelismo: 'Evangelismo',
      familia: 'Família'
    };
    return categoryLabels[category as keyof typeof categoryLabels] || category;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Curso</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Imagem do Curso */}
            {course.image_url && (
              <div className="flex justify-center">
                <img 
                  src={course.image_url} 
                  alt={course.title}
                  className="w-full max-w-md h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setImageZoomed(true)}
                />
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="text-2xl font-bold">{course.title}</h3>
                  <div className="flex gap-2 mt-2">
                    {getStatusBadge(course.status)}
                    <Badge variant="outline">{getCategoryLabel(course.category)}</Badge>
                  </div>
                </div>
              </div>

              {course.description && (
                <div>
                  <h4 className="font-semibold mb-2">Descrição</h4>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Instrutor</p>
                    <p className="text-sm">{course.instructor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data de Início</p>
                    <p className="text-sm">{formatDate(course.start_date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data de Término</p>
                    <p className="text-sm">{formatDate(course.end_date)}</p>
                  </div>
                </div>

                {course.location && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Local</p>
                      <p className="text-sm">{course.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Alunos</p>
                    <p className="text-sm">{course.students || 0} / {course.max_students}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Categoria</p>
                    <p className="text-sm">{getCategoryLabel(course.category)}</p>
                  </div>
                </div>
              </div>

              {course.prerequisites && (
                <div>
                  <h4 className="font-semibold mb-2">Pré-requisitos</h4>
                  <p className="text-muted-foreground">{course.prerequisites}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Zoom da Imagem */}
      {imageZoomed && course.image_url && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setImageZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/10 border-white/20 text-white hover:bg-white/20 z-10"
              onClick={() => setImageZoomed(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img 
              src={course.image_url} 
              alt={course.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CourseViewModal;

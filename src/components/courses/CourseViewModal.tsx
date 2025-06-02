
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, User, BookOpen, Clock } from 'lucide-react';
import { Course } from '@/types/libraryTypes';

interface CourseViewModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  course?: Course | null;
}

const CourseViewModal: React.FC<CourseViewModalProps> = ({
  isOpen,
  onClose,
  course
}) => {
  if (!course) return null;

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-500",
      inactive: "bg-gray-500",
      completed: "bg-blue-500"
    };

    const labels = {
      active: "Ativo",
      inactive: "Inativo",
      completed: "Concluído"
    };

    return (
      <Badge className={styles[status as keyof typeof styles] || "bg-gray-500"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      biblia: "bg-purple-500",
      lideranca: "bg-blue-500",
      discipulado: "bg-green-500",
      evangelismo: "bg-red-500",
      familia: "bg-pink-500"
    };

    const labels = {
      biblia: "Bíblia",
      lideranca: "Liderança",
      discipulado: "Discipulado",
      evangelismo: "Evangelismo",
      familia: "Família"
    };

    return (
      <Badge className={styles[category as keyof typeof styles] || "bg-gray-500"}>
        {labels[category as keyof typeof labels] || category}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95%] sm:max-w-[700px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{course.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(course.status)}
            {getCategoryBadge(course.category)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  Instrutor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{course.instructor}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" />
                  Alunos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{course.students || 0} / {course.max_students || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  Data de Início
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{new Date(course.start_date).toLocaleDateString('pt-BR')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4" />
                  Data de Término
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{new Date(course.end_date).toLocaleDateString('pt-BR')}</p>
              </CardContent>
            </Card>
          </div>

          {course.location && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  Local
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{course.location}</p>
              </CardContent>
            </Card>
          )}

          {course.description && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4" />
                  Descrição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{course.description}</p>
              </CardContent>
            </Card>
          )}

          {course.prerequisites && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pré-requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{course.prerequisites}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseViewModal;

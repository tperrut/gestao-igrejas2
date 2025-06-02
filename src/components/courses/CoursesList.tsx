
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Course } from '@/types/libraryTypes';
import CourseViewModal from './CourseViewModal';

const getStatusBadge = (status: string) => {
  const styles = {
    active: "bg-green-500 hover:bg-green-600",
    inactive: "bg-gray-500 hover:bg-gray-600",
    completed: "bg-blue-500 hover:bg-blue-600",
    coming_soon: "bg-orange-500 hover:bg-orange-600"
  };

  const labels = {
    active: "Ativo",
    inactive: "Inativo", 
    completed: "Concluído",
    coming_soon: "Em Breve"
  };

  return (
    <Badge className={styles[status as keyof typeof styles] || "bg-gray-500"}>
      {labels[status as keyof typeof labels] || status}
    </Badge>
  );
};

const getCategoryBadge = (category: string) => {
  const styles = {
    biblia: "bg-purple-500 hover:bg-purple-600",
    lideranca: "bg-blue-500 hover:bg-blue-600",
    discipulado: "bg-green-500 hover:bg-green-600",
    evangelismo: "bg-red-500 hover:bg-red-600",
    familia: "bg-pink-500 hover:bg-pink-600"
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

interface CoursesListProps {
  courses: Course[];
  isLoading: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

const CoursesList: React.FC<CoursesListProps> = ({ courses, isLoading, onEdit, onDelete }) => {
  const { toast } = useToast();
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleView = (course: Course) => {
    setViewingCourse(course);
    setIsViewModalOpen(true);
  };

  const handleStudents = (courseId: string) => {
    toast({
      title: "Gerenciar alunos",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <p>Carregando cursos...</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <p>Nenhum curso encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] sm:w-[250px]">Título</TableHead>
              <TableHead className="hidden sm:table-cell">Instrutor</TableHead>
              <TableHead className="hidden md:table-cell">Período</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Categoria</TableHead>
              <TableHead className="hidden md:table-cell">Alunos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell className="hidden sm:table-cell">{course.instructor}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(course.start_date).toLocaleDateString('pt-BR')} - {new Date(course.end_date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  {getStatusBadge(course.status)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {getCategoryBadge(course.category)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {course.students || 0}/{course.max_students || 0}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(course)}>
                        <Eye className="mr-2 h-4 w-4" /> Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit && onEdit(course)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStudents(course.id)}>
                        <Users className="mr-2 h-4 w-4" /> Gerenciar Alunos
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        onClick={() => onDelete && onDelete(course)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CourseViewModal
        isOpen={isViewModalOpen}
        onClose={setIsViewModalOpen}
        course={viewingCourse}
      />
    </>
  );
};

export default CoursesList;

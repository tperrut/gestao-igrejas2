
import React from 'react';
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

export type CourseStatus = 'active' | 'upcoming' | 'completed' | 'archived';
export type CourseCategory = 'biblia' | 'lideranca' | 'discipulado' | 'evangelismo' | 'familia';

interface Course {
  id: number;
  title: string;
  instructor: string;
  startDate: string;
  endDate: string;
  status: CourseStatus;
  category: CourseCategory;
  maxStudents: number;
  students: number;
  description?: string;
  location?: string;
  prerequisites?: string;
}

// Mock data for course list
const mockCourses: Course[] = [
  {
    id: 1,
    title: "Fundamentos da Fé",
    instructor: "Pastor João",
    startDate: "2023-05-10",
    endDate: "2023-07-12",
    status: "active",
    category: "biblia",
    maxStudents: 30,
    students: 25,
    description: "Curso para novos convertidos aprenderem os fundamentos da fé cristã.",
    location: "Sala 2",
    prerequisites: "Nenhum"
  },
  {
    id: 2,
    title: "Liderança Cristã",
    instructor: "Pastor Carlos",
    startDate: "2023-06-05",
    endDate: "2023-08-28",
    status: "upcoming",
    category: "lideranca",
    maxStudents: 20,
    students: 12,
    description: "Curso para desenvolvimento de líderes na igreja.",
    location: "Sala 3",
    prerequisites: "Ser membro ativo por pelo menos 1 ano"
  },
  {
    id: 3,
    title: "Discipulado Eficaz",
    instructor: "Ana Oliveira",
    startDate: "2023-04-15",
    endDate: "2023-06-17",
    status: "active",
    category: "discipulado",
    maxStudents: 15,
    students: 15,
    description: "Como fazer discipulado de forma eficaz.",
    location: "Sala 1",
    prerequisites: "Fundamentos da Fé"
  },
  {
    id: 4,
    title: "Evangelismo Prático",
    instructor: "Lucas Silva",
    startDate: "2023-03-10",
    endDate: "2023-04-28",
    status: "completed",
    category: "evangelismo",
    maxStudents: 25,
    students: 22,
    description: "Métodos práticos de evangelismo para o dia a dia.",
    location: "Auditório",
    prerequisites: "Nenhum"
  }
];

const getStatusBadge = (status: CourseStatus) => {
  const styles = {
    active: "bg-green-500 hover:bg-green-600",
    upcoming: "bg-blue-500 hover:bg-blue-600",
    completed: "bg-gray-500 hover:bg-gray-600",
    archived: "bg-amber-500 hover:bg-amber-600"
  };

  const labels = {
    active: "Ativo",
    upcoming: "Em breve",
    completed: "Concluído",
    archived: "Arquivado"
  };

  return (
    <Badge className={styles[status]}>{labels[status]}</Badge>
  );
};

const getCategoryBadge = (category: CourseCategory) => {
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
    <Badge className={styles[category]}>{labels[category]}</Badge>
  );
};

interface CoursesListProps {
  onEdit?: (course: Course) => void;
}

const CoursesList: React.FC<CoursesListProps> = ({ onEdit }) => {
  const { toast } = useToast();

  const handleDelete = (courseId: number) => {
    toast({
      title: "Curso removido",
      description: "O curso foi removido com sucesso."
    });
  };

  const handleView = (courseId: number) => {
    toast({
      title: "Visualizar detalhes",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  const handleStudents = (courseId: number) => {
    toast({
      title: "Gerenciar alunos",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Título</TableHead>
            <TableHead>Instrutor</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Alunos</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockCourses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>{course.instructor}</TableCell>
              <TableCell>
                {new Date(course.startDate).toLocaleDateString('pt-BR')} - {new Date(course.endDate).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                {getStatusBadge(course.status)}
              </TableCell>
              <TableCell>
                {getCategoryBadge(course.category)}
              </TableCell>
              <TableCell>
                {course.students}/{course.maxStudents}
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
                    <DropdownMenuItem onClick={() => handleView(course.id)}>
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
                      onClick={() => handleDelete(course.id)}
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
  );
};

export default CoursesList;

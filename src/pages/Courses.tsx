import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, GraduationCap } from 'lucide-react';
import CoursesList from '@/components/courses/CoursesList';
import CourseModal from '@/components/courses/CourseModal';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type CourseStatus = 'active' | 'upcoming' | 'completed' | 'archived';
export type CourseCategory = 'biblia' | 'lideranca' | 'discipulado' | 'evangelismo' | 'familia';

interface Course {
  id?: number;
  title: string;
  instructor: string;
  startDate: string;
  endDate: string;
  status: CourseStatus;
  category: CourseCategory;
  maxStudents: number;
  students?: number;
  description?: string;
  location?: string;
  prerequisites?: string;
}

const Courses: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  const { toast } = useToast();

  const handleOpenCreateModal = () => {
    setEditingCourse(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleSaveCourse = (course: Omit<Course, 'id' | 'students'>) => {
    if (editingCourse?.id) {
      // Update existing course
      toast({
        title: "Curso atualizado",
        description: `${course.title} foi atualizado com sucesso.`
      });
    } else {
      // Create new course
      toast({
        title: "Curso adicionado",
        description: `${course.title} foi adicionado com sucesso.`
      });
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
            <p className="text-muted-foreground">
              Gerencie os cursos e treinamentos da igreja.
            </p>
          </div>
          <Button className="sm:self-end" onClick={handleOpenCreateModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Curso
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Cursos
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Ativos no momento
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alunos Inscritos
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">
                Em todos os cursos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cursos Concluídos
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">
                Histórico total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Novos Cursos
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Nos últimos 30 dias
              </p>
            </CardContent>
          </Card>
        </div>

        <CoursesList onEdit={handleOpenEditModal} />

        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCourse}
          course={editingCourse}
          title={editingCourse ? "Editar Curso" : "Novo Curso"}
        />
      </div>
    </>
  );
};

export default Courses;

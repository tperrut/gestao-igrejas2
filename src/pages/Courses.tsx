
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, GraduationCap } from 'lucide-react';
import CoursesList from '@/components/courses/CoursesList';
import CourseModal from '@/components/courses/CourseModal';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export type CourseStatus = 'active' | 'upcoming' | 'completed' | 'archived';
export type CourseCategory = 'biblia' | 'lideranca' | 'discipulado' | 'evangelismo' | 'familia';

export interface Course {
  id?: string;
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
  created_at?: string;
  updated_at?: string;
}

const Courses: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    new: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCourseStats();
  }, []);

  async function fetchCourseStats() {
    try {
      // Total de cursos
      const { count: totalCount, error: totalError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // Cursos ativos
      const { count: activeCount, error: activeError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Cursos concluídos
      const { count: completedCount, error: completedError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Novos cursos (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: newCount, error: newError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (totalError || activeError || completedError || newError) {
        throw new Error('Erro ao buscar estatísticas');
      }

      setStats({
        total: totalCount || 0,
        active: activeCount || 0,
        completed: completedCount || 0,
        new: newCount || 0
      });

    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  }

  const handleOpenCreateModal = () => {
    setEditingCourse(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (course: Omit<Course, 'id' | 'students'>) => {
    try {
      if (editingCourse?.id) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title: course.title,
            instructor: course.instructor,
            start_date: course.startDate,
            end_date: course.endDate,
            status: course.status,
            category: course.category,
            max_students: course.maxStudents,
            description: course.description || null,
            location: course.location || null,
            prerequisites: course.prerequisites || null
          })
          .eq('id', editingCourse.id);

        if (error) throw error;
        
        toast({
          title: "Curso atualizado",
          description: `${course.title} foi atualizado com sucesso.`
        });
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert([{
            title: course.title,
            instructor: course.instructor,
            start_date: course.startDate,
            end_date: course.endDate,
            status: course.status,
            category: course.category,
            max_students: course.maxStudents,
            description: course.description || null,
            location: course.location || null,
            prerequisites: course.prerequisites || null
          }]);

        if (error) throw error;
        
        toast({
          title: "Curso adicionado",
          description: `${course.title} foi adicionado com sucesso.`
        });
      }

      // Atualizar estatísticas
      fetchCourseStats();
      
    } catch (error) {
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao salvar o curso.`,
        variant: "destructive"
      });
      console.error("Erro ao salvar curso:", error);
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
              <div className="text-2xl font-bold">{stats.active}</div>
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
              <div className="text-2xl font-bold">{stats.completed}</div>
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
              <div className="text-2xl font-bold">{stats.new}</div>
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

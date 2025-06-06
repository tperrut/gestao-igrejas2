import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, List, Grid } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CoursesList from '@/components/courses/CoursesList';
import CoursesCardView from '@/components/courses/CoursesCardView';
import CourseModal from '@/components/courses/CourseModal';
import CourseViewModal from '@/components/courses/CourseViewModal';
import { useToast } from '@/hooks/use-toast';
import { Course } from '@/types/libraryTypes';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      console.log('Buscando cursos...');
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar cursos:', error);
        throw error;
      }

      console.log('Cursos carregados:', data);

      const formattedCourses: Course[] = data.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        start_date: course.start_date,
        end_date: course.end_date,
        location: course.location,
        max_students: course.max_students,
        students: course.students || 0,
        status: course.status,
        category: course.category,
        prerequisites: course.prerequisites,
        image_url: course.image_url,
        created_at: course.created_at,
        updated_at: course.updated_at
      }));

      setCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Erro ao carregar cursos",
        description: "Não foi possível carregar a lista de cursos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = () => {
    if (!isAdmin()) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem criar cursos.",
        variant: "destructive",
      });
      return;
    }
    console.log('Abrindo modal para criar curso');
    setMode('create');
    setSelectedCourse(undefined);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    if (!isAdmin()) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem editar cursos.",
        variant: "destructive",
      });
      return;
    }
    console.log('Editando curso:', course);
    setMode('edit');
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    if (!isAdmin()) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem excluir cursos.",
        variant: "destructive",
      });
      return;
    }
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;
    
    try {
      console.log('Excluindo curso:', selectedCourse.id);
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', selectedCourse.id);
        
      if (error) {
        console.error('Erro ao excluir curso:', error);
        throw error;
      }
      
      setCourses(courses.filter(c => c.id !== selectedCourse.id));
      toast({
        title: "Curso excluído",
        description: `O curso ${selectedCourse.title} foi excluído com sucesso.`,
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Erro ao excluir curso",
        description: "Não foi possível excluir o curso. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedCourse(undefined);
    }
  };

  const handleSaveCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Salvando dados do curso:', courseData);
      
      if (mode === 'create') {
        const insertData = {
          title: courseData.title,
          description: courseData.description || null,
          instructor: courseData.instructor,
          start_date: courseData.start_date,
          end_date: courseData.end_date,
          location: courseData.location || null,
          max_students: Number(courseData.max_students) || 0,
          students: Number(courseData.students) || 0,
          status: courseData.status,
          category: courseData.category,
          prerequisites: courseData.prerequisites || null,
          image_url: courseData.image_url || null,
        };

        console.log('Dados para inserção:', insertData);

        const { data, error } = await supabase
          .from('courses')
          .insert([insertData])
          .select();

        if (error) {
          console.error('Erro do Supabase ao criar curso:', error);
          throw error;
        }
        
        console.log('Curso criado com sucesso:', data);
        
        if (data && data[0]) {
          const newCourse: Course = {
            id: data[0].id,
            title: data[0].title,
            description: data[0].description,
            instructor: data[0].instructor,
            start_date: data[0].start_date,
            end_date: data[0].end_date,
            location: data[0].location,
            max_students: data[0].max_students,
            students: data[0].students || 0,
            status: data[0].status,
            category: data[0].category,
            prerequisites: data[0].prerequisites,
            image_url: data[0].image_url,
            created_at: data[0].created_at,
            updated_at: data[0].updated_at,
          };
          
          setCourses([newCourse, ...courses]);
          toast({
            title: "Curso criado",
            description: `O curso ${courseData.title} foi criado com sucesso.`,
          });
        }
      } else if (mode === 'edit' && selectedCourse) {
        const updateData = {
          title: courseData.title,
          description: courseData.description || null,
          instructor: courseData.instructor,
          start_date: courseData.start_date,
          end_date: courseData.end_date,
          location: courseData.location || null,
          max_students: Number(courseData.max_students) || 0,
          students: Number(courseData.students) || 0,
          status: courseData.status,
          category: courseData.category,
          prerequisites: courseData.prerequisites || null,
          image_url: courseData.image_url || null,
        };

        console.log('Dados para atualização:', updateData);

        const { error } = await supabase
          .from('courses')
          .update(updateData)
          .eq('id', selectedCourse.id);

        if (error) {
          console.error('Erro do Supabase ao atualizar curso:', error);
          throw error;
        }
        
        const updatedCourse: Course = {
          ...selectedCourse,
          ...courseData,
        };
        
        setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
        toast({
          title: "Curso atualizado",
          description: `O curso ${courseData.title} foi atualizado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "Erro ao salvar curso",
        description: `Não foi possível salvar o curso. Erro: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsModalOpen(false);
      setSelectedCourse(undefined);
    }
  };

  const handleCloseModal = () => {
    console.log('Fechando modal');
    setIsModalOpen(false);
    setSelectedCourse(undefined);
  };

  const handleViewCourse = (course: Course) => {
    setViewingCourse(course);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os cursos oferecidos pela igreja
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          {isAdmin() && (
            <Button onClick={handleCreateCourse} className="bg-church-blue">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Curso
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos os Cursos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {viewMode === 'cards' ? (
            <CoursesCardView 
              courses={courses} 
              onView={handleViewCourse}
              onEdit={handleEditCourse} 
              onDelete={handleDeleteCourse} 
            />
          ) : (
            <CoursesList 
              courses={courses} 
              isLoading={isLoading} 
              onEdit={handleEditCourse} 
              onDelete={handleDeleteCourse} 
            />
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          {viewMode === 'cards' ? (
            <CoursesCardView 
              courses={courses.filter(course => course.status === 'active')} 
              onView={handleViewCourse}
              onEdit={handleEditCourse} 
              onDelete={handleDeleteCourse} 
            />
          ) : (
            <CoursesList 
              courses={courses.filter(course => course.status === 'active')} 
              isLoading={isLoading} 
              onEdit={handleEditCourse} 
              onDelete={handleDeleteCourse} 
            />
          )}
        </TabsContent>

        <TabsContent value="inactive" className="mt-0">
          {viewMode === 'cards' ? (
            <CoursesCardView 
              courses={courses.filter(course => course.status === 'inactive')} 
              onView={handleViewCourse}
              onEdit={handleEditCourse} 
              onDelete={handleDeleteCourse} 
            />
          ) : (
            <CoursesList 
              courses={courses.filter(course => course.status === 'inactive')} 
              isLoading={isLoading} 
              onEdit={handleEditCourse} 
              onDelete={handleDeleteCourse} 
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          {viewMode === 'cards' ? (
            <CoursesCardView 
              courses={courses.filter(course => course.status === 'completed')} 
              onView={handleViewCourse}
              onEdit={handleEditCourse} 
              onDelete={handleDeleteCourse} 
            />
          ) : (
            <CoursesList 
              courses={courses.filter(course => course.status === 'completed')} 
              isLoading={isLoading} 
              onEdit={handleEditCourse} 
              onDelete={handleDeleteCourse} 
            />
          )}
        </TabsContent>
      </Tabs>

      <CourseModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
        course={selectedCourse}
        title={mode === 'edit' ? "Editar Curso" : "Novo Curso"}
      />

      <CourseViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        course={viewingCourse}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá excluir permanentemente o curso{' '}
              <span className="font-bold">{selectedCourse?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Courses;

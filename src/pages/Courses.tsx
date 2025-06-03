
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from 'lucide-react';
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
import CourseModal from '@/components/courses/CourseModal';
import { useToast } from '@/components/ui/use-toast';
import { Course } from '@/types/libraryTypes';
import { supabase } from '@/integrations/supabase/client';

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

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
    setMode('create');
    setSelectedCourse(undefined);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setMode('edit');
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', selectedCourse.id);
        
      if (error) throw error;
      
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
      if (mode === 'create') {
        const { data, error } = await supabase
          .from('courses')
          .insert([
            {
              title: courseData.title,
              description: courseData.description,
              instructor: courseData.instructor,
              start_date: courseData.start_date,
              end_date: courseData.end_date,
              location: courseData.location,
              max_students: courseData.max_students,
              students: courseData.students,
              status: courseData.status,
              category: courseData.category,
              prerequisites: courseData.prerequisites,
            }
          ])
          .select();

        if (error) throw error;
        
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
        const { error } = await supabase
          .from('courses')
          .update({
            title: courseData.title,
            description: courseData.description,
            instructor: courseData.instructor,
            start_date: courseData.start_date,
            end_date: courseData.end_date,
            location: courseData.location,
            max_students: courseData.max_students,
            students: courseData.students,
            status: courseData.status,
            category: courseData.category,
            prerequisites: courseData.prerequisites,
          })
          .eq('id', selectedCourse.id);

        if (error) throw error;
        
        const updatedCourse: Course = {
          ...selectedCourse,
          title: courseData.title,
          description: courseData.description,
          instructor: courseData.instructor,
          start_date: courseData.start_date,
          end_date: courseData.end_date,
          location: courseData.location,
          max_students: courseData.max_students,
          students: courseData.students,
          status: courseData.status,
          category: courseData.category,
          prerequisites: courseData.prerequisites,
        };
        
        setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
        toast({
          title: "Curso atualizado",
          description: `O curso ${courseData.title} foi atualizado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Erro ao salvar curso",
        description: "Não foi possível salvar o curso. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(undefined);
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
        <Button onClick={handleCreateCourse} className="bg-church-blue flex-1 sm:flex-none">
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Curso
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos os Cursos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <CoursesList 
            courses={courses} 
            isLoading={isLoading} 
            onEdit={handleEditCourse} 
            onDelete={handleDeleteCourse} 
          />
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          <CoursesList 
            courses={courses.filter(course => course.status === 'active')} 
            isLoading={isLoading} 
            onEdit={handleEditCourse} 
            onDelete={handleDeleteCourse} 
          />
        </TabsContent>

        <TabsContent value="inactive" className="mt-0">
          <CoursesList 
            courses={courses.filter(course => course.status === 'inactive')} 
            isLoading={isLoading} 
            onEdit={handleEditCourse} 
            onDelete={handleDeleteCourse} 
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <CoursesList 
            courses={courses.filter(course => course.status === 'completed')} 
            isLoading={isLoading} 
            onEdit={handleEditCourse} 
            onDelete={handleDeleteCourse} 
          />
        </TabsContent>
      </Tabs>

      <CourseModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
        course={selectedCourse}
        title={mode === 'edit' ? "Editar Curso" : "Novo Curso"}
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

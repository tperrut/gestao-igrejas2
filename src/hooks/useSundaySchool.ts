import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  SundaySchoolTeacher, 
  SundaySchoolClass, 
  SundaySchoolEnrollment, 
  SundaySchoolLesson,
  SundaySchoolAttendance,
  SundaySchoolClassTeacher
} from '@/types/sundaySchoolTypes';

export const useSundaySchool = () => {
  const [teachers, setTeachers] = useState<SundaySchoolTeacher[]>([]);
  const [classes, setClasses] = useState<SundaySchoolClass[]>([]);
  const [enrollments, setEnrollments] = useState<SundaySchoolEnrollment[]>([]);
  const [lessons, setLessons] = useState<SundaySchoolLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch Teachers
  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('sunday_school_teachers')
        .select('*')
        .order('name');

      if (error) throw error;
      setTeachers(data as SundaySchoolTeacher[] || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar professores",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Fetch Classes
  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('sunday_school_classes')
        .select('*')
        .order('name');

      if (error) throw error;
      setClasses(data as SundaySchoolClass[] || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar turmas",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Fetch Enrollments with member and class data
  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('sunday_school_enrollments')
        .select(`
          *,
          member:members(id, name, email, birth_date),
          class:sunday_school_classes(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data as SundaySchoolEnrollment[] || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar matrículas",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Fetch Lessons with teacher and class data
  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('sunday_school_lessons')
        .select(`
          *,
          teacher:sunday_school_teachers(*),
          class:sunday_school_classes(*)
        `)
        .order('lesson_date', { ascending: false });

      if (error) throw error;
      setLessons(data as SundaySchoolLesson[] || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar aulas",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Create Teacher
  const createTeacher = async (teacherData: Omit<SundaySchoolTeacher, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sunday_school_teachers')
        .insert([teacherData]);

      if (error) throw error;

      toast({
        title: "Professor criado com sucesso!",
        description: `${teacherData.name} foi adicionado ao sistema.`,
      });

      await fetchTeachers();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao criar professor",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Create Class
  const createClass = async (classData: Omit<SundaySchoolClass, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sunday_school_classes')
        .insert([classData]);

      if (error) throw error;

      toast({
        title: "Turma criada com sucesso!",
        description: `${classData.name} foi adicionada ao sistema.`,
      });

      await fetchClasses();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao criar turma",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Create Enrollment
  const createEnrollment = async (enrollmentData: Omit<SundaySchoolEnrollment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sunday_school_enrollments')
        .insert([enrollmentData]);

      if (error) throw error;

      toast({
        title: "Matrícula realizada com sucesso!",
        description: "Aluno matriculado na turma.",
      });

      await fetchEnrollments();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao realizar matrícula",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Create Lesson
  const createLesson = async (lessonData: Omit<SundaySchoolLesson, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sunday_school_lessons')
        .insert([lessonData]);

      if (error) throw error;

      toast({
        title: "Aula criada com sucesso!",
        description: "Nova aula registrada no sistema.",
      });

      await fetchLessons();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao criar aula",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update Lesson
  const updateLesson = async (id: string, lessonData: Partial<SundaySchoolLesson>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sunday_school_lessons')
        .update(lessonData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Aula atualizada com sucesso!",
      });

      await fetchLessons();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar aula",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update functions
  const updateTeacher = async (id: string, teacherData: Partial<SundaySchoolTeacher>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sunday_school_teachers')
        .update(teacherData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Professor atualizado com sucesso!",
      });

      await fetchTeachers();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar professor",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (id: string, classData: Partial<SundaySchoolClass>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sunday_school_classes')
        .update(classData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Turma atualizada com sucesso!",
      });

      await fetchClasses();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar turma",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEnrollment = async (id: string, enrollmentData: Partial<SundaySchoolEnrollment>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sunday_school_enrollments')
        .update(enrollmentData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Matrícula atualizada com sucesso!",
      });

      await fetchEnrollments();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar matrícula",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete functions
  const deleteTeacher = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sunday_school_teachers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Professor removido com sucesso!",
      });

      await fetchTeachers();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover professor",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sunday_school_classes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Turma removida com sucesso!",
      });

      await fetchClasses();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover turma",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get dashboard stats
  const getDashboardStats = async () => {
    try {
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const [teachersCount, classesCount, enrollmentsCount, lastSundayData, visitorsThisMonth] = await Promise.all([
        supabase.from('sunday_school_teachers').select('id', { count: 'exact' }),
        supabase.from('sunday_school_classes').select('id', { count: 'exact' }),
        supabase.from('sunday_school_enrollments').select('id', { count: 'exact' }).eq('status', 'active'),
        supabase
          .from('sunday_school_lessons')
          .select(`
            *,
            class:sunday_school_classes(name),
            attendance:sunday_school_attendance(present)
          `)
          .order('lesson_date', { ascending: false })
          .limit(10),
        supabase
          .from('sunday_school_attendance')
          .select(`
            *,
            lesson:sunday_school_lessons(lesson_date)
          `)
          .not('visitor_name', 'is', null)
          .gte('lesson.lesson_date', firstDayOfMonth.toISOString().split('T')[0])
          .lte('lesson.lesson_date', lastDayOfMonth.toISOString().split('T')[0])
          .eq('present', true)
      ]);

      return {
        totalTeachers: teachersCount.count || 0,
        totalClasses: classesCount.count || 0,
        totalStudents: enrollmentsCount.count || 0,
        visitorsThisMonth: visitorsThisMonth.count || 0,
        recentLessons: lastSundayData.data || []
      };
    } catch (error: any) {
      toast({
        title: "Erro ao carregar estatísticas",
        description: error.message,
        variant: "destructive",
      });
      return {
        totalTeachers: 0,
        totalClasses: 0,
        totalStudents: 0,
        visitorsThisMonth: 0,
        recentLessons: []
      };
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
    fetchEnrollments();
    fetchLessons();
  }, []);

  return {
    teachers,
    classes,
    enrollments,
    lessons,
    loading,
    fetchTeachers,
    fetchClasses,
    fetchEnrollments,
    fetchLessons,
    createTeacher,
    createClass,
    createEnrollment,
    createLesson,
    updateTeacher,
    updateClass,
    updateEnrollment,
    updateLesson,
    deleteTeacher,
    deleteClass,
    getDashboardStats
  };
};
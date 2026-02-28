import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  Plus,
  BookOpen,
  UserCheck,
  Trophy,
  TrendingUp
} from 'lucide-react';
import { useSundaySchool } from '@/hooks/useSundaySchool';
import { SundaySchoolTeacherForm } from '@/components/sunday-school/SundaySchoolTeacherForm';
import { SundaySchoolClassForm } from '@/components/sunday-school/SundaySchoolClassForm';
import { SundaySchoolEnrollmentForm } from '@/components/sunday-school/SundaySchoolEnrollmentForm';
import { SundaySchoolLessonForm } from '@/components/sunday-school/SundaySchoolLessonForm';
import { SundaySchoolTeachersList } from '@/components/sunday-school/SundaySchoolTeachersList';
import { SundaySchoolClassesList } from '@/components/sunday-school/SundaySchoolClassesList';
import { SundaySchoolEnrollmentsList } from '@/components/sunday-school/SundaySchoolEnrollmentsList';
import { SundaySchoolLessonsList } from '@/components/sunday-school/SundaySchoolLessonsList';
import { SundaySchoolAttendance } from '@/components/sunday-school/SundaySchoolAttendance';

const SundaySchool: React.FC = () => {
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [editingEnrollment, setEditingEnrollment] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalClasses: 0,
    totalStudents: 0,
    recentLessons: []
  });

  const { teachers, classes, enrollments, getDashboardStats } = useSundaySchool();

  useEffect(() => {
    const loadStats = async () => {
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
    };
    loadStats();
  }, []);

  const calculateAttendanceRate = () => {
    if (stats.recentLessons.length === 0) return 0;
    const totalLessons = stats.recentLessons.length;
    const averageAttendance = stats.recentLessons.reduce((acc: number, lesson: any) => {
      const presentCount = lesson.attendance?.filter((att: any) => att.present).length || 0;
      return acc + presentCount;
    }, 0);
    return totalLessons > 0 ? Math.round((averageAttendance / totalLessons)) : 0;
  };

  const getTotalOfferings = () => {
    return stats.recentLessons.reduce((acc: number, lesson: any) => acc + (lesson.offering_amount || 0), 0);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Escola Dominical</h1>
        <p className="text-muted-foreground">
          Gerencie turmas, professores, alunos e controle de presença da Escola Dominical
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Professores ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">Turmas ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Alunos matriculados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ofertas (Últimas)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {getTotalOfferings().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Últimas 10 aulas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-4">

        <TabsList className="flex flex-col sm:flex-row w-full gap-2">
          <TabsTrigger className="w-full sm:w-auto" value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger className="w-full sm:w-auto" value="teachers">Professores</TabsTrigger>
          <TabsTrigger className="w-full sm:w-auto" value="classes">Turmas</TabsTrigger>
          <TabsTrigger className="w-full sm:w-auto" value="enrollments">Matrículas</TabsTrigger>
          <TabsTrigger className="w-full sm:w-auto" value="lessons">Aulas</TabsTrigger>
          <TabsTrigger className="w-full sm:w-auto" value="attendance">Presença</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Últimas Aulas
                </CardTitle>
                <CardDescription>Aulas mais recentes da Escola Dominical</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentLessons.slice(0, 5).map((lesson: any) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{lesson.class?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(lesson.lesson_date).toLocaleDateString('pt-BR')}
                        </p>
                        {lesson.topic && (
                          <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {lesson.attendance?.filter((att: any) => att.present).length || 0} presentes
                        </Badge>
                        {lesson.offering_amount > 0 && (
                          <p className="text-sm font-medium text-green-600">
                            R$ {lesson.offering_amount.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Resumo Geral
                </CardTitle>
                <CardDescription>Estatísticas gerais da Escola Dominical</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Taxa de Presença Média</span>
                  <Badge>{calculateAttendanceRate()} alunos</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total de Aulas Registradas</span>
                  <Badge variant="outline">{stats.recentLessons.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Arrecadação Total</span>
                  <Badge className="bg-green-100 text-green-800">
                    R$ {getTotalOfferings().toFixed(2)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Professores</h2>
            <Button onClick={() => setShowTeacherForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Professor
            </Button>
          </div>
          <SundaySchoolTeachersList 
            teachers={teachers} 
            onEdit={(teacher) => {
              setEditingTeacher(teacher);
              setShowTeacherForm(true);
            }}
          />
          {showTeacherForm && (
      <SundaySchoolTeacherForm
        open={showTeacherForm}
        onOpenChange={(open) => {
          setShowTeacherForm(open);
          if (!open) setEditingTeacher(null);
        }}
        teacher={editingTeacher}
      />
          )}
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Turmas</h2>
            <Button onClick={() => setShowClassForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Turma
            </Button>
          </div>
          <SundaySchoolClassesList 
            classes={classes} 
            onEdit={(classData) => {
              setEditingClass(classData);
              setShowClassForm(true);
            }}
          />
          {showClassForm && (
      <SundaySchoolClassForm
        open={showClassForm}
        onOpenChange={(open) => {
          setShowClassForm(open);
          if (!open) setEditingClass(null);
        }}
        class={editingClass}
      />
          )}
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Matrículas</h2>
            <Button onClick={() => setShowEnrollmentForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Matrícula
            </Button>
          </div>
          <SundaySchoolEnrollmentsList 
            enrollments={enrollments} 
            onEdit={(enrollment) => {
              setEditingEnrollment(enrollment);
              setShowEnrollmentForm(true);
            }}
          />
          {showEnrollmentForm && (
      <SundaySchoolEnrollmentForm
        open={showEnrollmentForm}
        onOpenChange={(open) => {
          setShowEnrollmentForm(open);
          if (!open) setEditingEnrollment(null);
        }}
        enrollment={editingEnrollment}
      />
          )}
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Aulas</h2>
            <Button onClick={() => setShowLessonForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Aula
            </Button>
          </div>
          <SundaySchoolLessonsList />
          {showLessonForm && (
            <SundaySchoolLessonForm
              open={showLessonForm}
              onOpenChange={setShowLessonForm}
            />
          )}
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <h2 className="text-2xl font-bold">Controle de Presença</h2>
          <SundaySchoolAttendance />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SundaySchool;
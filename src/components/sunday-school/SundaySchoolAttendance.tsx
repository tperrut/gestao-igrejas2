import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Users, UserCheck, Clock, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSundaySchool } from '@/hooks/useSundaySchool';
import { SundaySchoolVisitorForm } from './SundaySchoolVisitorForm';

export const SundaySchoolAttendance: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [lessonStudents, setLessonStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showVisitorForm, setShowVisitorForm] = useState(false);
  
  const { lessons } = useSundaySchool();
  const { toast } = useToast();

  // Load students enrolled in the selected lesson's class
  useEffect(() => {
    const loadLessonStudents = async () => {
      if (!selectedLesson) {
        setLessonStudents([]);
        return;
      }

      setLoading(true);
      try {
        const lesson = lessons.find(l => l.id === selectedLesson);
        if (!lesson) return;

        // Get enrolled students for this class
        const { data: enrollments, error: enrollError } = await supabase
          .from('sunday_school_enrollments')
          .select(`
            member_id,
            member:members(id, name, email)
          `)
          .eq('class_id', lesson.class_id)
          .eq('status', 'active');

        if (enrollError) throw enrollError;

        // Get existing attendance for this lesson
        const { data: existingAttendance, error: attendanceError } = await supabase
          .from('sunday_school_attendance')
          .select('*')
          .eq('lesson_id', selectedLesson);

        if (attendanceError) throw attendanceError;

        // Combine enrollment data with attendance data, plus visitors
        const studentsWithAttendance = enrollments?.map(enrollment => ({
          member_id: enrollment.member_id,
          member: enrollment.member,
          attendance: existingAttendance?.find(att => att.member_id === enrollment.member_id),
          isVisitor: false
        })) || [];

        // Add visitors to the list
        const visitors = existingAttendance?.filter(att => !att.member_id && att.visitor_name) || [];
        visitors.forEach(visitor => {
          studentsWithAttendance.push({
            member_id: `visitor_${visitor.id}`,
            member: { id: `visitor_${visitor.id}`, name: visitor.visitor_name, email: 'Visitante' },
            attendance: visitor,
            isVisitor: true
          });
        });

        setLessonStudents(studentsWithAttendance);

        // Set attendance state
        const attendanceState: Record<string, boolean> = {};
        studentsWithAttendance.forEach(student => {
          attendanceState[student.member_id] = student.attendance?.present || false;
        });
        setAttendance(attendanceState);

      } catch (error: any) {
        toast({
          title: "Erro ao carregar alunos",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadLessonStudents();
  }, [selectedLesson, lessons]);

  const handleAttendanceChange = (memberId: string, present: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [memberId]: present
    }));
  };

  const saveAttendance = async () => {
    if (!selectedLesson) return;

    setSaving(true);
    try {
      // Delete existing attendance for this lesson
      await supabase
        .from('sunday_school_attendance')
        .delete()
        .eq('lesson_id', selectedLesson);

      // Insert new attendance records
      const attendanceRecords = lessonStudents.map(student => {
        if (student.isVisitor) {
          return {
            lesson_id: selectedLesson,
            member_id: null,
            visitor_name: student.member?.name,
            present: attendance[student.member_id] || false,
          };
        }
        return {
          lesson_id: selectedLesson,
          member_id: student.member_id,
          present: attendance[student.member_id] || false,
        };
      });

      const { error } = await supabase
        .from('sunday_school_attendance')
        .insert(attendanceRecords);

      if (error) throw error;

      toast({
        title: "Presença salva com sucesso!",
        description: "A presença foi registrada para todos os alunos.",
      });

    } catch (error: any) {
      toast({
        title: "Erro ao salvar presença",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddVisitor = async (visitorData: any) => {
    if (!selectedLesson) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('sunday_school_attendance')
        .insert([{
          lesson_id: selectedLesson,
          member_id: null,
          visitor_name: visitorData.visitor_name,
          present: visitorData.present,
          arrival_time: visitorData.arrival_time || null,
          notes: visitorData.notes || null,
          tenant_id: getDefaultTenantId(),
        }]);

      if (error) throw error;

      toast({
        title: "Visitante adicionado com sucesso!",
      });

      // Reload the attendance data properly
      setSelectedLesson('');
      setTimeout(() => setSelectedLesson(selectedLesson), 100);
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar visitante",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const selectedLessonData = lessons.find(l => l.id === selectedLesson);
  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Controle de Presença
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Selecionar Aula</label>
              <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma aula para registrar presença" />
                </SelectTrigger>
                <SelectContent>
                  {lessons
                    .sort((a, b) => new Date(b.lesson_date).getTime() - new Date(a.lesson_date).getTime())
                    .map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(lesson.lesson_date).toLocaleDateString('pt-BR')} - 
                          {lesson.class?.name}
                          {lesson.teacher && ` (${lesson.teacher.name})`}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedLessonData && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Turma</p>
                      <p className="text-lg font-bold">{selectedLessonData.class?.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Data</p>
                      <p className="text-lg font-bold">
                        {new Date(selectedLessonData.lesson_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Presentes</p>
                      <p className="text-lg font-bold text-green-600">
                        {presentCount} / {lessonStudents.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedLesson && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lista de Presença</CardTitle>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowVisitorForm(true)} 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Visitante
                </Button>
                <Button onClick={saveAttendance} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Presença'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Carregando alunos...</p>
            ) : lessonStudents.length === 0 ? (
              <p className="text-center text-muted-foreground">
                Nenhum aluno matriculado nesta turma
              </p>
            ) : (
              <div className="space-y-3">
                {lessonStudents.map((student) => (
                  <div
                    key={student.member_id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={attendance[student.member_id] || false}
                        onCheckedChange={(checked) => 
                          handleAttendanceChange(student.member_id, checked as boolean)
                        }
                      />
                      <div>
                        <p className="font-medium">{student.member?.name}</p>
                        <p className="text-sm text-muted-foreground">{student.member?.email}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={attendance[student.member_id] ? 'default' : 'outline'}
                    >
                      {attendance[student.member_id] ? 'Presente' : 'Ausente'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <SundaySchoolVisitorForm
        open={showVisitorForm}
        onOpenChange={setShowVisitorForm}
        onSubmit={handleAddVisitor}
        loading={saving}
      />
    </div>
  );
};
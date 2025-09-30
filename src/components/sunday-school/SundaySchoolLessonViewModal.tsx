import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, DollarSign, BookOpen, Users, Clock } from 'lucide-react';
import { SundaySchoolLesson } from '@/types/sundaySchoolTypes';

interface SundaySchoolLessonViewModalProps {
  lesson: SundaySchoolLesson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SundaySchoolLessonViewModal: React.FC<SundaySchoolLessonViewModalProps> = ({
  lesson,
  open,
  onOpenChange,
}) => {
  if (!lesson) return null;

  const attendanceCount = lesson.attendance?.filter(att => att.present).length || 0;
  const totalStudents = lesson.attendance?.length || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Detalhes da Aula
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {new Date(lesson.lesson_date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Turma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{lesson.class?.name}</p>
                <Badge variant="outline" className="mt-1">
                  {lesson.class?.age_group}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Professor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{lesson.teacher?.name}</p>
                {lesson.teacher?.email && (
                  <p className="text-sm text-muted-foreground">{lesson.teacher.email}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Oferta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-green-600">
                  R$ {lesson.offering_amount?.toFixed(2) || '0,00'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tópico da Aula */}
          {lesson.topic && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Tópico da Aula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{lesson.topic}</p>
              </CardContent>
            </Card>
          )}

          {/* Presença */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Presença ({attendanceCount}/{totalStudents})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lesson.attendance && lesson.attendance.length > 0 ? (
                <div className="space-y-2">
                  {lesson.attendance.map((attendance, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded border"
                    >
                      <div>
                        <p className="font-medium">
                          {attendance.visitor_name || attendance.member?.name || 'Nome não disponível'}
                        </p>
                        {attendance.visitor_name && (
                          <Badge variant="secondary" className="text-xs">
                            Visitante
                          </Badge>
                        )}
                        {attendance.arrival_time && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {attendance.arrival_time}
                          </div>
                        )}
                        {attendance.notes && (
                          <p className="text-sm text-muted-foreground">{attendance.notes}</p>
                        )}
                      </div>
                      <Badge variant={attendance.present ? 'default' : 'outline'}>
                        {attendance.present ? 'Presente' : 'Ausente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma presença registrada</p>
              )}
            </CardContent>
          </Card>

          {/* Observações */}
          {lesson.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{lesson.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
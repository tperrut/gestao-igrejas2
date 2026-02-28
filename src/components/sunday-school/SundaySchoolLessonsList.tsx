import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, User, DollarSign, BookOpen, Users, Eye, Edit2 } from 'lucide-react';
import { useSundaySchool } from '@/hooks/useSundaySchool';
import { SundaySchoolLessonViewModal } from './SundaySchoolLessonViewModal';
import { SundaySchoolLessonForm } from './SundaySchoolLessonForm';
import { SundaySchoolLesson } from '@/types/sundaySchoolTypes';

export const SundaySchoolLessonsList: React.FC = () => {
  const { lessons } = useSundaySchool();
  const [selectedLesson, setSelectedLesson] = useState<SundaySchoolLesson | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleViewDetails = (lesson: SundaySchoolLesson) => {
    setSelectedLesson(lesson);
    setViewModalOpen(true);
  };

  const handleEditLesson = (lesson: SundaySchoolLesson) => {
    setSelectedLesson(lesson);
    setEditModalOpen(true);
  };

  if (lessons.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-48">
          <p className="text-muted-foreground">Nenhuma aula registrada</p>
          <p className="text-sm text-muted-foreground">Clique em "Nova Aula" para começar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Lista de Aulas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Tópico</TableHead>
                <TableHead>Presença</TableHead>
                <TableHead>Oferta</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(lesson.lesson_date).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{lesson.class?.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {lesson.class?.age_group}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {lesson.teacher?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="max-w-xs truncate">
                        {lesson.topic || 'Sem tópico'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {lesson.attendance?.filter(att => att.present).length || 0} presentes
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">
                        R$ {lesson.offering_amount.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(lesson)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditLesson(lesson)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

    </Card>

    <SundaySchoolLessonViewModal
      lesson={selectedLesson}
      open={viewModalOpen}
      onOpenChange={setViewModalOpen}
    />

    <SundaySchoolLessonForm
      lesson={selectedLesson}
      open={editModalOpen}
      onOpenChange={setEditModalOpen}
    />
    </>
  );
};
import React from 'react';
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
import { Trash2, Edit, User, Calendar } from 'lucide-react';
import { useSundaySchool } from '@/hooks/useSundaySchool';
import { SundaySchoolEnrollment } from '@/types/sundaySchoolTypes';

interface SundaySchoolEnrollmentsListProps {
  enrollments: SundaySchoolEnrollment[];
  onEdit: (enrollment: SundaySchoolEnrollment) => void;
}

export const SundaySchoolEnrollmentsList: React.FC<SundaySchoolEnrollmentsListProps> = ({ enrollments, onEdit }) => {

  if (enrollments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-48">
          <p className="text-muted-foreground">Nenhuma matrícula registrada</p>
          <p className="text-sm text-muted-foreground">Clique em "Nova Matrícula" para começar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Matrículas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Data da Matrícula</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{enrollment.member?.name}</p>
                        <p className="text-sm text-muted-foreground">{enrollment.member?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{enrollment.class?.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {enrollment.class?.age_group}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {new Date(enrollment.enrollment_date).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        enrollment.status === 'active' ? 'default' : 
                        enrollment.status === 'transferred' ? 'secondary' : 'outline'
                      }
                    >
                      {enrollment.status === 'active' ? 'Ativa' : 
                       enrollment.status === 'transferred' ? 'Transferida' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground max-w-xs truncate">
                      {enrollment.notes || '-'}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEdit(enrollment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
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
  );
};
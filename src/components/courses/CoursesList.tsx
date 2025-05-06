
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MoreHorizontal, 
  Search, 
  ArrowUpDown, 
  ChevronDown, 
  Filter 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type CourseStatus = 'active' | 'upcoming' | 'completed' | 'archived';
export type CourseCategory = 'biblia' | 'lideranca' | 'discipulado' | 'evangelismo' | 'familia';

interface Course {
  id: number;
  title: string;
  instructor: string;
  startDate: string;
  endDate: string;
  status: CourseStatus;
  category: CourseCategory;
  students: number;
  maxStudents: number;
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Fundamentos da Fé',
    instructor: 'Pastor João',
    startDate: '01/05/2023',
    endDate: '30/06/2023',
    status: 'active',
    category: 'biblia',
    students: 15,
    maxStudents: 20
  },
  {
    id: 2,
    title: 'Liderança Cristã',
    instructor: 'Pastor André',
    startDate: '15/07/2023',
    endDate: '30/08/2023',
    status: 'upcoming',
    category: 'lideranca',
    students: 0,
    maxStudents: 15
  },
  {
    id: 3,
    title: 'Discipulado Básico',
    instructor: 'Diác. Marina',
    startDate: '01/03/2023',
    endDate: '15/04/2023',
    status: 'completed',
    category: 'discipulado',
    students: 18,
    maxStudents: 20
  },
  {
    id: 4,
    title: 'Evangelismo Prático',
    instructor: 'Ev. Paulo',
    startDate: '10/06/2023',
    endDate: '10/07/2023',
    status: 'upcoming',
    category: 'evangelismo',
    students: 5,
    maxStudents: 30
  },
  {
    id: 5,
    title: 'Família Cristã',
    instructor: 'Pastor João e Rebeca',
    startDate: '01/02/2023',
    endDate: '28/02/2023',
    status: 'completed',
    category: 'familia',
    students: 22,
    maxStudents: 25
  },
];

const getStatusLabel = (status: CourseStatus) => {
  const labels = {
    active: 'Ativo',
    upcoming: 'Em breve',
    completed: 'Concluído',
    archived: 'Arquivado'
  };
  return labels[status];
};

const getStatusBadgeVariant = (status: CourseStatus): "default" | "secondary" | "destructive" | "outline" => {
  const variants = {
    active: 'default',
    upcoming: 'secondary',
    completed: 'outline',
    archived: 'destructive'
  };
  return variants[status] as "default" | "secondary" | "destructive" | "outline";
};

const getCategoryLabel = (category: CourseCategory) => {
  const labels = {
    biblia: 'Bíblia',
    lideranca: 'Liderança',
    discipulado: 'Discipulado',
    evangelismo: 'Evangelismo',
    familia: 'Família'
  };
  return labels[category];
};

const CoursesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses] = useState<Course[]>(mockCourses);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-md border">
      <div className="flex flex-col sm:flex-row justify-between gap-4 p-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-full sm:w-[250px]"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                <span>Status</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Todos</DropdownMenuItem>
              <DropdownMenuItem>Ativos</DropdownMenuItem>
              <DropdownMenuItem>Em breve</DropdownMenuItem>
              <DropdownMenuItem>Concluídos</DropdownMenuItem>
              <DropdownMenuItem>Arquivados</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                <span>Categoria</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Todas</DropdownMenuItem>
              <DropdownMenuItem>Bíblia</DropdownMenuItem>
              <DropdownMenuItem>Liderança</DropdownMenuItem>
              <DropdownMenuItem>Discipulado</DropdownMenuItem>
              <DropdownMenuItem>Evangelismo</DropdownMenuItem>
              <DropdownMenuItem>Família</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <div className="flex items-center gap-1">
                Título
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Instrutor</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Vagas</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell>{course.startDate} a {course.endDate}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(course.status)}>
                    {getStatusLabel(course.status)}
                  </Badge>
                </TableCell>
                <TableCell>{getCategoryLabel(course.category)}</TableCell>
                <TableCell>
                  {course.students}/{course.maxStudents}
                  {course.status === 'active' && course.students < course.maxStudents && (
                    <span className="ml-2 text-xs text-green-600">
                      ({course.maxStudents - course.students} disponíveis)
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Ver alunos</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Arquivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum curso encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoursesList;

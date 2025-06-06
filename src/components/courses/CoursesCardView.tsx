
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2, Calendar, MapPin, Users, Search, Image } from 'lucide-react';
import { Course } from '@/types/libraryTypes';
import { useAuth } from '@/contexts/AuthContext';

interface CoursesCardViewProps {
  courses: Course[];
  onView?: (course: Course) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

const CoursesCardView: React.FC<CoursesCardViewProps> = ({ 
  courses, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', className: 'bg-green-500 hover:bg-green-600' },
      inactive: { label: 'Inativo', className: 'bg-gray-500 hover:bg-gray-600' },
      completed: { label: 'Concluído', className: 'bg-blue-500 hover:bg-blue-600' },
      coming_soon: { label: 'Em Breve', className: 'bg-orange-500 hover:bg-orange-600' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels = {
      biblia: 'Bíblia',
      lideranca: 'Liderança',
      discipulado: 'Discipulado',
      evangelismo: 'Evangelismo',
      familia: 'Família'
    };
    return categoryLabels[category as keyof typeof categoryLabels] || category;
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou instrutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="coming_soon">Em Breve</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="biblia">Bíblia</SelectItem>
            <SelectItem value="lideranca">Liderança</SelectItem>
            <SelectItem value="discipulado">Discipulado</SelectItem>
            <SelectItem value="evangelismo">Evangelismo</SelectItem>
            <SelectItem value="familia">Família</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards dos Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              {course.image_url ? (
                <img 
                  src={course.image_url} 
                  alt={course.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => onView && onView(course)}
                />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <Image className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                {getStatusBadge(course.status)}
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
              </div>
              <CardDescription className="line-clamp-2">
                {course.description || 'Sem descrição disponível'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Instrutor: {course.instructor}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(course.start_date).toLocaleDateString('pt-BR')} - {' '}
                    {new Date(course.end_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                {course.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{course.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{course.students || 0}/{course.max_students} alunos</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant="outline">
                  {getCategoryLabel(course.category)}
                </Badge>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView && onView(course)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {isAdmin() && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit && onEdit(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete && onDelete(course)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
              ? "Nenhum curso encontrado com os filtros aplicados." 
              : "Nenhum curso encontrado."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursesCardView;

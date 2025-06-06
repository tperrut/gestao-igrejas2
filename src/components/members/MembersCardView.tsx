
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2, Mail, Phone, Calendar, Search } from 'lucide-react';
import { Member } from '@/types/libraryTypes';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MembersCardViewProps {
  members: Member[];
  onView?: (member: Member) => void;
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
}

const MembersCardView: React.FC<MembersCardViewProps> = ({ 
  members, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const getInitials = (name: string): string => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesRole = roleFilter === 'all' || (member.role && member.role.toLowerCase() === roleFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Extrair funções únicas dos membros para o filtro
  const uniqueRoles = Array.from(new Set(members.filter(m => m.role).map(m => m.role))).sort();

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
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
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Funções</SelectItem>
            {uniqueRoles.map(role => (
              <SelectItem key={role} value={role?.toLowerCase() || ''}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards dos Membros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-3">
              <div className="flex flex-col items-center space-y-3">
                <Avatar 
                  className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onView && onView(member)}
                >
                  {member.avatar_url ? (
                    <AvatarImage src={member.avatar_url} alt={member.name} />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="space-y-1 text-center">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <div className="flex justify-center gap-2">
                    <Badge 
                      variant={member.status === 'active' ? "default" : "outline"}
                      className={member.status === 'active' ? "bg-green-500" : ""}
                    >
                      {member.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {member.role && (
                      <Badge variant="outline">{member.role}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                
                {member.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Entrada: {formatDate(member.join_date)}</span>
                </div>
                
                {member.birth_date && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Nascimento: {formatDate(member.birth_date)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView && onView(member)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit && onEdit(member)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete && onDelete(member)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' || roleFilter !== 'all' 
              ? "Nenhum membro encontrado com os filtros aplicados." 
              : "Nenhum membro encontrado."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default MembersCardView;

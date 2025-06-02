
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/types/libraryTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MemberViewModal from './MemberViewModal';
import MembersFilter from './MembersFilter';

interface MembersListProps {
  onEdit?: (member: Member) => void;
}

const MembersList: React.FC<MembersListProps> = ({ onEdit }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchName, roleFilter]);

  async function fetchMembers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      if (data) {
        setMembers(data as Member[]);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar membros",
        description: "Ocorreu um erro ao buscar os membros.",
        variant: "destructive"
      });
      console.error("Erro ao buscar membros:", error);
    } finally {
      setLoading(false);
    }
  }

  const filterMembers = () => {
    let filtered = members;

    // Filtro por nome
    if (searchName.trim()) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filtro por função
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member =>
        member.role?.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    setFilteredMembers(filtered);
  };

  const handleDelete = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);
      
      if (error) {
        throw error;
      }
      
      setMembers(members.filter(member => member.id !== memberId));
      
      toast({
        title: "Membro removido",
        description: "O membro foi removido com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao remover membro",
        description: "Ocorreu um erro ao remover o membro.",
        variant: "destructive"
      });
      console.error("Erro ao excluir membro:", error);
    }
  };

  const handleView = (member: Member) => {
    setViewingMember(member);
    setIsViewModalOpen(true);
  };

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

  return (
    <>
      <MembersFilter
        searchName={searchName}
        onSearchNameChange={setSearchName}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Data de Nascimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Data de Entrada</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Carregando membros...
                </TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {searchName || roleFilter !== 'all' 
                    ? "Nenhum membro encontrado com os filtros aplicados." 
                    : "Nenhum membro encontrado."
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {member.avatar_url ? (
                          <AvatarImage src={member.avatar_url} alt={member.name} />
                        ) : (
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      {member.name}
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone || '-'}</TableCell>
                  <TableCell>{member.role || '-'}</TableCell>
                  <TableCell>{formatDate(member.birth_date)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={member.status === 'active' ? "default" : "outline"}
                      className={member.status === 'active' ? "bg-green-500" : ""}
                    >
                      {member.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(member.join_date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(member)}>
                          <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit && onEdit(member)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MemberViewModal
        isOpen={isViewModalOpen}
        onClose={setIsViewModalOpen}
        member={viewingMember}
      />
    </>
  );
};

export default MembersList;

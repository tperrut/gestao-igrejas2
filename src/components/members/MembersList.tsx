
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye, UserX, UserCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Member } from "@/types/libraryTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MemberViewModal from './MemberViewModal';
import MembersFilter from './MembersFilter';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useMemberService } from '@/services/memberService';

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
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
    variant?: 'default' | 'destructive';
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
    variant: 'default'
  });

  const { fetchMembers, inactivateMember, reactivateMember, deleteMember } = useMemberService();

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchName, roleFilter]);

  const loadMembers = async () => {
    setLoading(true);
    const memberData = await fetchMembers();
    setMembers(memberData);
    setLoading(false);
  };

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

  const handleInactivate = async (member: Member) => {
    const success = await inactivateMember(member.id);
    if (success) {
      await loadMembers();
    }
  };

  const handleReactivate = async (member: Member) => {
    const success = await reactivateMember(member.id);
    if (success) {
      await loadMembers();
    }
  };

  const handleDelete = async (member: Member) => {
    const success = await deleteMember(member.id);
    if (success) {
      await loadMembers();
    }
  };

  const openInactivateDialog = (member: Member) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Inativar Membro',
      description: `Tem certeza que deseja inativar ${member.name}? O membro não poderá fazer novos empréstimos, mas o histórico será mantido.`,
      action: () => handleInactivate(member),
      variant: 'destructive'
    });
  };

  const openReactivateDialog = (member: Member) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reativar Membro',
      description: `Deseja reativar ${member.name}? O membro poderá voltar a fazer empréstimos.`,
      action: () => handleReactivate(member),
      variant: 'default'
    });
  };

  const openDeleteDialog = (member: Member) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Membro',
      description: `ATENÇÃO: Deseja excluir permanentemente ${member.name}? Esta ação não pode ser desfeita e só é permitida para membros sem histórico de empréstimos.`,
      action: () => handleDelete(member),
      variant: 'destructive'
    });
  };

  const handleView = (member: Member) => {
    setViewingMember(member);
    setIsViewModalOpen(true);
  };

  const closeDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
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
                      className={member.status === 'active' ? "bg-green-500" : "bg-red-500"}
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
                        {member.status === 'active' ? (
                          <DropdownMenuItem 
                            className="text-orange-600"
                            onClick={() => openInactivateDialog(member)}
                          >
                            <UserX className="mr-2 h-4 w-4" /> Inativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="text-green-600"
                            onClick={() => openReactivateDialog(member)}
                          >
                            <UserCheck className="mr-2 h-4 w-4" /> Reativar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => openDeleteDialog(member)}
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

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeDialog}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
      />
    </>
  );
};

export default MembersList;

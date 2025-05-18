
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

interface MembersListProps {
  onEdit?: (member: Member) => void;
}

const MembersList: React.FC<MembersListProps> = ({ onEdit }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

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

  const handleDelete = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);
      
      if (error) {
        throw error;
      }
      
      // Atualiza a lista de membros após a exclusão
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

  const handleView = (memberId: string) => {
    toast({
      title: "Visualizar detalhes",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  const getInitials = (name: string): string => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Data de Entrada</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Carregando membros...
              </TableCell>
            </TableRow>
          ) : members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum membro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
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
                <TableCell>
                  <Badge 
                    variant={member.status === 'active' ? "default" : "outline"}
                    className={member.status === 'active' ? "bg-green-500" : ""}
                  >
                    {member.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(member.join_date).toLocaleDateString('pt-BR')}
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
                      <DropdownMenuItem onClick={() => handleView(member.id)}>
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
  );
};

export default MembersList;

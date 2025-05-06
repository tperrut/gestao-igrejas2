
import React from 'react';
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

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  role: string;
  joinDate: string;
}

// Mock data for member list
const mockMembers: Member[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@exemplo.com",
    phone: "(11) 99999-1111",
    status: "active",
    role: "Pastor",
    joinDate: "2020-01-15"
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria@exemplo.com",
    phone: "(11) 99999-2222",
    status: "active",
    role: "Líder de Louvor",
    joinDate: "2020-03-20"
  },
  {
    id: 3,
    name: "Pedro Santos",
    email: "pedro@exemplo.com",
    phone: "(11) 99999-3333",
    status: "inactive",
    role: "Membro",
    joinDate: "2019-05-10"
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana@exemplo.com",
    phone: "(11) 99999-4444",
    status: "active",
    role: "Diácono",
    joinDate: "2021-02-08"
  }
];

interface MembersListProps {
  onEdit?: (member: Member) => void;
}

const MembersList: React.FC<MembersListProps> = ({ onEdit }) => {
  const { toast } = useToast();

  const handleDelete = (memberId: number) => {
    toast({
      title: "Membro removido",
      description: "O membro foi removido com sucesso."
    });
  };

  const handleView = (memberId: number) => {
    toast({
      title: "Visualizar detalhes",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Data de Entrada</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>
                <Badge 
                  variant={member.status === 'active' ? "default" : "outline"}
                  className={member.status === 'active' ? "bg-green-500" : ""}
                >
                  {member.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(member.joinDate).toLocaleDateString('pt-BR')}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersList;

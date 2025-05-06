
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
  Check 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  role: string;
  joinDate: string;
}

const mockMembers: Member[] = [
  { 
    id: 1, 
    name: 'João Silva', 
    email: 'joao.silva@email.com', 
    phone: '(11) 99999-1234', 
    status: 'active',
    role: 'Pastor',
    joinDate: '12/05/2018'
  },
  { 
    id: 2, 
    name: 'Maria Oliveira', 
    email: 'maria.oliveira@email.com', 
    phone: '(11) 99999-5678', 
    status: 'active',
    role: 'Líder de Louvor',
    joinDate: '03/11/2019'
  },
  { 
    id: 3, 
    name: 'Pedro Santos', 
    email: 'pedro.santos@email.com', 
    phone: '(11) 99999-9012', 
    status: 'inactive',
    role: 'Membro',
    joinDate: '28/02/2020'
  },
  { 
    id: 4, 
    name: 'Ana Costa', 
    email: 'ana.costa@email.com', 
    phone: '(11) 99999-3456', 
    status: 'active',
    role: 'Diácono',
    joinDate: '15/07/2017'
  },
  { 
    id: 5, 
    name: 'Lucas Ferreira', 
    email: 'lucas.ferreira@email.com', 
    phone: '(11) 99999-7890', 
    status: 'active',
    role: 'Membro',
    joinDate: '22/09/2021'
  },
];

const MembersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<Member[]>(mockMembers);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar membros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-[150px] sm:w-[250px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <span>Status</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Todos
            </DropdownMenuItem>
            <DropdownMenuItem>Ativos</DropdownMenuItem>
            <DropdownMenuItem>Inativos</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <div className="flex items-center gap-1">
                Nome
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Data de Entrada</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.joinDate}</TableCell>
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
                      <DropdownMenuItem className="text-destructive">
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum membro encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersList;

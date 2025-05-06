import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from 'lucide-react';
import MembersList from '@/components/members/MembersList';
import MemberModal from '@/components/members/MemberModal';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Member {
  id?: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  role: string;
  joinDate: string;
}

const Members: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | undefined>(undefined);
  const { toast } = useToast();

  const handleOpenCreateModal = () => {
    setEditingMember(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleSaveMember = (member: Omit<Member, 'id'>) => {
    if (editingMember?.id) {
      // Update existing member
      toast({
        title: "Membro atualizado",
        description: `${member.name} foi atualizado com sucesso.`
      });
    } else {
      // Create new member
      toast({
        title: "Membro adicionado",
        description: `${member.name} foi adicionado com sucesso.`
      });
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Membros</h1>
            <p className="text-muted-foreground">
              Gerencie todos os membros da igreja nesta seção.
            </p>
          </div>
          <Button className="sm:self-end" onClick={handleOpenCreateModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Membro
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Membros
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Novos Membros
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                Nos últimos 30 dias
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Membros Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">210</div>
              <p className="text-xs text-muted-foreground">
                84% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aniversariantes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                No mês atual
              </p>
            </CardContent>
          </Card>
        </div>

        <MembersList onEdit={handleOpenEditModal} />

        <MemberModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMember}
          member={editingMember}
          title={editingMember ? "Editar Membro" : "Novo Membro"}
        />
      </div>
    </>
  );
};

export default Members;

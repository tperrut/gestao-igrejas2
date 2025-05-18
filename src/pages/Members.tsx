
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from 'lucide-react';
import MembersList from '@/components/members/MembersList';
import MemberModal from '@/components/members/MemberModal';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { MemberFormValues } from '@/components/members/MemberForm';
import { useEffect } from 'react';
import { Member } from '@/types/libraryTypes';
import BirthdayCard from '@/components/dashboard/BirthdayCard';

const Members: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | undefined>(undefined);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    new: 0,
    birthdays: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMemberStats();
  }, []);

  async function fetchMemberStats() {
    try {
      // Total de membros
      const { count: totalCount, error: totalError } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });

      // Membros ativos
      const { count: activeCount, error: activeError } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Novos membros (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: newCount, error: newError } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .gte('join_date', thirtyDaysAgo.toISOString().split('T')[0]);

      // Aniversariantes do mês atual
      const currentMonth = new Date().getMonth() + 1; // Janeiro é 0
      const { count: birthdayCount, error: birthdayError } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .not('birth_date', 'is', null)
        .filter('birth_date', 'ilike', `%-${currentMonth.toString().padStart(2, '0')}-%`);

      if (totalError || activeError || newError || birthdayError) {
        throw new Error('Erro ao buscar estatísticas');
      }

      setStats({
        total: totalCount || 0,
        active: activeCount || 0,
        new: newCount || 0,
        birthdays: birthdayCount || 0
      });

    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  }

  const handleOpenCreateModal = () => {
    setEditingMember(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleSaveMember = async (member: MemberFormValues) => {
    try {
      if (editingMember?.id) {
        // Update existing member
        const { error } = await supabase
          .from('members')
          .update({
            name: member.name,
            email: member.email,
            phone: member.phone,
            status: member.status,
            role: member.role,
            join_date: member.join_date,
            birth_date: member.birth_date || null,
            avatar_url: member.avatar_url
          })
          .eq('id', editingMember.id);

        if (error) throw error;

        toast({
          title: "Membro atualizado",
          description: `${member.name} foi atualizado com sucesso.`
        });
      } else {
        // Create new member
        const { error } = await supabase
          .from('members')
          .insert([{
            name: member.name,
            email: member.email,
            phone: member.phone,
            status: member.status,
            role: member.role,
            join_date: member.join_date,
            birth_date: member.birth_date || null,
            avatar_url: member.avatar_url
          }]);

        if (error) throw error;

        toast({
          title: "Membro adicionado",
          description: `${member.name} foi adicionado com sucesso.`
        });
      }
      
      // Atualizar estatísticas
      fetchMemberStats();
      
    } catch (error) {
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao salvar o membro.`,
        variant: "destructive"
      });
      console.error("Erro ao salvar membro:", error);
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
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Membros registrados
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
              <div className="text-2xl font-bold">{stats.new}</div>
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
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}% do total` : '0% do total'}
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
              <div className="text-2xl font-bold">{stats.birthdays}</div>
              <p className="text-xs text-muted-foreground">
                No mês atual
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MembersList onEdit={handleOpenEditModal} />
          </div>
          <div>
            <BirthdayCard />
          </div>
        </div>

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

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, List, Grid } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MembersList from '@/components/members/MembersList';
import MembersCardView from '@/components/members/MembersCardView';
import MemberModal from '@/components/members/MemberModal';
import MemberViewModal from '@/components/members/MemberViewModal';
import { useToast } from '@/components/ui/use-toast';
import { Member } from '@/types/libraryTypes';
import { MemberFormValues } from '@/components/members/MemberForm';
import { supabase } from '@/integrations/supabase/client';
import { getDefaultTenantId } from '@/utils/tenant';

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('name');

      if (error) throw error;
      if (data) setMembers(data as Member[]);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Erro ao carregar membros",
        description: "Não foi possível carregar a lista de membros.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMember = () => {
    setMode('create');
    setSelectedMember(undefined);
    setIsModalOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setMode('edit');
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleViewMember = (member: Member) => {
    setViewingMember(member);
    setIsViewModalOpen(true);
  };

  const handleDeleteMember = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;
    
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', selectedMember.id);
        
      if (error) throw error;
      
      setMembers(members.filter(m => m.id !== selectedMember.id));
      toast({
        title: "Membro excluído",
        description: `O membro ${selectedMember.name} foi excluído com sucesso.`,
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Erro ao excluir membro",
        description: "Não foi possível excluir o membro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedMember(undefined);
    }
  };

  const handleSaveMember = async (memberData: MemberFormValues) => {
    try {
      if (mode === 'create') {
        const { data, error } = await supabase
          .from('members')
          .insert([
            {
              name: memberData.name,
              email: memberData.email,
              phone: memberData.phone || null,
              role: memberData.role || null,
              status: memberData.status,
              join_date: memberData.join_date,
              birth_date: memberData.birth_date || null,
              avatar_url: memberData.avatar_url || null,
              tenant_id: getDefaultTenantId(),
            }
          ])
          .select();

        if (error) throw error;
        
        if (data && data[0]) {
          setMembers([data[0] as Member, ...members]);
        }
        
        toast({
          title: "Membro criado",
          description: `O membro ${memberData.name} foi criado com sucesso.`,
        });
      } else if (mode === 'edit' && selectedMember) {
        const { error } = await supabase
          .from('members')
          .update({
            name: memberData.name,
            email: memberData.email,
            phone: memberData.phone || null,
            role: memberData.role || null,
            status: memberData.status,
            join_date: memberData.join_date,
            birth_date: memberData.birth_date || null,
            avatar_url: memberData.avatar_url || null,
          })
          .eq('id', selectedMember.id);

        if (error) throw error;
        
        const updatedMember = { ...selectedMember, ...memberData };
        setMembers(members.map(m => m.id === selectedMember.id ? updatedMember as Member : m));
        
        toast({
          title: "Membro atualizado",
          description: `O membro ${memberData.name} foi atualizado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error saving member:', error);
      toast({
        title: "Erro ao salvar membro",
        description: "Não foi possível salvar o membro. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membros</h1>
          <p className="text-muted-foreground">
            Gerencie todos os membros da igreja
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleCreateMember} className="bg-church-blue">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Membro
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p>Carregando membros...</p>
        </div>
      ) : viewMode === 'cards' ? (
        <MembersCardView 
          members={members}
          onView={handleViewMember}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
        />
      ) : (
        <MembersList 
          onEdit={handleEditMember} 
        />
      )}

      <MemberModal 
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        onSave={handleSaveMember}
        member={selectedMember}
        title={mode === 'edit' ? "Editar Membro" : "Novo Membro"}
      />

      <MemberViewModal
        isOpen={isViewModalOpen}
        onClose={setIsViewModalOpen}
        member={viewingMember}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá excluir permanentemente o membro{' '}
              <span className="font-bold">{selectedMember?.name}</span>.
            </AlertDialogDescription>
            </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Members;

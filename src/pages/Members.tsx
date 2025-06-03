
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
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
import MemberModal from '@/components/members/MemberModal';
import { useToast } from '@/components/ui/use-toast';
import { Member } from '@/types/libraryTypes';
import { supabase } from '@/integrations/supabase/client';

export interface MemberFormValues {
  name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  join_date: string;
  status: 'active' | 'inactive';
  role?: string;
  avatar_url?: string;
}

const Members = () => {
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();

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
              phone: memberData.phone,
              role: memberData.role,
              status: memberData.status,
              join_date: memberData.join_date,
              birth_date: memberData.birth_date,
              avatar_url: memberData.avatar_url,
            }
          ])
          .select();

        if (error) throw error;
        
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
            phone: memberData.phone,
            role: memberData.role,
            status: memberData.status,
            join_date: memberData.join_date,
            birth_date: memberData.birth_date,
            avatar_url: memberData.avatar_url,
          })
          .eq('id', selectedMember.id);

        if (error) throw error;
        
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
        <Button onClick={handleCreateMember} className="bg-church-blue flex-1 sm:flex-none">
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Membro
        </Button>
      </div>

      <MembersList 
        onEdit={handleEditMember} 
      />

      <MemberModal 
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        onSave={handleSaveMember}
        member={selectedMember}
        title={mode === 'edit' ? "Editar Membro" : "Novo Membro"}
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

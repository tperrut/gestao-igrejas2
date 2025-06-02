
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
import MembersFilter from '@/components/members/MembersFilter';
import { useToast } from '@/components/ui/use-toast';
import { Member } from '@/types/libraryTypes';
import { supabase } from '@/integrations/supabase/client';

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [isLoading, setIsLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchName, roleFilter]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      const formattedMembers: Member[] = data.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        role: member.role,
        status: member.status,
        join_date: member.join_date,
        birth_date: member.birth_date,
        avatar_url: member.avatar_url,
        created_at: member.created_at,
        updated_at: member.updated_at
      }));

      setMembers(formattedMembers);
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

  const filterMembers = () => {
    let filtered = [...members];

    // Filtro por nome
    if (searchName) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filtro por função
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    setFilteredMembers(filtered);
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

  const handleSaveMember = async (memberData: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => {
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
        
        if (data && data[0]) {
          const newMember: Member = {
            id: data[0].id,
            name: data[0].name,
            email: data[0].email,
            phone: data[0].phone,
            role: data[0].role,
            status: data[0].status,
            join_date: data[0].join_date,
            birth_date: data[0].birth_date,
            avatar_url: data[0].avatar_url,
            created_at: data[0].created_at,
            updated_at: data[0].updated_at,
          };
          
          setMembers([...members, newMember]);
          toast({
            title: "Membro criado",
            description: `O membro ${memberData.name} foi criado com sucesso.`,
          });
        }
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
        
        const updatedMember: Member = {
          ...selectedMember,
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
          role: memberData.role,
          status: memberData.status,
          join_date: memberData.join_date,
          birth_date: memberData.birth_date,
          avatar_url: memberData.avatar_url,
        };
        
        setMembers(members.map(m => m.id === selectedMember.id ? updatedMember : m));
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

      <MembersFilter
        searchName={searchName}
        onSearchNameChange={setSearchName}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      <MembersList 
        members={filteredMembers} 
        isLoading={isLoading} 
        onEdit={handleEditMember} 
        onDelete={handleDeleteMember} 
      />

      <MemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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

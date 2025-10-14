import { supabase } from '@/integrations/supabase/client';
import { TenantUser } from '@/types/tenantTypes';
import { useToast } from '@/components/ui/use-toast';

export const useUserTenantService = () => {
  const { toast } = useToast();

  const fetchTenantUsers = async (tenantId: string): Promise<TenantUser[]> => {
    try {
      const { data, error } = await supabase
        .from('tenant_users')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false});

      if (error) throw error;
      return (data || []) as TenantUser[];
    } catch (error) {
      console.error('Error fetching tenant users:', error);
      toast({
        title: 'Erro ao carregar usuários',
        description: 'Não foi possível carregar os usuários do tenant.',
        variant: 'destructive',
      });
      return [];
    }
  };

  const linkUserToTenant = async (
    tenantId: string,
    userId: string,
    role: 'admin' | 'member' = 'member'
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tenant_users')
        .insert([{
          tenant_id: tenantId,
          user_id: userId,
          role: role,
          status: 'active',
        }]);

      if (error) throw error;

      toast({
        title: 'Usuário vinculado',
        description: 'O usuário foi vinculado ao tenant com sucesso.',
      });

      return true;
    } catch (error) {
      console.error('Error linking user to tenant:', error);
      toast({
        title: 'Erro ao vincular usuário',
        description: 'Não foi possível vincular o usuário ao tenant.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateUserTenantRole = async (
    userId: string,
    tenantId: string,
    role: 'owner' | 'admin' | 'member'
  ): Promise<boolean> => {
    try {
      // Update in user_roles table
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId)
        .eq('tenant_id', tenantId);

      if (error) throw error;

      toast({
        title: 'Role atualizada',
        description: 'A role do usuário foi atualizada com sucesso.',
      });

      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Erro ao atualizar role',
        description: 'Não foi possível atualizar a role do usuário.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeUserFromTenant = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tenant_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Usuário removido',
        description: 'O usuário foi removido do tenant.',
      });

      return true;
    } catch (error) {
      console.error('Error removing user from tenant:', error);
      toast({
        title: 'Erro ao remover usuário',
        description: 'Não foi possível remover o usuário do tenant.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    fetchTenantUsers,
    linkUserToTenant,
    updateUserTenantRole,
    removeUserFromTenant,
  };
};

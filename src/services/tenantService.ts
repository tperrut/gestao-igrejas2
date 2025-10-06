import { supabase } from '@/integrations/supabase/client';
import { Tenant, CreateTenantData } from '@/types/tenantTypes';
import { useToast } from '@/components/ui/use-toast';

export const useTenantService = () => {
  const { toast } = useToast();

  const fetchAllTenants = async (): Promise<Tenant[]> => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: 'Erro ao carregar tenants',
        description: 'Não foi possível carregar a lista de tenants.',
        variant: 'destructive',
      });
      return [];
    }
  };

  const fetchTenantById = async (id: string): Promise<Tenant | null> => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tenant:', error);
      return null;
    }
  };

  const createTenant = async (tenantData: CreateTenantData): Promise<Tenant | null> => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert([{
          name: tenantData.name,
          subdomain: tenantData.subdomain,
          plan_type: tenantData.plan_type || 'basic',
          status: 'active',
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Tenant criado',
        description: `${tenantData.name} foi criado com sucesso.`,
      });

      return data;
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: 'Erro ao criar tenant',
        description: 'Não foi possível criar o tenant. Verifique se o subdomínio já existe.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTenant = async (id: string, updates: Partial<Tenant>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Tenant atualizado',
        description: 'As informações do tenant foram atualizadas.',
      });

      return true;
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast({
        title: 'Erro ao atualizar tenant',
        description: 'Não foi possível atualizar o tenant.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteTenant = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Tenant removido',
        description: 'O tenant foi removido com sucesso.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast({
        title: 'Erro ao remover tenant',
        description: 'Não foi possível remover o tenant.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    fetchAllTenants,
    fetchTenantById,
    createTenant,
    updateTenant,
    deleteTenant,
  };
};

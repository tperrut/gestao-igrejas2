import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tenant } from '@/types/tenantTypes';

export const useTenant = () => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentTenant = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        // Buscar tenant_id do usuário
        const { data: tenantUserData } = await supabase
          .from('tenant_users')
          .select('tenant_id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (!tenantUserData) {
          setLoading(false);
          return;
        }

        setTenantId(tenantUserData.tenant_id);

        // Buscar dados do tenant
        const { data: tenantData } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', tenantUserData.tenant_id)
          .single();

  setCurrentTenant(tenantData as Tenant | null);
      } catch (error) {
        console.error('Error fetching current tenant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTenant();
  }, []);

  return {
    currentTenant,
    tenantId,
    loading,
  };
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface TenantContextType {
  tenantId: string | null;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenantContext = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantId = async () => {
      if (!user) {
        setTenantId(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('tenant_users')
          .select('tenant_id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (error) {
          console.error('Error fetching tenant_id:', error);
          setTenantId(null);
        } else {
          setTenantId(data?.tenant_id || null);
        }
      } catch (error) {
        console.error('Error fetching tenant_id:', error);
        setTenantId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantId();
  }, [user]);

  const value = {
    tenantId,
    loading,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

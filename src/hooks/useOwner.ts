import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOwner = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwnerStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsOwner(false);
          setLoading(false);
          return;
        }

        // Verificar se o usuário é owner na tabela user_roles
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'owner')
          .maybeSingle();

        setIsOwner(!!data);
      } catch (error) {
        console.error('Error checking owner status:', error);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwnerStatus();
  }, []);

  return {
    isOwner,
    loading,
  };
};

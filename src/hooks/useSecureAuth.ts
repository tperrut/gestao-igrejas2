
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export const useSecureAuth = () => {
  const { user, session, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Monitor for suspicious session activities
    if (session && user) {
      const now = new Date();
      const sessionStart = new Date(session.expires_at! - (session.expires_in || 3600) * 1000);
      
      // Check if session is unusually long (potential security issue)
      const sessionDuration = now.getTime() - sessionStart.getTime();
      const maxSessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionDuration > maxSessionDuration) {
        console.warn('Long session detected, consider refresh');
      }
    }
  }, [session, user]);

  const isAuthenticated = (): boolean => {
    return !loading && !!user && !!session;
  };

  const isAdmin = (): boolean => {
    // This should be checked on the server side as well
    // This is just for UI purposes
    return isAuthenticated() && user?.user_metadata?.role === 'admin';
  };

  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated()) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para realizar esta ação.",
        variant: "destructive",
      });
      return;
    }
    callback();
  };

  const requireAdmin = (callback: () => void) => {
    if (!isAdmin()) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para realizar esta ação.",
        variant: "destructive",
      });
      return;
    }
    callback();
  };

  return {
    isAuthenticated,
    isAdmin,
    requireAuth,
    requireAdmin,
    user,
    session,
    loading
  };
};

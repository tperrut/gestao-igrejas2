import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, validatePassword } from '@/utils/validation';
import { logger, LogCategory } from '@/utils/logger';

interface Profile {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  role: 'owner' | 'admin' | 'member';
  tenant_id: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  roleLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isOwner: () => boolean;
  isAdmin: () => boolean;
  isMember: () => boolean;
  securityEvents: Array<{
    type: string;
    timestamp: Date;
    details: any;
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);   // session presence check
  const [roleLoading, setRoleLoading] = useState(false); // profile + role fetch
  const { toast } = useToast();

  // Security: Track failed login attempts
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lastFailedAttempt, setLastFailedAttempt] = useState<Date | null>(null);

  // Enhanced security tracking
  const [securityEvents, setSecurityEvents] = useState<Array<{
    type: string;
    timestamp: Date;
    details: any;
  }>>([]);
  const fetchingProfileId = React.useRef<string | null>(null);
  // Shared promise so INITIAL_SESSION + SIGNED_IN both await the same fetch.
  const fetchProfilePromise = React.useRef<Promise<void> | null>(null);

  const logSecurityEvent = (type: string, details: any) => {
    const event = {
      type,
      timestamp: new Date(),
      details
    };

    setSecurityEvents(prev => [...prev.slice(-10), event]); // Keep last 10 events
    logger.securityLog(type, details);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);

        logSecurityEvent('auth_state_change', {
          event,
          userId: session?.user?.id,
          timestamp: new Date().toISOString()
        });

        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN') {
          setFailedAttempts(0);
          setLastFailedAttempt(null);
          logSecurityEvent('successful_sign_in', {
            userId: session?.user?.id,
            email: session?.user?.email
          });
        }

        if (event === 'SIGNED_OUT') {
          logSecurityEvent('sign_out', { userId: user?.id });
          setProfile(null);
          setUserRole(null);
          setLoading(false);
          setRoleLoading(false);
          return;
        }

        if (session?.user) {
          // Bloquear o app enquanto o role/profile é buscado para evitar race conditions
          setRoleLoading(true);
        }

        // Confirm session existence immediately to unlock the app shell (but roleLoading might be true)
        setLoading(false);

        if (session?.user) {
          const userId = session.user.id;

          // Safety timeout for the ROLE loading specifically
          const timeoutId = setTimeout(async () => {
            // Use ref check to avoid closure issues with state
            if (fetchingProfileId.current === userId) {
              console.warn('Role fetch timed out (12s). Forcing sign-out for security.');
              toast({
                title: 'Sessão instável',
                description: 'A verificação de perfil demorou demais. Por favor, tente novamente.',
                variant: 'destructive',
              });
              setRoleLoading(false);
              await supabase.auth.signOut();
            }
          }, 12_000);

          fetchUserProfile(userId).finally(() => clearTimeout(timeoutId));
        } else {
          setProfile(null);
          setUserRole(null);
          setRoleLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string): Promise<void> => {
    // If a fetch is already in progress for this user, return the SAME promise
    // so concurrent auth events (INITIAL_SESSION + SIGNED_IN) both await the
    // real DB call and roleLoading is cleared only after the fetch completes.
    if (fetchingProfileId.current === userId && fetchProfilePromise.current) {
      return fetchProfilePromise.current;
    }

    const promise = (async () => {
      setRoleLoading(true);
      try {
        fetchingProfileId.current = userId;
        logger.dbLog('Fetching user profile', { userId });

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) {
          logger.dbError('Failed to fetch user profile', profileError, { userId });
          console.error('Error fetching profile:', profileError);
          setProfile(null);
          return;
        }

        setProfile(profileData as Profile);

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role, tenant_id')
          .eq('user_id', userId)
          .maybeSingle();

        if (roleError) {
          logger.dbError('Failed to fetch user role', roleError, { userId });
        }

        setUserRole(roleData as UserRole | null);
        logger.authLog('User profile fetched successfully', userId, { role: roleData?.role });
      } catch (error) {
        logger.authError('Error fetching user profile', error instanceof Error ? error : new Error(String(error)), { userId }, userId);
        console.error('Error fetching user profile:', error);
        setProfile(null);
        setUserRole(null);
      } finally {
        setRoleLoading(false);
        fetchingProfileId.current = null;
        fetchProfilePromise.current = null;
      }
    })();

    fetchProfilePromise.current = promise;
    return promise;
  };

  // Enhanced security: Check if user should be rate limited
  const isRateLimited = (): boolean => {
    if (failedAttempts >= 5 && lastFailedAttempt) {
      const timeSinceLastAttempt = Date.now() - lastFailedAttempt.getTime();
      const lockoutDuration = 15 * 60 * 1000; // 15 minutes

      if (timeSinceLastAttempt < lockoutDuration) {
        logSecurityEvent('rate_limit_active', {
          failedAttempts,
          lockoutRemaining: lockoutDuration - timeSinceLastAttempt
        });
        return true;
      }
    }
    return false;
  };

  const signIn = async (email: string, password: string) => {
    const loginAttemptId = `login_${Date.now()}`;

    try {
      logger.authLog('Sign in attempt started', undefined, { email, attemptId: loginAttemptId });

      // Security: Input validation
      if (!validateEmail(email)) {
        const error = new Error('Email inválido');
        logger.validationError('Invalid email format in sign in', error, { email });
        logSecurityEvent('invalid_email_attempt', { email });
        toast({
          title: "Erro no login",
          description: "Email inválido",
          variant: "destructive",
        });
        return { error };
      }

      // Security: Rate limiting
      if (isRateLimited()) {
        const error = new Error('Muitas tentativas de login. Tente novamente em 15 minutos.');
        logSecurityEvent('rate_limit_triggered', {
          email,
          failedAttempts,
          lastFailedAttempt: lastFailedAttempt?.toISOString()
        });
        toast({
          title: "Acesso bloqueado",
          description: "Muitas tentativas de login. Tente novamente em 15 minutos.",
          variant: "destructive",
        });
        return { error };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        // Security: Track failed attempts
        setFailedAttempts(prev => prev + 1);
        setLastFailedAttempt(new Date());

        logSecurityEvent('sign_in_failed', {
          email,
          attemptId: loginAttemptId,
          failedAttempts: failedAttempts + 1,
          errorMessage: error.message
        });

        logger.authError('Sign in failed', error, {
          email,
          attemptId: loginAttemptId,
          failedAttempts: failedAttempts + 1
        }, undefined);

        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        logger.authLog('Sign in successful', undefined, {
          email,
          attemptId: loginAttemptId
        });

        toast({
          title: "Login realizado",
          description: "Bem-vindo de volta!",
        });
      }

      return { error };
    } catch (error) {
      logger.authError('Unexpected error during sign in', error instanceof Error ? error : new Error(String(error)), {
        email,
        attemptId: loginAttemptId
      }, undefined);
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Security: Input validation
      if (!validateEmail(email)) {
        const error = new Error('Email inválido');
        toast({
          title: "Erro no cadastro",
          description: "Email inválido",
          variant: "destructive",
        });
        return { error };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        const error = new Error(passwordValidation.message);
        toast({
          title: "Senha inválida",
          description: passwordValidation.message,
          variant: "destructive",
        });
        return { error };
      }

      if (!name.trim() || name.trim().length < 2) {
        const error = new Error('Nome deve ter pelo menos 2 caracteres');
        toast({
          title: "Nome inválido",
          description: "Nome deve ter pelo menos 2 caracteres",
          variant: "destructive",
        });
        return { error };
      }

      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name.trim(),
          }
        }
      });

      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado",
          description: "Verifique seu email para confirmar a conta.",
        });
      }

      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Security: Clear sensitive data
        setFailedAttempts(0);
        setLastFailedAttempt(null);

        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isOwner = () => {
    return userRole?.role === 'owner';
  };

  const isAdmin = () => {
    // owner is NOT an admin of a specific tenant — they have their own global scope
    return userRole?.role === 'admin';
  };

  const isMember = () => {
    return userRole?.role === 'member';
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isOwner,
    isAdmin,
    isMember,
    roleLoading,
    securityEvents,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

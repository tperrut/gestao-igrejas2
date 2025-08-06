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
  role: 'member' | 'admin';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        // Log authentication events for security monitoring
        logSecurityEvent('auth_state_change', {
          event,
          userId: session?.user?.id,
          timestamp: new Date().toISOString()
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Security: Reset failed attempts on successful auth
        if (event === 'SIGNED_IN') {
          setFailedAttempts(0);
          setLastFailedAttempt(null);
          logSecurityEvent('successful_sign_in', {
            userId: session?.user?.id,
            email: session?.user?.email
          });
        }
        
        if (event === 'SIGNED_OUT') {
          logSecurityEvent('sign_out', {
            userId: user?.id
          });
        }
        
        if (session?.user) {
          // Defer profile fetching to avoid auth state callback issues
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
        logSecurityEvent('session_restored', {
          userId: session.user.id
        });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      logger.dbLog('Fetching user profile', { userId });
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.dbError('Failed to fetch user profile', error, { userId });
        console.error('Error fetching profile:', error);
        return;
      }

      // Ensure role is properly typed
      const profileData: Profile = {
        ...data,
        role: data.role as 'member' | 'admin'
      };

      setProfile(profileData);
      logger.authLog('User profile fetched successfully', userId, { role: profileData.role });
    } catch (error) {
      logger.authError('Error fetching user profile', error instanceof Error ? error : new Error(String(error)), { userId }, userId);
      console.error('Error fetching user profile:', error);
    }
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

  const isAdmin = () => {
    const adminCheck = profile?.role === 'admin';
    if (adminCheck) {
      logSecurityEvent('admin_access_check', {
        userId: user?.id,
        profileRole: profile?.role
      });
    }
    return adminCheck;
  };

  const isMember = () => {
    return profile?.role === 'member';
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isMember,
    securityEvents, // Expose security events for monitoring
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

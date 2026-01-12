
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { logger } from '@/utils/logger';

export const useSecurityMonitoring = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!session || !user) return;

    // Monitor for suspicious session activities
    const now = new Date();
    const sessionStart = new Date(session.expires_at! - (session.expires_in || 3600) * 1000);
    
    // Check if session is unusually long (potential security issue)
    const sessionDuration = now.getTime() - sessionStart.getTime();
    const maxSessionDuration = 24 * 60 * 60 * 1000; // 24 hours
    
    if (sessionDuration > maxSessionDuration) {
      logger.securityLog('Long session detected', {
        userId: user.id,
        sessionDuration: sessionDuration,
        sessionStart: sessionStart.toISOString()
      });
      console.warn('Long session detected, consider refresh');
    }

    // Monitor for multiple rapid authentication state changes
    const authStateChangeTime = Date.now();
    const lastChangeTime = localStorage.getItem('lastAuthStateChange');
    
    if (lastChangeTime) {
      const timeDiff = authStateChangeTime - parseInt(lastChangeTime);
      if (timeDiff < 1000) { // Less than 1 second between changes
        logger.securityLog('Rapid authentication state changes detected', {
          userId: user.id,
          timeDifference: timeDiff
        });
      }
    }
    
    localStorage.setItem('lastAuthStateChange', authStateChangeTime.toString());

    // Monitor for unusual login patterns
    const currentHour = new Date().getHours();
    if (currentHour < 6 || currentHour > 23) {
      logger.securityLog('Unusual login time detected', {
        userId: user.id,
        loginHour: currentHour,
        timestamp: new Date().toISOString()
      });
    }

  }, [session, user]);

  const reportSecurityIncident = (incident: string, details?: unknown) => {
    // Throttle security logging to prevent noise
    const lastReport = localStorage.getItem(`last_security_report_${incident}`);
    const now = Date.now();
    
    if (!lastReport || (now - parseInt(lastReport)) > 60000) { // Only log once per minute per incident type
        logger.securityLog(`Security incident: ${incident}`, {
          userId: user?.id,
          incident,
          details,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
      
      localStorage.setItem(`last_security_report_${incident}`, now.toString());

      toast({
        title: "Atividade suspeita detectada",
        description: "Por favor, verifique sua conta e contate o suporte se necessário.",
        variant: "destructive",
      });
    }
  };

  return {
    reportSecurityIncident
  };
};

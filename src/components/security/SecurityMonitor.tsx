
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { AlertTriangle, Shield, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const SecurityMonitor: React.FC = () => {
  const { user, session, securityEvents } = useAuth();
  const { reportSecurityIncident } = useSecurityMonitoring();
  const [showSecurityStatus, setShowSecurityStatus] = useState(false);

  useEffect(() => {
    // Show security status for admin users or during development
    if (user && (user.user_metadata?.role === 'admin' || process.env.NODE_ENV === 'development')) {
      setShowSecurityStatus(true);
    }
  }, [user]);

  if (!showSecurityStatus || !user) return null;

  const recentSecurityEvents = securityEvents?.slice(-3) || [];
  const hasRecentSuspiciousActivity = recentSecurityEvents.some(
    event => event.type.includes('failed') || event.type.includes('suspicious')
  );

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm space-y-2">
      {hasRecentSuspiciousActivity && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Atividade suspeita detectada. Monitore sua conta.
          </AlertDescription>
        </Alert>
      )}
      
      {session && (
        <Alert className="bg-muted/50 border-muted">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center justify-between text-sm">
            <span>Sessão segura ativa</span>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {Math.floor((Date.now() - new Date(session.created_at || '').getTime()) / (1000 * 60))}m
            </Badge>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SecurityMonitor;

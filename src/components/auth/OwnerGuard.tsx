import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOwner } from '@/hooks/useOwner';
import { useAuth } from '@/contexts/AuthContext';

interface OwnerGuardProps {
  children: React.ReactNode;
}

const OwnerGuard: React.FC<OwnerGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { isOwner, loading: ownerLoading } = useOwner();

  if (authLoading || ownerLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-muted-foreground">
            Você precisa ser Owner da plataforma para acessar esta área.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OwnerGuard;

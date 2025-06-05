
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Shield, Users } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { profile, signOut, isAdmin } = useAuth();

  if (!profile) return null;

  const getRoleBadge = () => {
    if (isAdmin()) {
      return (
        <Badge variant="default" className="bg-red-100 text-red-800">
          <Shield className="h-3 w-3 mr-1" />
          Administrador
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800">
        <Users className="h-3 w-3 mr-1" />
        Membro
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Perfil do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Nome</label>
          <p className="text-lg font-semibold">{profile.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Email</label>
          <p>{profile.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Perfil</label>
          <div className="mt-1">
            {getRoleBadge()}
          </div>
        </div>
        <Button 
          onClick={signOut} 
          variant="outline" 
          className="w-full"
          size="sm"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;


import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { detectSubdomain, getTenantSlug } from '@/utils/subdomain';
import { supabase } from '@/integrations/supabase/client';

const Auth: React.FC = () => {
  const { user, profile, signIn, loading, isAdmin, isMember } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string>('');

  // Detect tenant from subdomain or URL parameter
  useEffect(() => {
    const slug = searchParams.get('tenant') || getTenantSlug();
    setTenantSlug(slug);
    
    // Fetch tenant name if slug exists
    if (slug) {
      fetchTenantName(slug);
    }
  }, [searchParams]);

  const fetchTenantName = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('name')
        .eq('subdomain', slug)
        .single();
      
      if (!error && data) {
        setTenantName(data.name);
      }
    } catch (error) {
      console.error('Error fetching tenant:', error);
    }
  };

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Redirect if already authenticated
  if (user && profile && !loading) {
    const subdomainInfo = detectSubdomain();
    
    // If on subdomain, always redirect to dashboard
    if (subdomainInfo.isSubdomain) {
      if (isAdmin()) {
        return <Navigate to="/dashboard" replace />;
      } else if (isMember()) {
        return <Navigate to="/member-dashboard" replace />;
      }
    } else {
      // On main domain, redirect to dashboard
      if (isAdmin()) {
        return <Navigate to="/dashboard" replace />;
      } else if (isMember()) {
        return <Navigate to="/member-dashboard" replace />;
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(loginEmail, loginPassword);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {tenantName && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {tenantName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sistema de Gestão</p>
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Entrar no Sistema
            </CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

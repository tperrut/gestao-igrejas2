
import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { detectSubdomain, getTenantSlug, fetchTenantBranding, validateTenantExists } from '@/utils/subdomain';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth: React.FC = () => {
  const { user, profile, signIn, loading, isAdmin, isMember } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string>('');
  const [tenantValid, setTenantValid] = useState<boolean | null>(null);
  const [tenantError, setTenantError] = useState<string | null>(null);

  // Detect tenant from subdomain or URL parameter
  useEffect(() => {
    const slug = searchParams.get('tenant') || getTenantSlug();
    setTenantSlug(slug);
    if (slug) {
      fetchTenantName(slug);
    } else {
      setTenantValid(false);
      setTenantName('');
    }
  }, [searchParams]);

  const fetchTenantName = async (slug: string) => {
    setTenantValid(null);
    setTenantError(null);
    try {
      const res = await fetchTenantBranding(slug);
      if (res.status === 'ok' && res.data && typeof res.data === 'object' && 'name' in res.data) {
        setTenantName((res.data as { name: string }).name);
        setTenantValid(true);
      } else if (res.status === 'not_found') {
        setTenantName('');
        setTenantValid(false);
        setTenantError('not_found');
      } else {
        // network / supabase error
        setTenantName('');
        setTenantValid(false);
        setTenantError('connection');
      }
    } catch (err) {
      console.error('Error fetching tenant (unexpected):', err);
      setTenantName('');
      setTenantValid(false);
      setTenantError('connection');
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

    // Validate tenant before login
    if (!tenantSlug || tenantValid === false) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signIn(loginEmail, loginPassword);

      if (!error) {
        // Verify user belongs to this tenant
        const { data: tenantUser } = await supabase
          .from('tenant_users')
          .select('tenant_id, tenants!inner(subdomain)')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .eq('status', 'active')
          .single();

        if (tenantUser && ((tenantUser.tenants as { subdomain?: string }).subdomain === tenantSlug)) {
          // User belongs to this tenant, redirect will happen automatically
        } else {
          // User doesn't belong to this tenant
          await supabase.auth.signOut();
          alert('Você não tem permissão para acessar este tenant.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || tenantValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {!tenantValid && (
    <Alert variant={tenantError === 'connection' ? 'default' : 'destructive'} className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {tenantError === 'connection' ? (
                <>
                  Serviço temporariamente indisponível — estamos tentando reconectar.
                  <div className="mt-2">
                    <Button size="sm" onClick={() => tenantSlug && fetchTenantName(tenantSlug)}>Tentar novamente</Button>
                  </div>
                </>
              ) : tenantError === 'not_found' ? (
                'Tenant inválido ou inativo. Verifique a URL de acesso.'
              ) : (
                'Tenant inválido ou inativo. Verifique a URL de acesso.'
              )}
            </AlertDescription>
          </Alert>
        )}

        {tenantName && tenantValid && (
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
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !tenantValid}
              >
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


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
  const { user, profile, signIn, loading, roleLoading, isOwner, isAdmin, isMember } = useAuth();
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

    // Safety timeout: don't stay in loading state forever if tenant fetch hangs
    const timeoutId = setTimeout(() => {
      setTenantValid(prev => {
        if (prev === null) {
          console.warn('Tenant branding fetch timed out (10s)');
          setTenantError('connection');
          return false;
        }
        return prev;
      });
    }, 10_000);

    try {
      const res = await fetchTenantBranding(slug);
      clearTimeout(timeoutId);

      if (res.status === 'ok') {
        setTenantName(res.data.name);
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
      clearTimeout(timeoutId);
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
  if (user && profile && !loading && !roleLoading) {
    const subdomainInfo = detectSubdomain();

    // Owner always goes to the global admin panel, regardless of subdomain
    if (isOwner()) {
      return <Navigate to="/owner/dashboard" replace />;
    }

    // If on subdomain, redirect to tenant dashboard
    if (subdomainInfo.isSubdomain) {
      if (isAdmin()) {
        return <Navigate to="/dashboard" replace />;
      } else if (isMember()) {
        return <Navigate to="/member-dashboard" replace />;
      }
    } else {
      // On main domain, redirect to appropriate dashboard
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
    if (!tenantSlug || (tenantValid === false && tenantError !== 'connection')) {
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

        if (tenantUser && (tenantUser.tenants as any).subdomain === tenantSlug) {
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

  // Show full-screen loading ONLY for auth/session check.
  // Tenant validation happens inside the layout to avoid infinite spinners.
  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isTenantValidating = tenantValid === null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {isTenantValidating ? (
          <div className="text-center mb-6 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 w-48 mx-auto rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-32 mx-auto rounded"></div>
          </div>
        ) : tenantName && tenantValid && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {tenantName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sistema de Gestão</p>
          </div>
        )}

        {!tenantValid && !isTenantValidating && (
          <Alert variant="destructive" className="mb-6 opacity-90">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {tenantError === 'connection' ? (
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Conexão lenta detectada</p>
                  <p className="text-sm">Não conseguimos carregar os dados da igreja, mas você pode tentar entrar mesmo assim.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit h-7 text-xs border-destructive/20 hover:bg-destructive/10"
                    onClick={() => tenantSlug && fetchTenantName(tenantSlug)}
                  >
                    Recarregar dados da igreja
                  </Button>
                </div>
              ) : (
                'Esta igreja não foi encontrada ou está inativa.'
              )}
            </AlertDescription>
          </Alert>
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
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isTenantValidating}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Não tem uma conta?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => navigate('/register')}
                >
                  Cadastre-se
                </Button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';
import { getTenantSlug, fetchTenantBranding } from '@/utils/subdomain';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';



const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(72, 'Senha muito longa').refine((val) => /[A-Z]/.test(val), {
      message: 'A senha deve conter pelo menos uma letra maiúscula',
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

const Register: React.FC = () => {
  const { user, signUp, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string>('');
  const [tenantValid, setTenantValid] = useState<boolean | null>(null);
  const [tenantError, setTenantError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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
      if (res.status === 'ok') {
        setTenantName(res.data.name);
        setTenantValid(true);
      } else if (res.status === 'not_found') {
        setTenantName('');
        setTenantValid(false);
        setTenantError('not_found');
      } else {
        setTenantName('');
        setTenantValid(false);
        setTenantError('connection');
      }
    } catch (err) {
      console.error('Error fetching tenant:', err);
      setTenantName('');
      setTenantValid(false);
      setTenantError('connection');
    }
  };

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate tenant before registration
    if (!tenantSlug || tenantValid === false) {
      return;
    }

    // Validate form
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    setFormErrors({});

    try {
      const { error } = await signUp(formData.email, formData.password, formData.name);

      if (!error) {
        // Success - user will see toast from signUp function
        navigate('/auth');
      }else{
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
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
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {tenantError === 'connection' ? (
                <>
                  Serviço temporariamente indisponível — estamos tentando reconectar.
                  <div className="mt-2">
                    <Button size="sm" onClick={() => tenantSlug && fetchTenantName(tenantSlug)}>
                      Tentar novamente
                    </Button>
                  </div>
                </>
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
              <UserPlus className="h-5 w-5" />
              Criar Conta
            </CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar sua conta.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={formErrors.name ? 'border-destructive' : ''}
                  required
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={formErrors.email ? 'border-destructive' : ''}
                  required
                />
                {formErrors.email && (
                  <p className="text-sm text-destructive">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pr-10 ${formErrors.password ? 'border-destructive' : ''}`}
                    required
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
                {formErrors.password && (
                  <p className="text-sm text-destructive">{formErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`pr-10 ${formErrors.confirmPassword ? 'border-destructive' : ''}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{formErrors.confirmPassword}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !tenantValid}
              >
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Já tem uma conta?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => navigate('/auth')}
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Voltar ao login
                </Button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;

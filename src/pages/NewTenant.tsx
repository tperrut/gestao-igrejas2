import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building2, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const NewTenant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [tenantData, setTenantData] = useState({
    name: '',
    subdomain: '',
    plan_type: 'basic' as 'basic' | 'premium' | 'enterprise',
  });

  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!tenantData.name || !tenantData.subdomain) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos do tenant',
        variant: 'destructive',
      });
      return;
    }

    if (!adminData.name || !adminData.email || !adminData.password) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos do administrador',
        variant: 'destructive',
      });
      return;
    }

    if (adminData.password.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter no mínimo 6 caracteres',
        variant: 'destructive',
      });
      return;
    }

    // Validar formato do subdomínio (apenas letras minúsculas, números e hífens)
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(tenantData.subdomain)) {
      toast({
        title: 'Erro',
        description: 'O subdomínio deve conter apenas letras minúsculas, números e hífens',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Chamar edge function para criar tenant + admin
      const { data, error } = await supabase.functions.invoke('create-tenant-with-admin', {
        body: {
          tenant: tenantData,
          admin: adminData,
        },
      });

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: `Tenant "${tenantData.name}" criado com sucesso!`,
      });

      navigate('/owner/tenants');
    } catch (error: any) {
      console.error('Error creating tenant:', error);
      toast({
        title: 'Erro ao criar tenant',
        description: error.message || 'Ocorreu um erro ao criar o tenant',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/owner/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Novo Tenant</h1>
          <p className="text-muted-foreground">
            Cadastre um novo tenant e seu administrador inicial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Tenant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Dados do Tenant
              </CardTitle>
              <CardDescription>
                Informações da organização que será cadastrada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenant-name">Nome da Organização *</Label>
                <Input
                  id="tenant-name"
                  placeholder="Ex: Igreja Metodista Wesleyana"
                  value={tenantData.name}
                  onChange={(e) => setTenantData({ ...tenantData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomínio *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="subdomain"
                    placeholder="Ex: imwniteroi"
                    value={tenantData.subdomain}
                    onChange={(e) => setTenantData({ ...tenantData, subdomain: e.target.value.toLowerCase() })}
                    required
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    .betelhub.com
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Apenas letras minúsculas, números e hífens
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Plano *</Label>
                <Select
                  value={tenantData.plan_type}
                  onValueChange={(value: 'basic' | 'premium' | 'enterprise') => 
                    setTenantData({ ...tenantData, plan_type: value })
                  }
                >
                  <SelectTrigger id="plan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básico</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Administrador */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Administrador Inicial
              </CardTitle>
              <CardDescription>
                Dados do primeiro administrador do tenant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Nome Completo *</Label>
                <Input
                  id="admin-name"
                  placeholder="Ex: João Silva"
                  value={adminData.name}
                  onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Email *</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  value={adminData.email}
                  onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Senha *</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={adminData.password}
                  onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  O administrador poderá alterar a senha após o primeiro login
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/owner/dashboard')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Criar Tenant
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewTenant;

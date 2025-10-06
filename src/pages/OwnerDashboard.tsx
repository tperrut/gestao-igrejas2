import { useState, useEffect } from 'react';
import { useTenantService } from '@/services/tenantService';
import { Tenant } from '@/types/tenantTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { fetchAllTenants } = useTenantService();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    const data = await fetchAllTenants();
    setTenants(data);
    setLoading(false);
  };

  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const inactiveTenants = tenants.filter(t => t.status === 'inactive').length;
  const suspendedTenants = tenants.filter(t => t.status === 'suspended').length;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-muted-foreground">Gerenciamento da plataforma BetelHub</p>
          </div>
          <Button onClick={() => navigate('/owner/tenants/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Tenant
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tenants</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenants.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTenants}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inativos</CardTitle>
              <BarChart3 className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inactiveTenants}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspensos</CardTitle>
              <BarChart3 className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suspendedTenants}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tenants List */}
        <Card>
          <CardHeader>
            <CardTitle>Tenants Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : tenants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum tenant cadastrado
              </div>
            ) : (
              <div className="space-y-4">
                {tenants.slice(0, 5).map((tenant) => (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => navigate(`/owner/tenants/${tenant.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <Building2 className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">{tenant.name}</h3>
                        <p className="text-sm text-muted-foreground">{tenant.subdomain}.betelhub.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        tenant.status === 'active' ? 'bg-green-100 text-green-800' :
                        tenant.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tenant.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {tenant.plan_type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tenants.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => navigate('/owner/tenants')}>
                  Ver todos os tenants
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OwnerDashboard;

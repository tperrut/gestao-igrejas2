import { useState, useEffect } from 'react';
import { useTenantService } from '@/services/tenantService';
import { Tenant } from '@/types/tenantTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const TenantManagement = () => {
  const navigate = useNavigate();
  const { fetchAllTenants, deleteTenant } = useTenantService();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTenants();
  }, []);

  useEffect(() => {
    const filtered = tenants.filter(tenant =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTenants(filtered);
  }, [searchTerm, tenants]);

  const loadTenants = async () => {
    setLoading(true);
    const data = await fetchAllTenants();
    setTenants(data);
    setFilteredTenants(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este tenant?')) {
      const success = await deleteTenant(id);
      if (success) {
        loadTenants();
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Tenants</h1>
            <p className="text-muted-foreground">Gerencie todos os tenants da plataforma</p>
          </div>
          <Button onClick={() => navigate('/owner/tenants/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Tenant
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou subdomínio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : filteredTenants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum tenant encontrado
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Subdomínio</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          {tenant.name}
                        </div>
                      </TableCell>
                      <TableCell>{tenant.subdomain}.betelhub.com</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {tenant.plan_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tenant.status === 'active' ? 'bg-green-100 text-green-800' :
                          tenant.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tenant.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/owner/tenants/${tenant.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(tenant.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TenantManagement;

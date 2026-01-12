export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: 'active' | 'inactive' | 'suspended';
  plan_type: 'basic' | 'premium' | 'enterprise';
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateTenantData {
  name: string;
  subdomain: string;
  plan_type?: 'basic' | 'premium' | 'enterprise';
}

export interface CreateTenantAdminData {
  tenant_id: string;
  email: string;
  password: string;
  name: string;
}

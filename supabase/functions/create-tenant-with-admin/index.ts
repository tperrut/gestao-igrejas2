import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TenantData {
  name: string;
  subdomain: string;
  plan_type: 'basic' | 'premium' | 'enterprise';
}

interface AdminData {
  name: string;
  email: string;
  password: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Criar cliente Supabase com service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verificar autenticação e se usuário é owner
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se usuário é owner
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'owner')
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: 'Acesso negado. Apenas owners podem criar tenants.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { tenant, admin }: { tenant: TenantData; admin: AdminData } = await req.json();

    // Validações
    if (!tenant.name || !tenant.subdomain) {
      return new Response(
        JSON.stringify({ error: 'Nome e subdomínio do tenant são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!admin.name || !admin.email || !admin.password) {
      return new Response(
        JSON.stringify({ error: 'Dados do administrador são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se subdomínio já existe
    const { data: existingTenant } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('subdomain', tenant.subdomain)
      .maybeSingle();

    if (existingTenant) {
      return new Response(
        JSON.stringify({ error: 'Subdomínio já está em uso' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Criar tenant
    const { data: newTenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert({
        name: tenant.name,
        subdomain: tenant.subdomain,
        plan_type: tenant.plan_type,
        status: 'active',
      })
      .select()
      .single();

    if (tenantError) throw tenantError;

    // 2. Criar usuário admin no auth
    const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: admin.email,
      password: admin.password,
      email_confirm: true,
      user_metadata: {
        name: admin.name,
      },
    });

    if (authError) {
      // Rollback: remover tenant se criação do usuário falhar
      await supabaseAdmin.from('tenants').delete().eq('id', newTenant.id);
      throw authError;
    }

    // 3. Criar profile para o admin
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email: admin.email,
        name: admin.name,
        tenant_id: newTenant.id,
      });

    if (profileError) {
      // Rollback
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      await supabaseAdmin.from('tenants').delete().eq('id', newTenant.id);
      throw profileError;
    }

    // 4. Adicionar role de admin ao usuário
    const { error: roleInsertError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        tenant_id: newTenant.id,
        role: 'admin',
      });

    if (roleInsertError) {
      // Rollback
      await supabaseAdmin.from('profiles').delete().eq('id', newUser.user.id);
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      await supabaseAdmin.from('tenants').delete().eq('id', newTenant.id);
      throw roleInsertError;
    }

    // 5. Adicionar na tabela tenant_users
    const { error: tenantUserError } = await supabaseAdmin
      .from('tenant_users')
      .insert({
        user_id: newUser.user.id,
        tenant_id: newTenant.id,
        role: 'admin',
        status: 'active',
      });

    if (tenantUserError) {
      // Rollback
      await supabaseAdmin.from('user_roles').delete().eq('user_id', newUser.user.id);
      await supabaseAdmin.from('profiles').delete().eq('id', newUser.user.id);
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      await supabaseAdmin.from('tenants').delete().eq('id', newTenant.id);
      throw tenantUserError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        tenant: newTenant,
        admin: {
          id: newUser.user.id,
          email: admin.email,
          name: admin.name,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating tenant:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro ao criar tenant' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

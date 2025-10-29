-- ============================================
-- Adiciona coluna logo_url à tabela tenants
-- ============================================
ALTER TABLE public.tenants
ADD COLUMN logo_url TEXT;

-- Comentário: 
-- A coluna logo_url armazena a URL do logotipo do tenant para uso em branding.
COMMENT ON COLUMN public.tenants.logo_url IS 'URL do logotipo do tenant para branding.';

-- ===========================================
-- VIEW PÚBLICA DE BRANDING DO TENANT
-- ===========================================

-- 1. Crie a view apenas com os campos públicos de branding
CREATE OR REPLACE VIEW public.tenant_branding AS
SELECT
  id,
  name,
  subdomain,
  logo_url
FROM public.tenants;

-- Comentário:
-- Esta view expõe apenas os campos que você deseja tornar públicos.
-- Adicione/remova colunas conforme necessário para o seu caso de uso.

COMMENT ON VIEW public.tenant_branding IS
'View pública para exibir apenas informações de branding dos tenants (ex: nome, subdomínio, logo).';

-- ===========================================
-- POLICY PÚBLICA PARA A VIEW
-- ===========================================

-- 2. Habilite RLS na view (por padrão já vem habilitado, mas garanta)
ALTER VIEW public.tenant_branding ENABLE ROW LEVEL SECURITY;

-- 3. Crie a policy permitindo SELECT público (anônimo)
CREATE POLICY "Public can view tenant branding"
  ON public.tenant_branding
  FOR SELECT
  USING (TRUE);

-- Comentário:
-- Esta policy permite que qualquer usuário (mesmo não autenticado) faça SELECT na view.
-- Não expõe dados sensíveis, pois a view só tem campos públicos.

-- ===========================================
-- USO NO FRONTEND (exemplo)
-- ===========================================
-- No seu código, busque apenas os dados da view:
-- supabase.from('tenant_branding').select('name, subdomain, logo_url').eq('subdomain', 'meu-tenant')
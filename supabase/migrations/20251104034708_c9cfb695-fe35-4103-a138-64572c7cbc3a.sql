-- Script para inserir o primeiro Owner
-- INSTRUÇÕES: Substitua 'seu-email@exemplo.com' pelo email do usuário que deve se tornar Owner

DO $$
DECLARE
  v_user_id uuid;
  v_tenant_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
  v_email text := 'tperrut@gmail.com'; -- SUBSTITUA PELO EMAIL DO OWNER
BEGIN
  -- Buscar o user_id baseado no email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  -- Verificar se o usuário existe
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário com email % não encontrado. Certifique-se de que o usuário já se cadastrou na plataforma.', v_email;
  END IF;

  -- Inserir ou atualizar na tabela user_roles com role 'owner'
  INSERT INTO public.user_roles (user_id, tenant_id, role)
  VALUES (v_user_id, v_tenant_id, 'owner'::app_role)
  ON CONFLICT (user_id, tenant_id) 
  DO UPDATE SET role = 'owner'::app_role;

  -- Atualizar ou inserir na tabela tenant_users
  INSERT INTO public.tenant_users (user_id, tenant_id, role, status)
  VALUES (v_user_id, v_tenant_id, 'owner', 'active')
  ON CONFLICT (user_id, tenant_id)
  DO UPDATE SET 
    role = 'owner',
    status = 'active';

  RAISE NOTICE 'Owner criado com sucesso! User ID: %, Email: %', v_user_id, v_email;
END $$;
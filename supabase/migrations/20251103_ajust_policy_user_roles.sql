CREATE POLICY "Default tenant admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.tenant_users tu
      WHERE tu.user_id = auth.uid()
        AND tu.tenant_id = '00000000-0000-0000-0000-000000000001'::uuid
        AND tu.status = 'active'
        AND tu.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.tenant_users tu
      WHERE tu.user_id = auth.uid()
        AND tu.tenant_id = '00000000-0000-0000-0000-000000000001'::uuid
        AND tu.status = 'active'
        AND tu.role = 'admin'
    )
  );
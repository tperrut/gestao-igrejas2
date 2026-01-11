# CI/CD & Infra — Guia de Configuração (staging.betelhub.com)

Este documento explica passo-a-passo como configurar CI/CD (GitHub Actions) e a infraestrutura mínima (Cloudflare + Terraform) para o ambiente de homologação em `staging.betelhub.com`.

Sumário
- Requisitos e pré-condições
- Secrets e variáveis a configurar no GitHub
- Terraform (infra/cloudflare) — como aplicar
- GitHub Actions workflows — detalhes e triggers
- Migrations e seed (Supabase)
- Deploy previews (PRs)
- Health checks, monitoramento e rollback
- Checklist final

## Requisitos e pré-condições
- Conta Cloudflare com acesso à zona `staging.betelhub.com`.
- Projeto Cloudflare Pages (ou outra solução de hosting) para servir o frontend.
- Projeto Supabase para staging (recomendado: projeto separado do prod).
- Acesso ao repositório GitHub com permissão para criar Secrets e GitHub Actions.
- Terraform (opcional) para gerenciar DNS/records.

## Secrets / Variáveis (GitHub repository)
Adicione estes Secrets no repositório (Settings → Secrets → Actions). Use nomes idênticos para os workflows já criados.

Recomendado (staging):
- `CF_API_TOKEN` — Cloudflare API token (permissions: Zone:Read, DNS:Edit, Pages:Edit/Deploy if needed)
- `CF_ACCOUNT_ID` — Cloudflare Account ID
- `CF_PAGES_PROJECT_NAME_STAGING` — Nome do Pages project usado no action (ex.: gestao-igrejas-frontend-staging)
- `SUPABASE_URL_STAGING` — URL do Supabase (ex.: https://<your>.supabase.co)
- `SUPABASE_SERVICE_ROLE_KEY_STAGING` — service_role key para rodar migrações/seed (mantenha em segredo)
- (Opcional) `SUPABASE_DB_HOST_STAGING`, `SUPABASE_DB_USER_STAGING`, `SUPABASE_DB_PASS_STAGING` — se preferir aplicar migrations com `psql`
- `VITE_SUPABASE_URL_STAGING`, `VITE_SUPABASE_ANON_KEY_STAGING` — se preferir injetar envs client-side para o Pages (ou configure no Pages UI)

Observação: Para produção, crie equivalents com sufixo `_PROD` e proteja workflows de migração com GitHub Environments / aprovação manual.

## Terraform — como aplicar (infra/cloudflare)
O repositório já contém um esqueleto em `infra/cloudflare`.

1. Instale o Terraform (v1.3+ recomendado).
2. Crie um arquivo `terraform.tfvars` ou exporte variáveis de ambiente com os valores abaixo. Exemplo `terraform.tfvars`:

```hcl
cloudflare_api_token = "<CF_API_TOKEN>"
cloudflare_account_id = "<CF_ACCOUNT_ID>"
zone_name = "staging.betelhub.com"
pages_cname_target = "<PAGES_ORIGIN_CNAME_TARGET>"
```

3. Inicialize e aplique (PowerShell):

```powershell
cd infra/cloudflare
terraform init
terraform plan -out plan.tfplan
terraform apply plan.tfplan
```

Dicas:
- `pages_cname_target`: ao criar o Pages project no Cloudflare UI, o Pages informa qual CNAME apontar; use esse valor.
- Se preferir, crie o Pages project manualmente no UI e use Terraform apenas para o wildcard DNS record.

## GitHub Actions — workflows criados
Foram adicionados 3 workflows em `.github/workflows/`:

1. `ci.yml` — roda em `push` para `main` e `staging` e em `pull_request`:
   - instala dependências, roda lint, testes e build.
   - carrega artefato de build.

2. `deploy-staging.yml` — gatilho: `push` para `staging` branch:
   - builda, (placeholder) aplica migrations no Supabase staging,
   - deploya para Cloudflare Pages via action `cloudflare/pages-action`.

3. `pr-preview.yml` — gatilho: `pull_request` para `main`:
   - builda e cria preview deploy (usa Pages previews) e posta comentário no PR com link (placeholder).

Ajustes recomendados:
- Confirme `directory` nas actions (`'./dist'` é o padrão assumido). Se Vite output for diferente (ex.: `.vite`), ajuste.
- Garanta que `CF_API_TOKEN` possua permissão `Pages:Edit` e `Pages:Deploy` (se você usar Pages action).

## Migrations e seed (Supabase)
O repositório inclui `supabase/migrations` e uma função `functions/create-tenant-with-admin`.

Estratégia sugerida no pipeline:
- No `deploy-staging.yml`, antes do deploy, execute as migrations apontando para o DB do projeto staging.
- Preferência: usar `supabase` CLI (ex.: `supabase db push`) ou aplicar os arquivos `.sql` via `psql` com connection string do DB.

Exemplo (PowerShell) usando `psql` em Actions:

```powershell
# instalando psql (se necessário) e aplicando arquivos
# assume secrets: SUPABASE_DB_HOST_STAGING, SUPABASE_DB_USER_STAGING, SUPABASE_DB_PASS_STAGING
$env:PGPASSWORD = $env:SUPABASE_DB_PASS_STAGING
$PG_CONN = "postgresql://${env:SUPABASE_DB_USER_STAGING}@$env:SUPABASE_DB_HOST_STAGING:5432/postgres"
for ($f in Get-ChildItem -Path supabase\migrations -Filter *.sql | Sort-Object Name) {
  psql $PG_CONN -f $f
}
```

Ou com `supabase` CLI (exemplo genérico):

```bash
npm i -g supabase
supabase login --service-role $SUPABASE_SERVICE_ROLE_KEY_STAGING
# usar supabase db push / supabase migrations apply conforme sua setup
```

Seed (criar tenants de homologação):
- Após aplicar migrations, use a RPC `create_tenant_with_admin` ou chame a função HTTP (se publicada) para criar alguns tenants de teste.

Exemplo (curl):

```bash
curl -X POST "${SUPABASE_URL_STAGING}/rest/v1/rpc/create_tenant_with_admin" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY_STAGING}" \
  -H "Content-Type: application/json" \
  -d '{"tenant_subdomain":"imwniteroi","tenant_name":"Imw Niteroi","admin_email":"admin@staging","admin_password":"ChangeMe123"}'
```

> Importante: não use credenciais de produção para staging. Mantenha dados de staging isolados.

## Deploy previews (PRs)
- Cloudflare Pages tem integração para Preview deployments automaticamente. A action `pr-preview.yml` foi criada para reforçar e notificar o PR.
- Alternativamente, configure um job que faz deploy para um `preview-<pr-number>.staging.betelhub.com` (requer criar subdomínio dinâmico ou rota via Worker). Se preferir essa rota, considere adicionar um Worker para roteamento wildcard.

## Health checks, monitoramento e rollback
- Health check: criar um endpoint leve (ou usar `tenant_branding` query) que verifique se o serviço está funcional.
- Configure UptimeRobot / Cloudflare Health Checks que monitoram `/health` ou a query `tenant_branding` pública.
- Rollback: Cloudflare Pages fornece rollback para deployment anterior via UI/API. Para DB, evite migrações destrutivas sem revisão — use feature flags ou migrations reversíveis.

## Permissões e segurança
- Token do Cloudflare (`CF_API_TOKEN`) deve ser limitado apenas aos permissions necessárias.
- Proteja o workflow que executa migrações em `production` com GitHub Environments e approvals manuais.
- Não armazene `service_role` key em secrets acessíveis para PRs sem revisão.

## Checklist final antes de rodar
1. Criar Cloudflare Pages project (staging) ou ter `pages_cname_target`.
2. Preencher GitHub secrets listados acima.
3. (Opcional) Rodar `terraform apply` em `infra/cloudflare` para criar wildcard DNS.
4. Commit e push na branch `staging` para acionar `deploy-staging.yml`.
5. Verificar logs do workflow e do Pages deployment.
6. Validar acessos: `https://staging.betelhub.com` e `https://<tenant>.staging.betelhub.com`.

## Exemplos de comandos locais (Windows PowerShell)
```powershell
# rodar dev server
npm install
npm run dev

# build local
npm run build

# testar com tenant via query param
Start-Process "http://localhost:5173/auth?tenant=imwniteroi"

# rodar terraform (exemplo)
cd infra/cloudflare
terraform init
terraform plan -out plan.tfplan
terraform apply plan.tfplan
```

## Próximos passos que eu posso automatizar para você
- Gerar um job de migrations que aplica as SQLs em ordem com rollback seguro.
- Criar Terraform para Cloudflare Worker que implementa wildcard routing para `*.staging.betelhub.com`.
- Ajustar `deploy-staging.yml` para chamar o seed RPC `create_tenant_with_admin` automaticamente após deploy.

---

Se quiser, eu já gero também o arquivo `docs/LOCAL-DEV.md` com prints/screenshots e comandos menores para desenvolvedores. Deseja que eu crie esse arquivo agora?
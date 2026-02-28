  # Gestão Igrejas — README & HOWTO

  Este repositório contém a aplicação frontend da plataforma de gestão multi-tenant (subdomínios por tenant). Este documento mostra o panorama do projeto, módulos principais e instruções práticas para rodar e testar localmente (incluindo subdomínios).

  ## Visão geral

  - Stack: Vite + React + TypeScript + TailwindCSS + shadcn-ui.
  - Arquitetura: multi-tenant por subdomínio. Informações de branding públicas (nome, logo, subdomain) vêm da view `tenant_branding` no Supabase.
  - Auth: integrado com Supabase Auth; checagens adicionais garantem que o usuário pertença ao tenant.

  ## Estrutura principal do código

  - `src/pages` — páginas da aplicação (p.ex. `Auth.tsx`, `Index.tsx`, `Dashboard.tsx`).
  - `src/components` — componentes UI e layouts reutilizáveis.
  - `src/contexts` — contextos React (AuthContext, TenantContext).
  - `src/utils/subdomain.ts` — utilitários de detecção de subdomínio, validação e fetch de branding (cache + categorização de erros).
  - `src/integrations/supabase` — cliente Supabase e tipos gerados.
  - `supabase/migrations` — migrations e views (inclui `tenant_branding` e políticas RLS públicas para branding).

  ## Alterações recentes importantes

  Implementei melhorias para robustez no fluxo de identificação do tenant:

  - `src/utils/subdomain.ts`
    - `detectSubdomain()`: remove fallback hardcoded e permite `VITE_DEFAULT_TENANT` para dev.
    - `validateTenantExists()` agora filtra por `subdomain` e consulta a view pública `tenant_branding`.
    - `fetchTenantBranding()` (novo): busca branding do Supabase com cache em `localStorage` (TTL 5 min) e retorna status categorizado: `ok`, `not_found` ou `error`.

  - `src/pages/Auth.tsx`
    - Usa `fetchTenantBranding()` e exibe mensagens diferentes para "tenant não encontrado" vs "erro de conexão".
    - Botão "Tentar novamente" para re-tentativa manual quando houver erro de conexão.

  Essas mudanças melhoram a experiência quando o Supabase estiver temporariamente indisponível e facilitam testes locais.

  ## Variáveis de ambiente (essenciais)

  Crie um arquivo `.env` na raiz com pelo menos as variáveis abaixo (Vite exige o prefixo `VITE_` para expor ao client):

  ```env
  VITE_SUPABASE_URL=https://seu-projeto.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ... (sua chave pública)
  VITE_MAIN_DOMAIN=betelhub
  VITE_DEFAULT_TENANT=imwniteroi # opcional, apenas para dev local
  ```

  Observações:
  - A chave `VITE_SUPABASE_ANON_KEY` já está presente no projeto (arquivo gerado), mas em deploys/ambientes diferentes substitua pela sua.
  - `VITE_MAIN_DOMAIN` é usada para lógica de `detectSubdomain()` em produção (padrão neste projeto é `betelhub`).

  ## Rodando localmente (passo a passo)

  Pré-requisitos:
  - Node.js (versão recomendada >= 18) e npm/yarn.

  Instalação e dev server:

  ```powershell
  # 1. Instale dependências
  npm install

  # 2. Crie .env (copie/ajuste a partir do bloco acima)

  # 3. Inicie o servidor de desenvolvimento
  npm run dev
  ```

  Por padrão o Vite serve em `http://localhost:5173` (confirme no console do `npm run dev`).

  ### Testando tenants rapidamente (3 opções)

  1) Query param (mais simples — sem alterar hosts)

  - Acesse: `http://localhost:5173/auth?tenant=SEU_SLUG`
  - Recomendo usar esse método para debug imediato — o app lê `tenant` dos query params.

  2) Hosts file (testar subdomínio real localmente)

  - Edite (como Administrador) o arquivo `C:\Windows\System32\drivers\etc\hosts` e adicione:

    ```text
    127.0.0.1 imwniteroi.test
    127.0.0.1 outrotenant.test
    ```

  - Inicie o dev server permitindo host externos:

    ```powershell
    npm run dev -- --host
    ```

  - Acesse: `http://imwniteroi.test:5173` — a aplicação extrairá `imwniteroi` como subdomínio.

  3) Ngrok / LocalTunnel (quando precisa URL pública)

  - Ex.: `ngrok http 5173` → URL pública `https://xxxxx.ngrok.io`.
  - Útil para testar integrações que exigem URL pública (webhooks) ou para compartilhar com QA.

  ### Observações sobre hosts locais

  - Use domínios como `.test` ou `.local` para evitar conflitos com dominios reais e limitações do `.localhost`.
  - Alguns navegadores aplicam regras especiais para `.localhost`; usar `.test` geralmente evita problemas.

  ## Como o fluxo de tenant funciona (resumo técnico)

  1. A aplicação detecta um slug de tenant por (em ordem):
    - query param `tenant` (ex.: `/auth?tenant=meu-slug`)
    - subdomínio extraído de `window.location.hostname` (p.ex. `meu-slug.betelhub.com.br`)
    - em dev, `VITE_DEFAULT_TENANT` se definido

  2. O frontend chama `fetchTenantBranding(slug)` que:
    - tenta retornar cache local (localStorage) se não expirado
    - consulta `tenant_branding` no Supabase
    - retorna status `ok`, `not_found` ou `error`

  3. A UI (`Auth.tsx`) exibe branding quando `ok`; em `not_found` mostra "Tenant inválido"; em `error` mostra uma mensagem de conexão e botão de retry.

  4. No login, após autenticar, o frontend valida se o usuário pertence ao tenant (consulta `tenant_users`) e desloga o usuário se não pertencer.

  ## Troubleshooting (erros comuns)

  - "Tenant inválido ou inativo": normalmente o slug não existe em `tenant_branding`. Verifique no Supabase:

    ```sql
    SELECT * FROM tenant_branding WHERE subdomain = 'SEU_SLUG';
    ```

  - "Serviço temporariamente indisponível — estamos tentando reconectar": indica falha ao contactar Supabase (erro de rede, chave inválida ou instabilidade do serviço). Verifique:
    - Chaves em `.env` corretas.
    - Console do navegador (Network) para erros de CORS ou 5xx.
    - Status do Supabase (dashboard) e se o projeto está ativo.

  - Problemas ao testar subdomínio local:
    - Confirme que o dev server foi iniciado com `--host`.
    - Verifique se seu hosts file tem a entrada correta e que o navegador não está cacheando DNS.

  ## Recomendações operacionais

  - Monitoramento / alertas: configurar monitor de uptime (UptimeRobot, Pingdom, ou alertas do Supabase) para receber notificações quando o banco ficar inativo.
  - Backups automáticos: certifique-se que o Supabase tem backups regulares habilitados.
  - Cache de branding: o frontend já tem cache local curto (5 minutos). Para maior resiliência, considere um service worker ou CDN para assets de branding.

  ---

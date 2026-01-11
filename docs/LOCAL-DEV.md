# Local Development — Guia rápido

Este documento descreve passos práticos para desenvolvedores rodarem e testarem a aplicação localmente, incluindo como simular subdomínios (tenants), comandos úteis (PowerShell / bash) e instruções simples para capturar screenshots que ajudam no reporting de bugs.

> Observação: os exemplos usam Windows PowerShell como shell principal. Onde indicado, comandos equivalentes de bash também são mostrados.

## Pré-requisitos
- Node.js (recomendado >= 18) e npm.
- Git.
- Editor (VS Code recomendado).
- Para testar subdomínios locais: permissão para editar `hosts` (Admin) ou ngrok/localtunnel instalado.

## 1) Instalar dependências e rodar dev server

PowerShell:

```powershell
# instale dependências
npm install

# criar .env (copie/ajuste a partir do README)
# Exemplo .env local (opcional):
# VITE_SUPABASE_URL=https://<your>.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...
# VITE_DEFAULT_TENANT=imwniteroi

# rodar dev server (aceita hosts externos com --host)
npm run dev -- --host
```

Bash:

```bash
npm install
npm run dev -- --host
```

Por padrão o Vite vai expor a URL no console (ex.: `Local: http://localhost:5173`).

## 2) Testes rápidos sem alterar hosts — query param

A forma mais simples de testar um tenant localmente é usando query param `tenant`:

- Abra no navegador:
  - http://localhost:5173/auth?tenant=imwniteroi

Isto força a aplicação a usar o slug `imwniteroi` para buscar branding e permitir testes.

## 3) Testando subdomínio local (hosts file)

Se quiser testar com um subdomínio mais real (ex.: `imwniteroi.staging.betelhub.com` ou `imwniteroi.test`), adicione entradas no `hosts`.

Windows (abra o editor como Administrador e edite `C:\Windows\System32\drivers\etc\hosts`):

```
127.0.0.1 imwniteroi.test
127.0.0.1 outrotenant.test
```

Linux/macOS (edite `/etc/hosts`):

```bash
sudo -- sh -c 'echo "127.0.0.1 imwniteroi.test" >> /etc/hosts'
```

Depois, rode o dev server com `--host`:

```powershell
npm run dev -- --host
```

Acesse no navegador: `http://imwniteroi.test:5173` — o app deve extrair `imwniteroi` como subdomínio.

### Observações
- Use `.test` ou `.local` para evitar conflitos com domínios reais.
- Alguns browsers aplicam regras especiais ao `.localhost`; `.test` costuma ser mais previsível.

## 4) Usando ngrok (URL pública para testes / shared QA)

Se preferir uma URL pública (útil para QA remoto ou webhooks):

```bash
# ngrok deve estar instalado
ngrok http 5173
```

O ngrok fornecerá uma URL pública (ex.: `https://abcd-5173.ngrok.io`).

Para testes de tenant, use `https://abcd-5173.ngrok.io/auth?tenant=imwniteroi`.

## 5) Build e testes locais

```powershell
# build de produção local
npm run build

# rodar testes (se houver)
npm test

# lint
npm run lint
```

## 6) Debugging — o que inspecionar quando algo falha

1. Console do navegador (F12)
   - Aba Network: observe a chamada para `tenant_branding` (ou para o endpoint do Supabase). Verifique status, body e erros.
   - Aba Console: mensagens de erro (cuidado com CORS e chaves incorretas).

2. LocalStorage
   - A aplicação usa cache com key `tenant_branding_{slug}`. No DevTools -> Application -> Local Storage procure por essa chave.

3. Verifique Variáveis de ambiente / .env
   - `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` precisam ser válidas para consultas ao Supabase.

4. Logs do terminal (Vite)
   - Veja se o dev server exibiu erro ao iniciar ou se a build falhou.

## 7) Como capturar screenshots úteis (passo-a-passo)

1. Screenshot da página de erro
   - Abra a tela onde o bug ocorre (ex.: `/auth`).
   - Faça a captura da janela do navegador (Windows: `Win+Shift+S` para recorte, ou `PrtSc` para a tela inteira).
   - Salve como `screenshot-auth-page.png`.

2. Screenshot do DevTools — Network (mostrando a request do `tenant_branding`)
   - Abra DevTools (F12) → aba Network.
   - Recarregue a página (F5) para reproduzir a requisição.
   - Clique na requisição `tenant_branding` e capture a seção `Response` e `Headers`.
   - Salve como `screenshot-network-tenant-branding.png`.

3. Screenshot do LocalStorage
   - DevTools → Application → Local Storage → capture a chave `tenant_branding_{slug}`.
   - Salve como `screenshot-localstorage.png`.

4. Screenshot do hosts file (se aplicável)
   - Abra o arquivo `C:\Windows\System32\drivers\etc\hosts` no notepad (com Admin).
   - Capture as linhas adicionadas e salve como `screenshot-hosts.png`.

5. Screenshot do terminal com o comando `npm run dev` e a URL exibida
   - No PowerShell, selecione a área e salve como `screenshot-terminal-dev.png`.

Ao abrir um issue, anexe essas imagens e inclua:
- Passos para reproduzir
- URL/tenant usado
- Resultado esperado vs obtido
- Mensagens do console e do network

## 8) Testes rápidos de Supabase / health

- Teste direto via fetch no console do navegador:

```js
fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/tenant_branding?subdomain=imwniteroi`, {
  headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY }
}).then(r => r.json()).then(console.log).catch(console.error)
```

- Se a chamada falhar com 5xx ou erro de rede, verifique status do projeto Supabase.

## 9) Comandos úteis (resumo rápido)

PowerShell

```powershell
# dev
npm install
npm run dev -- --host

# build
npm run build

# run specific script (lint/test)
npm run lint
npm test

# open browser to debug
Start-Process "http://localhost:5173/auth?tenant=imwniteroi"
```

Bash

```bash
npm install
npm run dev -- --host
npm run build
```

## 10) Dicas finais e boas práticas
- Use `?tenant=` para testes rápidos em PRs (sem mexer no hosts).
- Se for editar `hosts`, remova entradas antigas quando finalizar testes.
- Nunca compartilhe `service_role` ou chaves sensíveis publicamente; use secrets no CI.
- Para testes de integração/CI, use um projeto Supabase isolado para staging com dados fake/seed.

---

Se quiser, eu posso também:
- Gerar imagens de exemplo (mock) já incluídas no repo `docs/examples/` para que o time use como referência;
- Criar um script PowerShell `scripts/dev-open.ps1` que executa `npm run dev` e abre automaticamente `http://localhost:5173/auth?tenant=VITE_DEFAULT_TENANT`.

Qual dessas duas automações prefere que eu adicione? (1: gerar imagens de exemplo, 2: criar script PowerShell, 3: ambos, 4: nenhum)
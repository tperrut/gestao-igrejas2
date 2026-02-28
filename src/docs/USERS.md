# Gestão de Usuários e Perfis

## Tipos de Cadastro de Usuário

Existem dois fluxos principais para cadastro de usuários no sistema:

### 1. Cadastro via Painel Administrativo

- **Quem pode cadastrar:** Apenas usuários com perfil **owner** ou **admin**.
- **Como funciona:**
  - O admin/owner preenche um formulário com nome, email, senha, tenant e perfil (role).
  - O sistema executa uma função serverless (`create-user`) que:
    1. Valida se o usuário autenticado tem permissão (owner/admin).
    2. Valida os dados (campos obrigatórios, senha mínima, tenant existente).
    3. Cria o usuário no Auth do Supabase.
    4. Cria o perfil na tabela `profiles`.
    5. Atribui o papel na tabela `user_roles`.
    6. Adiciona o usuário à tabela `tenant_users` com status ativo.
    7. Se algum passo falhar, faz rollback das operações anteriores.

#### Perfis que podem ser criados via painel

- **owner** (apenas por outro owner)
- **admin** (por owner; admin só pode criar member)
- **member**

#### Regras

- Admins só podem criar usuários no seu próprio tenant.
- Admins não podem criar outros admins.
- Owners podem criar qualquer perfil em qualquer tenant.

---

### 2. Cadastro via Tela de Registro Público

- **Quem pode cadastrar:** Qualquer pessoa, normalmente para criar a primeira conta de um tenant ou para auto-registro em um tenant já existente (dependendo da lógica implementada).
- **Como funciona:**
  - O usuário preenche nome, email, senha e confirma a senha.
  - O sistema pode:
    - Criar um novo tenant e um admin para esse tenant (`create-tenant-with-admin`).
    - Ou criar apenas um novo usuário do tipo member em um tenant existente (dependendo da lógica de convite/autoregistro).

#### Perfis que podem ser criados via registro público

- **admin** (quando criando um novo tenant)
- **member** (quando se registrando em um tenant existente)

---

## Perfis/Papéis Possíveis

- **owner:** Dono do tenant, acesso total.
- **admin:** Administrador do tenant, pode gerenciar usuários (mas não criar outros admins).
- **member:** Usuário comum.

Outros papéis podem existir conforme a tabela `user_roles`, mas os principais no fluxo de cadastro são esses.

---

## Mecânica de Criação de Usuários e Perfis

1. **Validação de Permissão:** Verifica se quem está criando tem permissão suficiente (owner/admin).
2. **Validação de Dados:** Checa campos obrigatórios, força da senha, existência do tenant.
3. **Criação no Auth:** Cria o usuário no Supabase Auth.
4. **Criação do Perfil:** Insere dados na tabela `profiles`.
5. **Atribuição de Papel:** Insere na tabela `user_roles` o papel do usuário.
6. **Vinculação ao Tenant:** Insere na tabela `tenant_users` com status ativo.
7. **Rollback em caso de erro:** Se algum passo falhar, desfaz as operações anteriores para manter integridade.

---

## Exemplo de Fluxo de Criação (Painel Admin)

```typescript
// Chamada para função serverless
await supabase.functions.invoke('create-user', {
  body: {
    name: 'João',
    email: 'joao@email.com',
    password: 'senha123',
    tenant_id: 'tenant123',
    role: 'member', // ou 'admin'
  },
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

A função valida permissões, cria o usuário e faz rollback se necessário.

---

## Resumo

- **Cadastro administrativo:** owner/admin cadastram users via painel.
- **Cadastro público:** cria admin+tenant ou member em tenant existente.
- **Perfis principais:** owner, admin, member.
- **Mecânica:** validação → criação no auth → criação do perfil → atribuição de papel → vinculação ao tenant → rollback em erro.

---

Se precisar expandir para outros papéis ou fluxos, basta adicionar novas regras e exemplos conforme a necessidade do projeto.
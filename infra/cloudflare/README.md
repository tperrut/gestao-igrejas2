# Infra: Cloudflare (staging)

Este diretório contém um skeleton Terraform para criar um wildcard DNS record para `staging.betelhub.com`.

Antes de aplicar:

1. Instale o Terraform (>= 1.3).
2. Configure as variáveis (via CLI, env ou `terraform.tfvars`):

```hcl
cloudflare_api_token = "<token>"
cloudflare_account_id = "<account_id>"
zone_name = "staging.betelhub.com"
pages_cname_target = "<pages-or-origin-target>"
```

3. Inicialize e aplique:

```bash
terraform init
terraform plan -out plan.tfplan
terraform apply plan.tfplan
```

Notas:
- `pages_cname_target` deve ser definido conforme o destino do seu deploy (Cloudflare Pages ou worker origin).
- Se usar Cloudflare Pages, você pode preferir configurar o projeto Pages via UI e usar DNS CNAME apontando para o valor que o Pages informar.
- Ajuste permissões do `cloudflare_api_token` (DNS edit + Pages deploy se necessário).

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = ">= 3.0.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
  account_id = var.cloudflare_account_id
}

# Data source to locate zone (staging domain)
data "cloudflare_zones" "staging_zone" {
  filter = {
    name = var.zone_name
  }
}

# Create wildcard DNS record for tenant subdomains under the staging zone
resource "cloudflare_record" "wildcard_tenants" {
  zone_id = data.cloudflare_zones.staging_zone.zones[0].id
  name    = "*"
  type    = "CNAME"
  value   = var.pages_cname_target
  ttl     = 1
  proxied = true
}

# (Optional) Cloudflare Pages project resource placeholder
# Note: cloudflare provider may require specific setup for pages; you can manage Pages via API or UI
# resource "cloudflare_pages_project" "frontend_staging" {
#   account_id = var.cloudflare_account_id
#   name = var.pages_project_name
#   production_branch = "staging"
# }

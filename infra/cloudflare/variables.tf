variable "cloudflare_api_token" {
  type = string
  description = "Cloudflare API token with permissions to manage DNS and Pages"
}

variable "cloudflare_account_id" {
  type = string
}

variable "zone_name" {
  type = string
  description = "The DNS zone name to manage (e.g. staging.betelhub.com)"
}

variable "pages_cname_target" {
  type = string
  description = "The CNAME/A target for Cloudflare Pages or CDN (set by Cloudflare Pages or your origin)"
}

variable "pages_project_name" {
  type = string
  description = "Cloudflare Pages project name (optional)"
  default = ""
}

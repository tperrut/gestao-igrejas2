output "wildcard_record_id" {
  value = cloudflare_record.wildcard_tenants.id
  description = "ID of the created wildcard DNS record for tenants"
}

output "zone_id" {
  value = data.cloudflare_zones.staging_zone.zones[0].id
  description = "Cloudflare Zone ID for the staging domain"
}

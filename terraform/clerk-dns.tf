# Clerk Frontend API
resource "cloudflare_record" "clerk_frontend_api" {
  zone_id = var.cloudflare_zone_id
  name    = "clerk"
  content = "frontend-api.clerk.services"
  type    = "CNAME"
  ttl     = 1 # Auto
  proxied = false
}

# Clerk Account Portal
resource "cloudflare_record" "clerk_accounts" {
  zone_id = var.cloudflare_zone_id
  name    = "accounts"
  content = "accounts.clerk.services"
  type    = "CNAME"
  ttl     = 1 # Auto
  proxied = false
}

# Clerk Email - Mail
resource "cloudflare_record" "clerk_mail" {
  zone_id = var.cloudflare_zone_id
  name    = "clkmail"
  content = "mail.8ze546rl5h4s.clerk.services"
  type    = "CNAME"
  ttl     = 1 # Auto
  proxied = false
}

# Clerk Email - DKIM 1
resource "cloudflare_record" "clerk_dkim1" {
  zone_id = var.cloudflare_zone_id
  name    = "clk._domainkey"
  content = "dkim1.8ze546rl5h4s.clerk.services"
  type    = "CNAME"
  ttl     = 1 # Auto
  proxied = false
}

# Clerk Email - DKIM 2
resource "cloudflare_record" "clerk_dkim2" {
  zone_id = var.cloudflare_zone_id
  name    = "clk2._domainkey"
  content = "dkim2.8ze546rl5h4s.clerk.services"
  type    = "CNAME"
  ttl     = 1 # Auto
  proxied = false
}

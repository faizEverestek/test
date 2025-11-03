resource "aws_route53_record" "cloudfront_record" {
  zone_id = var.dns_zone_id
  name    = "portal"
  type    = "CNAME"
  ttl     = 5
  records = [local.cloudfront_domain_name_blue]
}

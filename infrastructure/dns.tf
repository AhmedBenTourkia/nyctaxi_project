resource "aws_route53_record" "site" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.subdomain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.main.domain_name
    zone_id                = aws_cloudfront_distribution.main.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "site_ipv6" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.subdomain
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.main.domain_name
    zone_id                = aws_cloudfront_distribution.main.hosted_zone_id
    evaluate_target_health = false
  }
}
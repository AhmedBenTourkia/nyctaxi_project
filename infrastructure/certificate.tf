# Look up the hosted zone that already exists for the domain.
data "aws_route53_zone" "main" {
    name = var.domain_name
}

# Request a free HTTPS certificate for the subdomain
resource "aws_acm_certificate" "main" {
    provider = aws.us_east_1
    domain_name =var.subdomain
    validation_method = "DNS"

    lifecycle {
        create_before_destroy = true
    }
}

# Create a DNS record to validate the certificate
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = data.aws_route53_zone.main.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

# Pause until AWS confirms the certificate is validated and ready.
resource "aws_acm_certificate_validation" "main" {
    provider = aws.us_east_1
    certificate_arn = aws_acm_certificate.main.arn
    validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
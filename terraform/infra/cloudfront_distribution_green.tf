locals {
  s3_origin_id = "${var.app_name}-${var.environment}-s3-origin"
}

#aws_cloudfront_origin_access_identity
resource "aws_cloudfront_origin_access_identity" "origin_access_identity_green" {
  comment = "${local.resource_name}-origin-access-identity-green"
}

#cloudfront_distribution
resource "aws_cloudfront_distribution" "s3_distribution_green" {

  enabled             = var.cloudfront_enabled
  default_root_object = var.default_root_object
  is_ipv6_enabled     = var.is_ipv6_enabled
  comment             = "green-${var.product_name}-${var.environment}-${var.aws_region}"
  wait_for_deployment = true

  origin {
    domain_name = aws_s3_bucket.bucket_green.bucket_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.origin_access_identity_green.id}"
    }
  }

  default_cache_behavior {
    allowed_methods  = var.allowed_methods
    cached_methods   = var.cached_methods
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = var.forwarded_values_query_string

      cookies {
        forward = "none"
      }
    }
    viewer_protocol_policy = var.viewer_protocol_policy
    min_ttl                = var.min_ttl
    default_ttl            = var.default_ttl
    max_ttl                = var.max_ttl
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = var.restriction_type
    }
  }

  custom_error_response {
    error_caching_min_ttl = var.error_caching_min_ttl
    error_code            = var.error_code
    response_code         = var.response_code
    response_page_path    = var.response_page_path
  }

  tags = merge(local.tags, {
    resource_name = "${local.resource_name}-green-distribution"
    service_name  = "aws_cloudfront_distribution"
  })

  viewer_certificate {
    cloudfront_default_certificate = true
  }
  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${self.id} --paths '/*'"
  }

}


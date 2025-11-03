locals {
  cloudfront_domain_name_blue = aws_cloudfront_distribution.s3_distribution_blue.domain_name
  acm_certificate_arn         = data.terraform_remote_state.infra.outputs.acm_certificate_arn
}

locals {
  tags = {
    environment  = var.environment
    product_name = var.product_name
  }
}

variable "aws_account_id" {
  description = "Account id of the aws account"
  type        = string
}

variable "aws_region" {
  description = "AWS account region"
  type        = string
}

variable "environment" {
  description = "The environment for the type of deployment (eg: dev, prd)"
  type        = string
}

variable "app_name" {
  default     = "jobs-miniapp"
  description = "Name of the app"
}

variable "infra_version" {
  default = "v1"
}

variable "product_name" {
  default = "jobs"
}

#cloudfront
variable "cloudfront_enabled" {
  type        = bool
  default     = true
  description = "Whether the distribution is enabled to accept end user requests for content."
}

variable "default_root_object" {
  type        = string
  default     = "index.html"
  description = "The object that you want CloudFront to return (for example, index.html) when an end user requests the root URL."
}

variable "is_ipv6_enabled" {
  type        = bool
  default     = true
  description = "Whether the IPv6 is enabled for the distribution."
}

variable "allowed_methods" {
  type        = list(string)
  default     = ["GET", "HEAD"]
  description = "Controls which HTTP methods CloudFront processes and forwards to your Amazon S3 bucket or your custom origin."
}

variable "cached_methods" {
  type        = list(string)
  default     = ["GET", "HEAD"]
  description = " Controls whether CloudFront caches the response to requests using the specified HTTP methods."
}

variable "forwarded_values_query_string" {
  type        = bool
  default     = true
  description = "Indicates whether you want CloudFront to forward query strings to the origin that is associated with this cache behavior."
}

variable "viewer_protocol_policy" {
  type        = string
  default     = "redirect-to-https"
  description = "Use this element to specify the protocol that users can use to access the files in the origin specified by TargetOriginId when a request matches the path pattern in PathPattern. One of allow-all, https-only, or redirect-to-https."
}


variable "min_ttl" {
  type        = number
  default     = 0
  description = " The minimum amount of time that you want objects to stay in CloudFront caches before CloudFront queries your origin to see whether the object has been updated. Defaults to 0 seconds."
}

variable "default_ttl" {
  type        = number
  default     = 0
  description = " The default amount of time (in seconds) that an object is in a CloudFront cache before CloudFront forwards another request in the absence of an Cache-Control max-age or Expires header. Defaults to 1 day."
}

variable "max_ttl" {
  type        = number
  default     = 0
  description = "The maximum amount of time (in seconds) that an object is in a CloudFront cache before CloudFront forwards another request to your origin to determine whether the object has been updated. Only effective in the presence of Cache-Control max-age, Cache-Control s-maxage, and Expires headers. Defaults to 365 days."
}

variable "restriction_type" {
  type        = string
  default     = "none"
  description = "The method that you want to use to restrict distribution of your content by country: none, whitelist, or blacklist."
}


variable "error_caching_min_ttl" {
  type        = number
  default     = 300
  description = "The minimum amount of time you want HTTP error codes to stay in CloudFront caches before CloudFront queries your origin to see whether the object has been updated."
}

variable "error_code" {
  type        = number
  default     = 404
  description = "The 4xx or 5xx HTTP status code that you want to customize."
}

variable "response_code" {
  type        = string
  default     = "200"
  description = "The HTTP status code that you want CloudFront to return with the custom error page to the viewer."
}

variable "response_page_path" {
  type        = string
  default     = "/index.html"
  description = "The path of the custom error page (for example, /custom_404.html)."
}

variable "aws_cloudfront_distribution_aliases" {
  type        = list(string)
  description = " Extra CNAMEs (alternate domain names), if any, for this distribution."
}

variable "ssl_support_method" {
  type        = string
  default     = "sni-only"
  description = " Specifies how you want CloudFront to serve HTTPS requests. One of vip or sni-only. Required if you specify acm_certificate_arn or iam_certificate_id. NOTE: vip causes CloudFront to use a dedicated IP address and may incur extra charges."
}

variable "protocol_version" {
  type        = string
  description = "TLS versions for encryption"
}

variable "dns_zone_id" {}

variable "centralized_logging_bucket" {
  description = "Used bucket ARN"
  type        = string
  default     = null
}

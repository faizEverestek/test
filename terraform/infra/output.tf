output "cloudfront_domain_name_green" {
  value       = aws_cloudfront_distribution.s3_distribution_green.domain_name
  description = "This output will give the domain name for green cloudfront distribution"
}

output "cloudfront_domain_name_blue" {
  value       = aws_cloudfront_distribution.s3_distribution_blue.domain_name
  description = "This output will give the domain name for blue deployment"
}

output "s3_bucket_id_green" {
  value       = aws_s3_bucket.bucket_green.id
  description = "This output will give the bucket id for green deployment"
}

output "s3_bucket_id_blue" {
  value       = aws_s3_bucket.bucket_blue.id
  description = "This output will give the bucket id used for blue deployment"

}

output "cloudfront_id_green" {
  value       = aws_cloudfront_distribution.s3_distribution_green.id
  description = "This output will give the id of cloudfront distribution"
}

output "cloudfront_id_blue" {
  value       = aws_cloudfront_distribution.s3_distribution_blue.id
  description = "This output will give the id of cloudfront distribution"
}

output "s3_bucket_name_green" {
  value       = "${local.resource_name}-green"
  description = "This output will give the name of green s3 bucket name"
}

output "s3_bucket_name_blue" {
  value       = "${local.resource_name}-blue"
  description = "This output will give the name of blue s3 bucket name"
}
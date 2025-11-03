locals {
  s3_bucket_name_green = data.terraform_remote_state.portal_infra.outputs.s3_bucket_name_green
  cloudfront_id        = data.terraform_remote_state.portal_infra.outputs.cloudfront_id_green
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

variable "product_name" {
  default = "agilery"
}

variable "enable_service" {
  default = true
}

locals {
  cloudfront_name = data.terraform_remote_state.portal_infra.outputs.cloudfront_domain_name_green
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
  description = "Name of the app"
}

variable "product_name" {
  description = "application name"
  type        = string
}

variable "app_version" {
}


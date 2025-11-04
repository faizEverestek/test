data "terraform_remote_state" "infra" {
  backend   = "s3"
  workspace = "default"
  config = {
    bucket       = "${var.product_name}-terraform-bucket-${var.environment}-${var.aws_region}-${var.aws_account_id}"
    key          = "terraform_${var.environment}.tfstate"
    region       = var.aws_region
    use_lockfile = true
  }
}

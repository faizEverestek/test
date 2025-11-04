resource "null_resource" "green" {
  count = var.enable_service ? 1 : 0

  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "aws s3 sync ../../dist  s3://${local.s3_bucket_name_green} --exclude 'dev_terraform.zip' --acl bucket-owner-full-control"
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${local.cloudfront_id} --paths '/*'"
  }

}

resource "null_resource" "green_to_destroy" {
  count = var.enable_service ? 0 : 1
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "aws s3 rm s3://${local.s3_bucket_name_green} --recursive"

  }

}

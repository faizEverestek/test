resource "null_resource" "blue" {

  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "aws s3 sync s3://${local.s3_bucket_name_green}  s3://${local.s3_bucket_name_blue} --acl bucket-owner-full-control"
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${local.cloudfront_id} --paths '/*'"
  }
}


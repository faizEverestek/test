resource "null_resource" "sanity_check" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    environment = {
      CLOUDFRONT_NAME = local.cloudfront_name
      APP_NAME        = var.app_name
      APP_VERSION     = var.app_version
    }

    command = "echo 'FAILED' > sanity-result.txt && echo $(pwd) && ./sanity.sh && echo 'SUCCESS' > sanity-result.txt"
  }
}

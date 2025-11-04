
locals {
  resource_name = "${var.app_name}-${var.environment}-${var.infra_version}-${var.aws_region}"
}

#Creating s3 bucket
resource "aws_s3_bucket" "bucket_green" {
  bucket = "${local.resource_name}-green"

  #force_destroy is enabled to delete the contents of s3 bucket
  force_destroy = true

  tags = merge(local.tags, {
    resource_name = "${local.resource_name}-green"
    service_name  = "aws_s3_bucket"
  })
}

data "aws_canonical_user_id" "current_green" {}

resource "aws_s3_bucket_acl" "acl_green" {
  bucket = aws_s3_bucket.bucket_green.id

  access_control_policy {
    grant {
      grantee {
        id   = "a453399ec54f93ea3f8e3bbc45f93c1b4ce1d4a9e47b9ef0b380e140c09bdd85"
        type = "CanonicalUser"
      }
      permission = "FULL_CONTROL"
    }
    grant {
      grantee {
        id   = data.aws_canonical_user_id.current_green.id
        type = "CanonicalUser"
      }
      permission = "FULL_CONTROL"
    }
    owner {
      id = data.aws_canonical_user_id.current_green.id
    }
  }
}

resource "aws_s3_bucket_ownership_controls" "s3_bucket_ownership_controls_green" {
  bucket = aws_s3_bucket.bucket_green.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# this resource is set to block the public access
resource "aws_s3_bucket_public_access_block" "block_public_access" {
  bucket = aws_s3_bucket.bucket_green.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "s3_policy_green" {
  statement {
    actions   = ["s3:*"]
    resources = ["${aws_s3_bucket.bucket_green.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity_green.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "bucket_policy_green" {
  bucket = aws_s3_bucket.bucket_green.id
  policy = data.aws_iam_policy_document.s3_policy_green.json
}

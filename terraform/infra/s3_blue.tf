#Creating s3 bucket
resource "aws_s3_bucket" "bucket_blue" {
  bucket = "${local.resource_name}-blue"

  #force_destroy is enabled to delete the contents of s3 bucket
  force_destroy = true

  tags = merge(local.tags, {
    resource_name = "${local.resource_name}-blue"
    service_name  = "aws_s3_bucket"
  })
}

data "aws_canonical_user_id" "current_blue" {}

resource "aws_s3_bucket_acl" "acl_blue" {
  bucket = aws_s3_bucket.bucket_blue.id

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
        id   = data.aws_canonical_user_id.current_blue.id
        type = "CanonicalUser"
      }
      permission = "FULL_CONTROL"
    }
    owner {
      id = data.aws_canonical_user_id.current_blue.id
    }

  }
}

resource "aws_s3_bucket_ownership_controls" "s3_bucket_ownership_controls_blue" {
  bucket = aws_s3_bucket.bucket_blue.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "block_public_access_blue" {
  bucket = aws_s3_bucket.bucket_blue.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "s3_policy_blue" {

  #  Version = "2008-10-17"
  statement {
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity_blue.iam_arn]
    }
    actions   = ["s3:GetObject"]
    effect    = "Allow"
    resources = ["${aws_s3_bucket.bucket_blue.arn}/*"]
  }
  statement {
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity_blue.iam_arn]
    }
    actions   = ["s3:ListBucket"]
    effect    = "Allow"
    resources = [aws_s3_bucket.bucket_blue.arn]
  }
}

resource "aws_s3_bucket_policy" "bucket_policy_blue" {
  bucket = aws_s3_bucket.bucket_blue.id
  policy = data.aws_iam_policy_document.s3_policy_blue.json

  depends_on = [aws_cloudfront_origin_access_identity.origin_access_identity_blue]
}

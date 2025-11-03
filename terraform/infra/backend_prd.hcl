# bucket         = "agilery-terraform-bucket-prd-ap-south-1-<AWS_ACCOUNT_ID>" #Replace with AWS account ID
key            = "terraform_portal_infra_prd.tfstate"
region         = "ap-south-1"
dynamodb_table = "agilery-terraform-lock-table-prd"
encrypt        = true
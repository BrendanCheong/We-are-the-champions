# How to create variables for Terraform deployment
1. In this folder create a `terraform.tfvars` file. Note this file won't be committed as it contains secret values like database password and usernames
2. Example:
```tf
aws_region     = "ap-southeast-1"
app_name       = "we-are-the-champions"
domain_name    = "bcejgtap.com"
aws_account_id = "888888888888"

db_username = "ILoveGovTech"
db_password = "PleaseHireMe"
db_name     = "IamVeryHirable"
db_port     = "5432"
```
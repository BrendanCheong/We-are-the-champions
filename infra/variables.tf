variable "aws_region" {
  description = "AWS region to deploy resources"
}

variable "app_name" {
  description = "Application name"
}

variable "domain_name" {
  description = "Your domain name"
}

variable "aws_account_id" {
  description = "Your AWS account ID"
}

variable "db_username" {
  description = "Database username"
}

variable "db_password" {
  description = "Database password"
}

variable "db_name" {
  description = "Database name"
}

variable "db_port" {
  description = "Database port"
  default     = "5432"
}

variable "availability_zones" {
  type        = list(string)
  description = "List of availability zones"
  default     = ["ap-southeast-1a", "ap-southeast-1b"]
}

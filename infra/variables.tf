variable "aws_region" {
  default     = "ap-southeast-1"
  description = "AWS region to deploy resources"
}

variable "app_name" {
  default = "govtech-champions"
}

variable "db_username" {
  description = "govtech-password"
}

variable "db_password" {
  description = "encrypted-password"
  sensitive   = true
}

variable "domain_name" {
  description = "Your domain name"
}

variable "availability_zones" {
  type        = list(string)
  description = "List of availability zones"
  default     = ["ap-southeast-1a", "ap-southeast-1b"]
}

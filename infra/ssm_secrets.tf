resource "aws_ssm_parameter" "backend_database_url" {
  name        = "/${var.app_name}/DATABASE_URL"
  description = "Database URL for the backend"
  type        = "SecureString"
  value       = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.address}:${var.db_port}/${var.db_name}?schema=public"
}

resource "aws_ssm_parameter" "frontend_api_url" {
  name        = "/${var.app_name}/VITE_APP_API_URL"
  description = "API URL for the frontend to communicate with the backend"
  type        = "String"
  value       = "https://${var.domain_name}/api/v1"
}

resource "aws_ssm_parameter" "clerk_publishable_key" {
  name        = "/${var.app_name}/VITE_CLERK_PUBLISHABLE_KEY"
  description = "Clerk Publishable Key for the frontend"
  type        = "SecureString"
  value       = "pk_test_c3VtbWFyeS1sb2JzdGVyLTEuY2xlcmsuYWNjb3VudHMuZGV2JA"
}

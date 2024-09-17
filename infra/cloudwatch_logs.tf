resource "aws_cloudwatch_log_group" "backend_log_group" {
  name              = "/ecs/${var.app_name}/backend"
  retention_in_days = 30

  tags = {
    Name = "${var.app_name}-backend-log-group"
  }
}

resource "aws_cloudwatch_log_group" "frontend_log_group" {
  name              = "/ecs/${var.app_name}/frontend"
  retention_in_days = 30

  tags = {
    Name = "${var.app_name}-frontend-log-group"
  }
}

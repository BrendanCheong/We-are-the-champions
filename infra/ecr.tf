resource "aws_ecr_repository" "frontend" {
  name = "${var.app_name}-frontend"
}

resource "aws_ecr_repository" "backend" {
  name = "${var.app_name}-backend"
}

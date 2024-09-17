resource "aws_ecr_repository" "backend" {
  name = "${var.app_name}-backend"

  image_tag_mutability = "MUTABLE"
  tags = {
    Name = "${var.app_name}-backend-repo"
  }
}

resource "aws_ecr_repository" "frontend" {
  name = "${var.app_name}-frontend"

  image_tag_mutability = "MUTABLE"
  tags = {
    Name = "${var.app_name}-frontend-repo"
  }
}

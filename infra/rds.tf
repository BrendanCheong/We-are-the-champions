resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "${var.app_name}-rds-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "${var.app_name}-rds-subnet-group"
  }
}

resource "aws_db_instance" "postgres" {
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "13"
  instance_class         = "db.t3.micro"
  identifier             = "${var.app_name}-db"
  username               = var.db_username
  password               = var.db_password
  db_name                = var.db_name
  port                   = var.db_port
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot    = true

  tags = {
    Name = "${var.app_name}-db"
  }
}

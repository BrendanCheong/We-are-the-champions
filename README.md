# We are the Champions!

Submission for Govtech's 2025 TAP assignment.

This application is being hosted on AWS and can be accessed at:
https://bcejgtap.com

## Assumptions & Interpretation
1. Each team name is unique. "teamA" and "teama" are considered different team names.
2. Leaderboards show teams' rankings based on current match result inputs. At the start with no matches, all teams have a score of 0.
3. The application supports only 1 round of the competition, allowing 12 teams and 30 match results.
4. The "Clear all" function deletes all match results and team data.
5. AWS is used as the cloud provider.

Note: Due to time constraints, authentication was not implemented. All data is currently tied to a test user.

## Features
This application supports the following features:

1. Multi-line input for Team and Match Result data
2. Leaderboards with rankings based on current match results
3. Ability to edit matches
4. Option for users to clear all data
5. Logs for all data changes
6. Retrieval of data for a specific team

Bonus requirements met:
1. Deployed on AWS
2. Data persists across reboots
3. Invalid input handling (to the best of our ability)
4. Error hints for users (without correction suggestions)
5. Static code analysis (results in `eslint-report.json`)

## Tech Stack

- Backend: Express.js
- Frontend: Vite and React
- CI/CD: Terraform
- Deployment/Hosting: AWS
- Database: PostgreSQL

## Architecture Design

The infrastructure is managed using Terraform, with the following key components:

- VPC: Custom network setup for the application
- ECS: Container orchestration for the application
- ECR: Container registry for storing Docker images
- ALB: Application Load Balancer for distributing traffic
- RDS: Managed PostgreSQL database
- CloudWatch: For logging and monitoring
- IAM: For managing permissions and roles
- Route53: For DNS management
- Security Groups: For network security

Benefits of this architecture:

1. Scalability: ECS allows easy scaling of the application.
2. Security: Use of VPC, security groups, and IAM ensures a secure environment.
3. Reliability: ALB provides high availability and fault tolerance.
4. Managed Services: RDS and ECR reduce operational overhead.
5. Infrastructure as Code: Terraform allows version-controlled, reproducible infrastructure.
6. Cost-Effective: AWS services can be optimized for cost based on usage.

The AWS services I picked work well together for running a web app. ECS runs the app in containers, ECR stores these containers, and the Application Load Balancer directs traffic. RDS handles the database, while CloudWatch, IAM, and Security Groups take care of monitoring and security. Route53 manages the domain name.

I chose a monolithic structure because it's simpler for this project. The backend and frontend are in one codebase and use the same endpoint, which makes building and fixing the app easier. This setup works well with ECS and lets me grow the whole app at once if needed. It's faster to develop this way and easier to manage for a project this size.

## Running Locally
1. Run these commands to use local setup script
2. 
```sh
chmod +x ./local.sh && ./local.sh
```
This script will essentially use docker to:
- Create a postgres database with the credentials in `.env.local`
- Create the backend server
- Create the frontend server

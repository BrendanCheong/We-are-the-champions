# We-are-the-champions
GovTech TAP 2025 7 days Take home Assignment

# Tech Stack
## Frontend
- React.js
- TypeScript
- TailwindCSS

## Backend
- Express.js
- PrismaORM
- TypeScript
- PostgreSQL

## Running Locally
1. Run these commands to use local setup script
2. 
```sh
chmod +x ./local.sh
./local.sh
```
This script will essentially use docker to:
- Create a postgres database with the credentials in `.env.local`
- Create the backend server
- Create the frontend server
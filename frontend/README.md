# React + TypeScript + Vite

Run dev
```
docker build -f Dockerfile.dev -t vite-app-dev .
docker run -p 8080:8080 vite-app-dev
```
Run prod
```
docker build -f Dockerfile.prod -t vite-app-prod .
docker run -p 3000:3000 vite-app-prod
```
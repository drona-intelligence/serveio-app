## Serveio

This is restaurant management web app.


## Local Development with Docker

1. Copy [.env.example](.env.example) to `.env` and fill in `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
2. Start the API and database with:

```bash
docker compose up -d
```

3. The API will be available on `http://localhost:3000` and Postgres on `localhost:5432`.



 
Generate Prisma client:
 
```bash
npx prisma generate
```
 
Create a `.env` file based on the example .eg.env:
 

 ## 🚀 Run in Development Mode
 
Start the development server with:
 
```bash
npm run dev
```
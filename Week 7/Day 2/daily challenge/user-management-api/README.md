# User Management API

Express API with PostgreSQL storage and bcrypt password hashing. At startup it creates the `users` and `hashpwd` tables. Registration inserts the profile and its password hash in one database transaction.

## Run

Create a PostgreSQL database, then in PowerShell from this directory:

```powershell
npm install
$env:DATABASE_URL = "postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
npm start
```

The server listens on port `3000` by default. Set `$env:PORT` to change it.

## Endpoints

- `POST /register` with `username`, `password`, and optional `email`, `first_name`, `last_name`
- `POST /login` with `username` and `password`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id` with any profile fields and/or a new `password`

Password hashes are never included in API responses. Example requests:

```powershell
curl.exe -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"alex","password":"change-me","email":"alex@example.com","first_name":"Alex","last_name":"Lee"}'
curl.exe -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"alex","password":"change-me"}'
curl.exe http://localhost:3000/users
curl.exe http://localhost:3000/users/1
curl.exe -X PUT http://localhost:3000/users/1 -H "Content-Type: application/json" -d '{"first_name":"Alexandra"}'
```
# Todo API

PostgreSQL-backed Express API for managing todos. The app creates the `tasks` table automatically when it starts; the PostgreSQL database itself must already exist.

## Run

From this directory, set a connection string and start the server in PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
npm start
```

The API listens on port `3000` by default. Set `$env:PORT` to use another port.

## Endpoints

- `GET /api/todos` - list todos
- `GET /api/todos/:id` - get one todo
- `POST /api/todos` - create a todo with `title` and optional boolean `completed`
- `PUT /api/todos/:id` - replace a todo's `title` and `completed`
- `DELETE /api/todos/:id` - delete a todo

Example requests:

```powershell
curl.exe http://localhost:3000/api/todos
curl.exe -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"title":"Study Express"}'
curl.exe -X PUT http://localhost:3000/api/todos/1 -H "Content-Type: application/json" -d '{"title":"Study Express","completed":true}'
curl.exe -X DELETE http://localhost:3000/api/todos/1
```

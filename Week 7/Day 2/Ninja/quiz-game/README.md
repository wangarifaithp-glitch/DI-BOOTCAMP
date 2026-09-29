# Quickfire Quiz

Express quiz game with questions, options, and answer checking stored in PostgreSQL. On startup, the app creates the `questions`, `options`, and `questions_options` tables and inserts five starter questions if the question table is empty.

## Start

Create a PostgreSQL database, then run these commands in PowerShell from this directory:

```powershell
npm install
$env:DATABASE_URL = "postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
npm start
```

Open `http://localhost:5000`. Set `$env:PORT` to change the port.

The answer API expects an option ID for the current question. The correct answer is only returned in the feedback after submission.
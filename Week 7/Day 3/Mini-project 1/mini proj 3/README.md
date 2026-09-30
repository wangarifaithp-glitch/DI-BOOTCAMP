# Outpost strategy game

## Start

```sh
npm install
npm start
```

Open `http://localhost:3000`. Set `PORT` to use another port.

Create an account or sign in, create a game, then have a second player sign in from another browser/session and join it. Games are independent sessions; board state and active login tokens are held in memory and reset when the server stops. User accounts are stored in `users.json` with bcrypt-hashed passwords.

Players take turns moving one orthogonal tile. Obstacles block movement. Win by moving onto the opposing base or ending a turn adjacent to it and using Attack.

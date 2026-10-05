# React Exercises XP

One shared React app covering components and props, event handlers, state, forms, validation, timers, class component lifecycles, unmounting, and error boundaries.

## Run

```sh
npm install
npm start
```

Open the local URL printed by Vite. The lifecycle exercise changes the favorite color from red to yellow after mounting and logs update lifecycle calls to the console. Its **Delete** button unmounts the child and displays an alert.

The error-boundary exercise has three counter simulations. The first two are caught by error boundaries; the third intentionally throws an uncaught error and unmounts the app. Refresh the page after trying the third simulation.
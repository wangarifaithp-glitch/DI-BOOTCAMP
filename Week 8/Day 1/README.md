# Week 8 Day 1: React Exercises

This folder contains the travel form daily challenge and the React XP exercises for error boundaries, updating lifecycle methods, and unmounting.

## Run the React XP app

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The three error-boundary simulations demonstrate shared, isolated, and missing boundaries. The favorite color starts red, changes to yellow after mounting, and can be changed to blue. Check the browser console for lifecycle logs. The **Delete** button unmounts the child and displays an alert.

The intentionally unprotected counter in Simulation 3 crashes the app after five clicks; refresh the page to reset it.

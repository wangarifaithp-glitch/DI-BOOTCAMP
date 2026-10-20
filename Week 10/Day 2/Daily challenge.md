### Creating a Generic Data Fetching Component with React, TypeScript, and Redux

#### 👩‍🏫 👩🏿‍🏫 What You’ll learn

- **TypeScript Generics**: Using generics to create reusable and type-safe components.
- **React Hooks**: Utilizing `useEffect`, `useState`, and custom hooks to manage side effects and state.
- **Redux**: Integrating Redux for global state management, including actions, reducers, and the Redux store.
- **Data Fetching**: Handling asynchronous data fetching and updating the component state.
- **Error Handling**: Implementing error handling for data fetching operations.

---

#### Description:
In this daily challenge, you’ll create a generic data fetching component using **React, TypeScript, and Redux**. The component will be designed to fetch data from an API and display it. You’ll utilize TypeScript generics to ensure type safety for different types of data and integrate Redux to manage the global state of your application.

#### Project Overview:
You will create the following files:

- `api.ts`: Defines an API function for fetching data.
- `types.ts`: Contains TypeScript types and interfaces.
- `dataSlice.ts`: Redux slice for managing data state.
- `DataFetcher.tsx`: A generic React component for fetching and displaying data.
- `App.tsx`: Main application file to demonstrate the usage of `DataFetcher`.

---

### 1. Setting Up the Project

1. **Install Dependencies**:
Create a new React project with TypeScript and install Redux along with the necessary dependencies
2. **Folder Structure**:
Organize your project. Suggested structure:

```
- src/
  - api/
     - api.ts
  - features/
     - dataSlice.ts
  - components/
     - DataFetcher.tsx
  - types/
     - types.ts
  - App.tsx
```

---

### 2. Creating API Functions

#### 2.1. **Creating `api.ts`**

- In the `src/api/` folder, create an `api.ts` file.
- This file will define an API function to fetch data from [Recipe - Food - Nutrition](https://rapidapi.com/spoonacular/api/recipe-food-nutrition)

---

### 3. Defining Types

#### 3.1. **Creating `types.ts`**

- In the `src/types/` folder, create a `types.ts` file.
- Define TypeScript types and interfaces for the data

---

### 4. Setting Up Redux

#### 4.1. **Creating `dataSlice.ts`**

- In the `src/features/` folder, create a `dataSlice.ts` file.
- This file will define a Redux slice for managing data

---

### 5. Creating the Generic Data Fetching Component

#### 5.1. **Creating `DataFetcher.tsx`**

- In the `src/components/` folder, create a `DataFetcher.tsx` file.
- This file will define a generic React component for fetching and displaying data

---

### 6. Setting Up the Main Application

#### 6.1. **Creating `App.tsx`**

- In the `src/` folder, modify the `App.tsx` file to use the `DataFetcher` component

---

### 7. Optional Enhancements

1. **Styling**:
Add CSS to style the user list and loading/error messages.

### Building a Personal Book Library Application

---

#### A Step-by-Step Exercise with React, TypeScript, and Redux Toolkit

#### Overview
You’ll build a personal book library application that helps users manage their reading list. This exercise will teach you modern React development practices, TypeScript, and state management with Redux Toolkit.

#### Learning Objectives
By completing this exercise, you’ll learn:

- Setting up a React + TypeScript project
- Implementing Redux Toolkit for state management
- Creating and using custom React hooks
- Building reusable components
- Type safety with TypeScript
- Modern CSS techniques

### Exercise Steps

#### Part 1: Project Setup (15-20 minutes)

1. Create a new directory for your project
2. Initialize a new Vite project with TypeScript support
3. Install required dependencies
4. Create the basic project structure

**Tasks:**

```
# 1. Create project directory
mkdir book-library
cd book-library

# 2. Initialize Vite project
npm create vite@latest . -- --template react-ts

# 3. Install dependencies
npm install
npm install @reduxjs/toolkit react-redux

# 4. Start the development server to verify setup
npm run dev
```

#### Part 2: Define the Data Model (20-30 minutes)

1. Create the Book interface
2. Implement the BookItem class
3. Add serialization methods

**Tasks:**

1. Create `src/model` directory
2. Create `Book.ts` file
3. Define the Book interface with required properties
4. Implement the BookItem class with getters and serialization methods

#### Part 3: Set Up Redux Store (30-40 minutes)

1. Create the Redux store configuration
2. Define the books slice
3. Implement basic actions
4. Set up TypeScript types for the store

**Tasks:**

1. Create `src/app` directory
2. Set up store configuration
3. Create books slice with initial state
4. Implement core actions (add, remove, toggle read status)
5. Define filter and category functionality

#### Part 4: Create Custom Hooks (30-40 minutes)

1. Implement hooks for book operations
2. Create filter and category hooks
3. Add TypeScript types for hooks

**Tasks:**

1. Create hooks for:
2. Adding books
3. Removing books
4. Toggling read status
5. Setting filters
6. Managing categories
7. Add proper TypeScript types
8. Implement error handling

#### Part 5: Build Components (45-60 minutes)

1. Create the BookInput component
2. Build the BookList component
3. Implement the BookItem component
4. Add TypeScript props and event handling

**Tasks:**

1. Create components directory structure
2. Implement each component with proper typing
3. Add event handlers
4. Connect components to Redux store using hooks

#### Part 6: Style the Application (30-40 minutes)

1. Create CSS modules
2. Implement responsive design
3. Add transitions and animations

**Tasks:**

1. Create CSS files for components
2. Implement grid layout for book list
3. Style forms and buttons
4. Add responsive breakpoints

#### Part 7: Testing and Refinement (30-40 minutes)

1. Test all functionality
2. Add error handling
3. Implement loading states
4. Add form validation

**Tasks:**

1. Test adding, removing, and updating books
2. Verify filter functionality
3. Test responsive design
4. Validate form inputs
5. Add error messages

---

### Challenge Exercises
After completing the basic implementation, try these challenges:

**1. Search Implementation** (30 minutes)

- Add search functionality to filter books
- Implement debouncing for search input
- Add highlighting for search terms

**2. Sorting Features** (30 minutes)

- Add sort by title
- Add sort by author
- Add sort by date added
- Implement sort direction toggle

**3. Statistics Dashboard** (45 minutes)

- Show total books count
- Display read vs unread ratio
- Show books by category
- Add reading progress tracking

**4. Data Persistence** (30 minutes)

- Implement localStorage saving
- Add data export feature
- Add data import feature

**5. Categories Management** (45 minutes)

- Add category creation
- Implement category deletion
- Add category editing
- Show books count per category

# TypeScript Exercises

This project contains a series of exercises designed to help you learn and practice various TypeScript concepts. Each exercise is implemented in a separate TypeScript file located in the `src` directory. Below is a brief description of each exercise:

## Exercises

1. **Logging Messages** (`src/logging-messages.ts`)
   - A simple program that logs the message "Hello, World!" to the console.

2. **Type Annotations** (`src/type-annotations.ts`)
   - Demonstrates the use of type annotations by defining a variable `age` of type `number` and a variable `name` of type `string`, and logging them to the console.

3. **Union Types** (`src/union-types.ts`)
   - Shows how to declare a variable `id` that can hold either a string or a number using union types.

4. **Control Flow** (`src/control-flow.ts`)
   - Includes a function that takes a number as input and returns a string indicating whether the number is positive, negative, or zero, utilizing `if...else` statements.

5. **Tuple Types** (`src/tuple-types.ts`)
   - Defines a function `getDetails` that takes a name and age as input and returns a tuple containing the input values and a greeting message.

6. **Object Type Annotations** (`src/object-type-annotations.ts`)
   - Defines an object type annotation for a `Person` object with properties `name` (string) and `age` (number). It also includes a function `createPerson` that returns an object matching the `Person` structure.

7. **Type Assertions** (`src/type-assertions.ts`)
   - Demonstrates how to use type assertions to cast an HTML element retrieved from the DOM to a specific type, allowing access to its properties.

8. **Switch Statements** (`src/switch-statements.ts`)
   - Contains a function `getAction` that takes a user role as a string and returns an action for the user, using a `switch` statement to handle multiple roles.

9. **Function Overloading** (`src/function-overloading.ts`)
   - Implements an overloaded function `greet` that can either take a name and greet the person or take no arguments and return a default greeting.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies by running:
   ```
   npm install
   ```
4. Compile the TypeScript files by running:
   ```
   npx tsc
   ```
5. Run the exercises using Node.js or in your preferred environment.

## Contributing

Feel free to contribute to this project by adding more exercises or improving existing ones. Please submit a pull request with your changes.

## License

This project is open-source and available under the MIT License.
// Types
type User = {
  type: 'user';
  name: string;
  age: number;
};

type Product = {
  type: 'product';
  id: number;
  price: number;
};

type Order = {
  type: 'order';
  orderId: string;
  amount: number;
};

type DataItem = User | Product | Order;

// Type guards
function isUser(item: DataItem): item is User {
  return item.type === 'user';
}

function isProduct(item: DataItem): item is Product {
  return item.type === 'product';
}

function isOrder(item: DataItem): item is Order {
  return item.type === 'order';
}

// Main function
function handleData(items: DataItem[]): string[] {
  const results: string[] = [];

  for (const item of items) {
    if (isUser(item)) {
      results.push(`Hello, ${item.name}! You are ${item.age} years old.`);
    } else if (isProduct(item)) {
      results.push(`Product ID: ${item.id}, Price: $${item.price}`);
    } else if (isOrder(item)) {
      results.push(`Order ID: ${item.orderId}, Amount: $${item.amount}`);
    } else {
      // Handle unexpected cases gracefully
      results.push('Unknown data type encountered.');
    }
  }

  return results;
}

// Demo
const data: DataItem[] = [
  { type: 'user', name: 'Asha', age: 28 },
  { type: 'product', id: 101, price: 49.99 },
  { type: 'order', orderId: 'ORD-12345', amount: 199.5 },
  { type: 'user', name: 'Brian', age: 35 },
];

console.log('=== handleData Output ===');
const output = handleData(data);
output.forEach(line => console.log(line));
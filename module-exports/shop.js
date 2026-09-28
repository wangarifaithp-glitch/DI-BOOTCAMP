const products = require('./products');

function findProduct(productName) {
  return products.find(
    (product) => product.name.toLowerCase() === productName.toLowerCase()
  );
}

['Laptop', 'Coffee Mug', 'Notebook'].forEach((productName) => {
  console.log(findProduct(productName));
});

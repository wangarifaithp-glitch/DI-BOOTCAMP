import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addToCart,
  calculateTotalPrice,
  selectCartItems,
  selectProducts,
} from "./cart.js";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function ShoppingCart() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(calculateTotalPrice);

  const handleAddToCart = useCallback(
    (productId) => dispatch(addToCart(productId)),
    [dispatch],
  );

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">A few good things</p>
          <h1>The little shop</h1>
          <p className="intro">Find something useful, lovely, or both.</p>
        </div>
        <a className="cart-link" href="#your-cart" aria-label={`Your cart, ${cartItems.length} items`}>
          Your cart <span className="cart-badge">{cartItems.length}</span>
        </a>
      </header>

      <div className="shop-layout">
        <section className="products-section" aria-labelledby="products-title">
          <div className="section-heading">
            <h2 id="products-title">Shop the collection</h2>
            <span>{products.length} thoughtful finds</span>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className={`product-art product-art-${product.id}`} aria-hidden="true">
                  <span>{product.name}</span>
                </div>
                <div className="product-info">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                  <strong>{currency.format(product.price)}</strong>
                </div>
                <button
                  className="add-button"
                  type="button"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to cart
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside className="cart-panel" id="your-cart" aria-labelledby="cart-title">
          <div className="section-heading">
            <h2 id="cart-title">Your cart</h2>
            <span>{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</span>
          </div>

          {cartItems.length > 0 ? (
            <ul className="cart-list">
              {cartItems.map((item) => (
                <li className="cart-item" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      {currency.format(item.price)} <span aria-hidden="true">·</span> Qty {item.quantity}
                    </p>
                  </div>
                  <strong>{currency.format(item.price * item.quantity)}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-cart">Your cart is empty. Add a little something you love.</p>
          )}

          <div className="cart-total">
            <span>Total</span>
            <strong>{currency.format(totalPrice)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

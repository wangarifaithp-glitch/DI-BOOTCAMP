import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeFromCart, setQuantity } from '../features/cart/cartSlice.js';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function ShoppingCart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <aside className="cart-panel" aria-labelledby="cart-heading">
      <div className="cart-heading">
        <div>
          <p className="section-kicker">YOUR SELECTION</p>
          <h2 id="cart-heading">Shopping bag <span>({itemCount})</span></h2>
        </div>
        {items.length > 0 && (
          <button className="text-button" type="button" onClick={() => dispatch(clearCart())}>Clear</button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="cart-empty">Your bag is waiting for something good.</p>
      ) : (
        <>
          <ul className="cart-items">
            {items.map((item) => (
              <li className="cart-item" key={item.id}>
                <img src={item.image} alt="" />
                <div className="cart-item-info">
                  <h3>{item.title}</h3>
                  <span>{currency.format(item.price)}</span>
                  <div className="quantity-control" aria-label={`Quantity of ${item.title}`}>
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.title}`}
                      disabled={item.quantity <= 1}
                      onClick={() => dispatch(setQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                    >−</button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.title}`}
                      onClick={() => dispatch(setQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    >+</button>
                    <button
                      className="remove-item"
                      type="button"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >Remove</button>
                  </div>
                </div>
                <strong className="line-total">{currency.format(item.price * item.quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <strong>{currency.format(subtotal)}</strong>
          </div>
          <p className="shipping-note">Shipping and taxes calculated at checkout.</p>
          <button className="checkout-button" type="button" disabled={!items.length}>Continue to checkout</button>
        </>
      )}
    </aside>
  );
}

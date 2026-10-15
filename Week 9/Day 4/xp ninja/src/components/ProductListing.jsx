import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice.js';
import { fetchProducts } from '../features/products/productThunks.js';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const quantity = useSelector((state) => (
    state.cart.items.find((item) => item.id === product.id)?.quantity ?? 0
  ));

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img className="product-image" src={product.image} alt={product.title} loading="lazy" />
        {quantity > 0 && <span className="in-cart-badge">{quantity} in bag</span>}
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3>{product.title}</h3>
        <div className="product-buy-row">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="add-button"
            type="button"
            aria-label={`Add ${product.title} to bag`}
            onClick={() => dispatch(addToCart(product))}
          >
            Add <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductListing() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [dispatch, status]);

  if (status === 'loading' || status === 'idle') {
    return <p className="loading-state" aria-live="polite"><span className="spinner" />Finding your favorites…</p>;
  }

  if (status === 'failed') {
    return (
      <div className="error-state" role="alert">
        <p>{error}</p>
        <button className="outline-button" type="button" onClick={() => dispatch(fetchProducts())}>Try again</button>
      </div>
    );
  }

  if (items.length === 0) return <p className="loading-state">No products are available right now.</p>;

  return (
    <div className="product-grid">
      {items.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

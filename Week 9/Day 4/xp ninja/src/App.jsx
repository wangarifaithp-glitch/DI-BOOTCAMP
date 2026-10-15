import React from 'react';
import AuthForm from './components/AuthForm.jsx';
import ProductListing from './components/ProductListing.jsx';
import ShoppingCart from './components/ShoppingCart.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <div className="announcement">A considered collection for everyday living · Complimentary shipping over $75</div>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Atelier home">atelier<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#collection">Shop</a>
          <a href="#story">Our approach</a>
        </nav>
        <div className="header-actions">
          <AuthForm />
          <a className="bag-link" href="#shopping-bag">
            Bag <span aria-label="items in bag">●</span>
          </a>
        </div>
      </header>
      <main>
        <section className="hero" id="story">
          <div className="hero-copy">
            <p className="section-kicker">THE EVERYDAY EDIT</p>
            <h1>Good things,<br />made to be <em>kept.</em></h1>
            <p>Thoughtful pieces for the rituals that make a life. Made with care, chosen to last.</p>
            <a className="hero-link" href="#collection">Explore the collection <span aria-hidden="true">↘</span></a>
          </div>
          <div className="hero-art" aria-label="Abstract warm neutral shapes">
            <span className="art-shape art-shape-one" />
            <span className="art-shape art-shape-two" />
            <span className="art-shape art-shape-three" />
            <span className="art-caption">Objects for living<br />well, every day.</span>
          </div>
        </section>
        <section className="shop-layout" id="collection">
          <div className="collection-column">
            <div className="collection-heading">
              <div>
                <p className="section-kicker">CURATED FOR YOU</p>
                <h2>Small joys, daily.</h2>
              </div>
              <span className="collection-count">THE COLLECTION</span>
            </div>
            <ProductListing />
          </div>
          <div id="shopping-bag">
            <ShoppingCart />
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <a className="brand" href="#">atelier<span>.</span></a>
        <p>Buy less, choose well, make it last.</p>
        <span>Demo storefront · Mock checkout</span>
      </footer>
    </div>
  );
}

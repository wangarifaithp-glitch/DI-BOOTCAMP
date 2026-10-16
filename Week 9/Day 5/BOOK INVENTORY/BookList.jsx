import React, { useState } from "react";
import { useSelector } from "react-redux";

import {
  selectBooks,
  selectFantasyBooks,
  selectHorrorBooks,
  selectScienceFictionBooks,
} from "./books.js";

const genres = [
  { label: "All books", selector: selectBooks },
  { label: "Horror", selector: selectHorrorBooks },
  { label: "Fantasy", selector: selectFantasyBooks },
  { label: "Science Fiction", selector: selectScienceFictionBooks },
];

export default function BookList() {
  const [selectedGenre, setSelectedGenre] = useState("All books");
  const selectedBooks = useSelector(
    genres.find((genre) => genre.label === selectedGenre).selector,
  );

  return (
    <main className="page">
      <p className="eyebrow">A small collection for curious minds</p>
      <h1>Book inventory</h1>
      <p className="intro">
        Browse the shelves and find your next read. Choose a genre to filter
        the collection.
      </p>

      <section className="inventory" aria-labelledby="inventory-title">
        <div className="inventory-header">
          <h2 id="inventory-title">{selectedGenre}</h2>
          <span className="book-count" aria-live="polite">
            {selectedBooks.length} {selectedBooks.length === 1 ? "book" : "books"}
          </span>
        </div>

        <div className="genre-filters" aria-label="Filter books by genre">
          {genres.map(({ label }) => (
            <button
              key={label}
              className="genre-button"
              type="button"
              aria-pressed={selectedGenre === label}
              onClick={() => setSelectedGenre(label)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="book-grid" aria-live="polite">
          {selectedBooks.length > 0 ? (
            selectedBooks.map((book) => (
              <article className="book-card" key={book.id}>
                <p className="book-genre">{book.genre}</p>
                <h3>{book.title}</h3>
                <p className="book-author">by {book.author}</p>
              </article>
            ))
          ) : (
            <p className="empty-state">No books found in this genre.</p>
          )}
        </div>
      </section>
    </main>
  );
}

import assert from "node:assert/strict";
import test from "node:test";

import {
  selectBooks,
  selectFantasyBooks,
  selectHorrorBooks,
  selectScienceFictionBooks,
  store,
} from "./books.js";

test("selectBooks returns the full book inventory", () => {
  assert.equal(selectBooks(store.getState()).length, 6);
});

test("genre selectors return only books in their genre", () => {
  const state = store.getState();
  const genreSelectors = [
    [selectHorrorBooks, "Horror"],
    [selectFantasyBooks, "Fantasy"],
    [selectScienceFictionBooks, "Science Fiction"],
  ];

  for (const [selector, genre] of genreSelectors) {
    const books = selector(state);

    assert.equal(books.length, 2);
    assert.ok(books.every((book) => book.genre === genre));
  }
});

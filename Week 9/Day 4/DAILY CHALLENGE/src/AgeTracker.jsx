import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ageDownAsync, ageUpAsync } from './ageStore.js';

function AgeDisplay() {
  const { age, loading } = useSelector((state) => state.age);

  return (
    <section className="age-display" aria-live="polite" aria-busy={loading}>
      {loading ? (
        <span className="spinner" role="status" aria-label="Updating age" />
      ) : (
        <span className="age-number">{age}</span>
      )}
      <span className="age-label">{loading ? 'Updating your age' : 'years old'}</span>
    </section>
  );
}

function AgeControls() {
  const dispatch = useDispatch();
  const { age, loading } = useSelector((state) => state.age);

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <form className="age-controls" onSubmit={handleSubmit}>
      <button
        className="age-button"
        type="button"
        disabled={loading}
        onClick={() => dispatch(ageDownAsync())}
      >
        <span aria-hidden="true">−</span>
        Age Down
      </button>
      <button
        className="age-button age-button-primary"
        type="button"
        disabled={loading}
        onClick={() => dispatch(ageUpAsync())}
      >
        <span aria-hidden="true">+</span>
        Age Up
      </button>
      {age === 0 && (
        <p className="minimum-note">Age cannot go below zero.</p>
      )}
    </form>
  );
}

export default function AgeTracker() {
  return (
    <main className="page">
      <header className="page-heading">
        <p className="eyebrow">DAILY CHALLENGE · REDUX TOOLKIT</p>
        <h1>Age Tracker</h1>
        <p>Update your age asynchronously and watch Redux handle the delay.</p>
      </header>
      <div className="tracker-card">
        <AgeDisplay />
        <AgeControls />
      </div>
      <p className="hint">Each update takes a moment. The controls are paused while it runs.</p>
    </main>
  );
}

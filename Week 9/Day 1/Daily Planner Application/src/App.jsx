import React, { useState } from 'react';
import DatePicker from './DatePicker';
import TaskList from './TaskList';

function toDayId(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState(() => toDayId(new Date()));

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Daymark home">
          <span className="wordmark-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 3.5v17M3.5 12h17M5.99 5.99l12.02 12.02m0-12.02L5.99 18.01" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </span>
          <span>daymark</span>
        </a>
        <span className="topbar-note">A clear plan makes room to breathe.</span>
      </header>

      <section className="welcome-banner" aria-labelledby="page-title">
        <div className="welcome-copy">
          <p className="eyebrow">A MOMENT FOR YOU</p>
          <h1 id="page-title">Give your day<br />a little direction.</h1>
          <p>Gather your thoughts. Choose what matters. Begin anywhere.</p>
        </div>
        <div className="banner-art" aria-hidden="true">
          <span className="art-circle" />
          <span className="art-line art-line-one" />
          <span className="art-line art-line-two" />
          <span className="art-leaf art-leaf-one" />
          <span className="art-leaf art-leaf-two" />
          <span className="art-star">✳</span>
        </div>
      </section>

      <DatePicker dayId={selectedDay} onChange={setSelectedDay} />
      <TaskList dayId={selectedDay} />

      <p className="page-footer">Plans can change. You’re still right on time.</p>
    </main>
  );
}

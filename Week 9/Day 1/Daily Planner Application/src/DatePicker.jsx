import React from 'react';
import { connect } from 'react-redux';

function DatePicker({ dayId, onChange }) {
  const date = new Date(`${dayId}T12:00:00`);
  const dateLabel = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);

  function shiftDay(amount) {
    const nextDate = new Date(`${dayId}T12:00:00`);
    nextDate.setDate(nextDate.getDate() + amount);
    onChange(toDayId(nextDate));
  }

  function selectDate(event) {
    if (event.target.value) onChange(event.target.value);
  }

  return (
    <section className="date-card" aria-label="Choose a planning date">
      <div className="date-card-heading">
        <div className="date-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
            <path d="M7.5 3.5v4m9-4v4m-13 3h17" />
          </svg>
        </div>
        <div>
          <p className="eyebrow">PLAN YOUR DAY</p>
          <h2>{dateLabel}</h2>
        </div>
      </div>
      <div className="date-controls">
        <button
          className="icon-button"
          type="button"
          aria-label="Previous day"
          onClick={() => shiftDay(-1)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m12 4-6 6 6 6" />
          </svg>
        </button>
        <input
          className="date-input"
          type="date"
          aria-label="Select a date"
          value={dayId}
          onChange={selectDate}
        />
        <button
          className="icon-button"
          type="button"
          aria-label="Next day"
          onClick={() => shiftDay(1)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m8 4 6 6-6 6" />
          </svg>
        </button>
        <button
          className="today-button"
          type="button"
          onClick={() => onChange(toDayId(new Date()))}
        >
          Today
        </button>
      </div>
    </section>
  );
}

function toDayId(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const mapStateToProps = (state, ownProps) => ({
  dayId: ownProps.dayId,
  tasks: state.tasksByDay[ownProps.dayId] ?? [],
});

export default connect(mapStateToProps)(DatePicker);

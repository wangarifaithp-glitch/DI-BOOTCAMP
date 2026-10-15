import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../XP.JS';

function UserData() {
  const dispatch = useDispatch();
  const { data: user, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  if (status === 'loading' || status === 'idle') {
    return (
      <section className="profile-card status-card" aria-live="polite">
        <span className="loader" aria-hidden="true" />
        <p>Loading user profile…</p>
      </section>
    );
  }

  if (status === 'failed') {
    return (
      <section className="profile-card status-card error-card" role="alert">
        <span className="status-icon" aria-hidden="true">!</span>
        <div>
          <h2>We couldn’t load the profile</h2>
          <p>{error}</p>
          <button className="retry-button" type="button" onClick={() => dispatch(fetchUserData())}>
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-card" aria-labelledby="profile-name">
      <div className="profile-banner">
        <span className="profile-avatar" aria-hidden="true">
          {user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
        </span>
        <span className="profile-label">USER PROFILE</span>
      </div>
      <div className="profile-details">
        <h2 id="profile-name">{user.name}</h2>
        <p className="username">@{user.username}</p>
        <dl>
          <div>
            <dt>Email</dt>
            <dd><a href={`mailto:${user.email}`}>{user.email}</a></dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd><a href={`tel:${user.phone}`}>{user.phone}</a></dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd><a href={`https://${user.website}`} target="_blank" rel="noreferrer">{user.website}</a></dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>{user.address.street}, {user.address.suite}, {user.address.city}</dd>
          </div>
          <div>
            <dt>Company</dt>
            <dd>{user.company.name}</dd>
          </div>
        </dl>
        <button className="refresh-button" type="button" onClick={() => dispatch(fetchUserData())}>
          Refresh profile
        </button>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <main className="page">
      <header className="page-heading">
        <p className="eyebrow">REDUX TOOLKIT · ASYNC THUNK</p>
        <h1>People, at a glance.</h1>
        <p>A user profile, fetched from the API and managed with Redux.</p>
      </header>
      <UserData />
      <p className="source-note">Demo data from JSONPlaceholder</p>
    </main>
  );
}

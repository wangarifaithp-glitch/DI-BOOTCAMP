import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../features/auth/authThunks.js';
import { logout } from '../features/auth/authSlice.js';

export default function AuthForm() {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  function handleSubmit(event) {
    event.preventDefault();
    const displayName = name.trim();
    if (!displayName) return;
    dispatch(loginAsync(displayName));
    setName('');
  }

  if (user) {
    return (
      <div className="auth-user">
        <span className="user-greeting">Hi, {user.name}</span>
        <button className="text-button" type="button" onClick={() => dispatch(logout())}>Sign out</button>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="customer-name">Your name</label>
      <input
        id="customer-name"
        value={name}
        maxLength={50}
        autoComplete="name"
        placeholder="Your name"
        onChange={(event) => setName(event.target.value)}
      />
      <button className="text-button" type="submit" disabled={!name.trim() || status === 'loading'}>
        {status === 'loading' ? 'Signing in…' : 'Sign in'}
      </button>
      {error && <span className="auth-error" role="alert">{error}</span>}
    </form>
  );
}

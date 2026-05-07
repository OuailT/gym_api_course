import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Profile.css';

const Profile: React.FC = () => {
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();

  if (isLoading) return <p className="state-msg">Loading…</p>;

  if (!isAuthenticated || !user) {
    return (
      <div className="profile-guest">
        <p className="state-msg muted">You are not logged in.</p>
        <button
          className="btn btn-primary"
          onClick={() => loginWithRedirect()}
        >
          Log in to view your profile
        </button>
      </div>
    );
  }

  return (
    <section className="profile">
      <h1>My Profile</h1>
      <div className="profile-card">
        {user.picture && (
          <img
            src={user.picture}
            alt={user.name}
            className="profile-avatar"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="profile-info">
          <p>
            <span className="label">Name</span>
            {user.name}
          </p>
          <p>
            <span className="label">Email</span>
            {user.email}
          </p>
          <p>
            <span className="label">Sub</span>
            <code>{user.sub}</code>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Profile;

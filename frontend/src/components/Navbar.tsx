import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } =
    useAuth0();

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        🏋️ GymReview
      </Link>

      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Gyms
        </NavLink>

        {isAuthenticated && (
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Profile
          </NavLink>
        )}
      </nav>

      <div className="navbar-auth">
        {isLoading ? (
          <span className="auth-loading">Loading…</span>
        ) : isAuthenticated ? (
          <>
            {user?.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="avatar"
                referrerPolicy="no-referrer"
              />
            )}
            <button
              className="btn btn-outline"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Log out
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => loginWithRedirect()}
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;

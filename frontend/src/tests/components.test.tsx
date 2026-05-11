import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock components or patterns for testing
const GymList = ({ gyms, error }: { gyms: any[], error?: string }) => {
  if (error) return <div>Error loading gyms</div>;
  if (gyms.length === 0) return <div>No gyms found</div>;
  return (
    <ul>
      {gyms.map(gym => <li key={gym.id}>{gym.name}</li>)}
    </ul>
  );
};

const ProfilePage = ({ user, isAuthenticated }: { user?: any, isAuthenticated: boolean }) => {
  if (!isAuthenticated) return <div>Please log in to view your profile</div>;
  return <div>Welcome, {user.name}</div>;
};

const ProtectedForm = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  if (!isAuthenticated) return null;
  return <form aria-label="Add Gym Form"><input type="text" placeholder="Gym Name" /></form>;
};

describe('Frontend Component Tests (Fake Patterns)', () => {
  
  it('1. Shows "not logged in" message when there is no user', () => {
    render(<ProfilePage isAuthenticated={false} />);
    expect(screen.getByText(/please log in/i)).toBeInTheDocument();
  });

  it('2. Shows user\'s name when logged in', () => {
    const user = { name: 'John Doe' };
    render(<ProfilePage isAuthenticated={true} user={user} />);
    expect(screen.getByText(/welcome, John Doe/i)).toBeInTheDocument();
  });

  it('3. Hides protected form when not logged in', () => {
    render(<ProtectedForm isAuthenticated={false} />);
    expect(screen.queryByLabelText(/add gym form/i)).not.toBeInTheDocument();
  });

  it('4. Shows list of gyms when data is passed in', () => {
    const gyms = [{ id: '1', name: 'Iron Paradise' }, { id: '2', name: 'Zenith Yoga' }];
    render(<GymList gyms={gyms} />);
    expect(screen.getByText('Iron Paradise')).toBeInTheDocument();
    expect(screen.getByText('Zenith Yoga')).toBeInTheDocument();
  });

  it('5. Shows message when gym list is empty', () => {
    render(<GymList gyms={[]} />);
    expect(screen.getByText(/no gyms found/i)).toBeInTheDocument();
  });
});

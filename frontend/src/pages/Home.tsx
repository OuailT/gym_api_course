import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

interface Gym {
  id: string;
  name: string;
  address: string;
  description?: string;
  amenities: string[];
  imageUrl?: string;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? 'http://localhost:3001';

const Home: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const res = await fetch(`${API_BASE}/gyms`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        setGyms(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  if (loading) return <p className="state-msg">Loading gyms…</p>;
  if (error) return <p className="state-msg error">Error: {error}</p>;

  return (
    <section className="home">
      <div className="home-header">
        <h1>All Gyms</h1>
        <p className="subtitle">Discover and review the best gyms near you.</p>
      </div>

      {gyms.length === 0 ? (
        <p className="state-msg">No gyms found yet. Add the first one!</p>
      ) : (
        <ul className="gym-grid">
          {gyms.map((gym) => (
            <li key={gym.id} className="gym-card">
              {gym.imageUrl && (
                <img src={gym.imageUrl} alt={gym.name} className="gym-card-img" />
              )}
              <div className="gym-card-body">
                <h2 className="gym-card-name">{gym.name}</h2>
                <p className="gym-card-address">📍 {gym.address}</p>
                {gym.description && (
                  <p className="gym-card-desc">{gym.description}</p>
                )}
                {gym.amenities?.length > 0 && (
                  <ul className="amenities">
                    {gym.amenities.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                )}
                <Link to={`/gyms/${gym.id}`} className="btn btn-primary card-cta">
                  View Details →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Home;

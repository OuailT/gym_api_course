import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
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
  
  const gridRef = useRef<HTMLUListElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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

  useEffect(() => {
    if (!loading && gyms.length > 0 && gridRef.current) {
      const title = titleRef.current;
      const cards = Array.from(gridRef.current.children);
      
      const tl = gsap.timeline();
      
      if (title) {
        tl.fromTo(title, 
          { opacity: 0, y: -50 }, 
          { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
        );
      }

      if (cards.length > 0) {
        tl.fromTo(cards, 
          { opacity: 0, scale: 0.9, y: 60 },
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.1, 
            ease: "back.out(1.2)" 
          }, 
          "-=0.6"
        );
      }
    }
  }, [loading, gyms]);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (error) return <p className="state-msg error">Error: {error}</p>;

  return (
    <section className="home">
      <div className="home-header">
        <h1 ref={titleRef}>Discover Swedish Elite Gyms</h1>
        <p className="subtitle">Premium training spaces across Sweden.</p>
      </div>

      {gyms.length === 0 ? (
        <p className="state-msg">Preparing the best spots for you...</p>
      ) : (
        <ul className="gym-grid" ref={gridRef}>
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
                <ul className="amenities">
                  {gym.amenities.slice(0, 3).map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
                <Link to={`/gyms/${gym.id}`} className="btn btn-primary card-cta">
                  Expore Modern Facilities
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

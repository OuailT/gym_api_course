import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './GymDetail.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

function GymDetail() {
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const res = await fetch(`${API_BASE}/gyms/${id}`);
        if (res.status === 404) throw new Error('Gym not found');
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        setGym(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGym();
  }, [id]);

  if (loading) return <p className="state-msg">Loading…</p>;
  if (error)
    return (
      <div className="state-msg error">
        <p>{error}</p>
        <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          ← Back to all gyms
        </Link>
      </div>
    );

  return (
    <section className="gym-detail">
      <Link to="/" className="back-link">← All Gyms</Link>

      {gym.imageUrl && (
        <img src={gym.imageUrl} alt={gym.name} className="gym-detail-img" />
      )}

      <h1 className="gym-detail-name">{gym.name}</h1>
      <p className="gym-detail-address">📍 {gym.address}</p>

      {gym.description && (
        <p className="gym-detail-desc">{gym.description}</p>
      )}

      {gym.amenities?.length > 0 && (
        <div className="gym-detail-amenities">
          <h2>Amenities</h2>
          <ul>
            {gym.amenities.map((a) => (
              <li key={a}>✓ {a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Reviews section */}
      <div className="gym-detail-reviews">
        <h2>Reviews ({gym.reviews?.length || 0})</h2>
        {gym.reviews?.length > 0 ? (
          <ul className="review-list">
            {gym.reviews.map((review) => (
              <li key={review._id} className="review-item">
                <div className="review-meta">
                  <strong>{review.authorName}</strong>
                  <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="state-msg muted">
            No reviews yet. Be the first to review this gym!
          </p>
        )}
      </div>
    </section>
  );
}

export default GymDetail;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './GymDetail.css';

interface Review {
  id: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
}

interface GymDetailData {
  id: string;
  name: string;
  address: string;
  description?: string;
  amenities: string[];
  imageUrl?: string;
  reviews: Review[];
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? 'http://localhost:3001';

const GymDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  
  const [gym, setGym] = useState<GymDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchGym = async () => {
    try {
      const res = await fetch(`${API_BASE}/gyms/${id}`);
      if (res.status === 404) throw new Error('Gym not found');
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setGym(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchGym();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE}/gyms/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
        credentials: 'include', // CRITICAL for Auth0 session cookies
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit review');
      }

      // Refresh data
      await fetchGym();
      setComment('');
      setRating(5);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) return <p className="state-msg">Loading…</p>;
  if (error || !gym)
    return (
      <div className="state-msg error">
        <p>{error || 'Gym not found'}</p>
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
            {gym.amenities.map((a, idx) => (
              <li key={idx}>✓ {a}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="gym-review-section">
        <div className="gym-detail-reviews">
          <h2>Reviews ({gym.reviews?.length || 0})</h2>
          
          {isAuthenticated ? (
            <div className="add-review-box">
              <h3>Leave a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Rating:</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Comment:</label>
                  <textarea 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    required
                  />
                </div>
                {submitError && <p className="error-small">{submitError}</p>}
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            </div>
          ) : (
            <p className="login-prompt">
              Login to leave a review!
            </p>
          )}

          {gym.reviews?.length > 0 ? (
            <ul className="review-list">
              {gym.reviews.map((review) => (
                <li key={review.id} className="review-item">
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
      </div>
    </section>
  );
}

export default GymDetail;

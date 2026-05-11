import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { gsap } from 'gsap';
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

  // GSAP Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!loading && gym && containerRef.current) {
      gsap.fromTo(containerRef.current.children, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [loading, gym]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE}/gyms/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
        credentials: 'include',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit review');
      }

      await fetchGym();
      setComment('');
      setRating(5);
      
      // Success animation for form
      if (formRef.current) {
        gsap.to(formRef.current, { backgroundColor: 'rgba(74, 222, 128, 0.1)', duration: 0.3, yoyo: true, repeat: 1 });
      }
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) return <div className="loader-container"><div className="loader"></div></div>;
  
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
    <section className="gym-detail" ref={containerRef}>
      <Link to="/" className="back-link">← All Gyms</Link>

      <div className="gym-detail-main">
        {gym.imageUrl && (
          <div className="gym-image-container">
            <img src={gym.imageUrl} alt={gym.name} className="gym-detail-img" />
            <div className="image-overlay"></div>
          </div>
        )}

        <div className="gym-info-content">
          <h1 className="gym-detail-name">{gym.name}</h1>
          <p className="gym-detail-address">📍 {gym.address}</p>
          {gym.description && <p className="gym-detail-desc">{gym.description}</p>}
        </div>
      </div>

      <div className="gym-detail-grid">
        <div className="gym-detail-left">
          {gym.amenities?.length > 0 && (
            <div className="gym-detail-amenities premium-card">
              <h2>Amenities</h2>
              <div className="amenity-tags">
                {gym.amenities.map((a, idx) => (
                  <span key={idx} className="amenity-tag">✓ {a}</span>
                ))}
              </div>
            </div>
          )}

          <div className="review-form-container premium-card" ref={formRef}>
            {isAuthenticated ? (
              <div className="add-review-box">
                <h3>Post a Review</h3>
                <form onSubmit={handleReviewSubmit} className="modern-form">
                  <div className="form-group">
                    <label>Rating</label>
                    <div className="rating-select">
                      {[5, 4, 3, 2, 1].map(n => (
                        <label key={n} className={`rating-option ${rating === n ? 'active' : ''}`}>
                          <input type="radio" value={n} checked={rating === n} onChange={() => setRating(n)} />
                          {n} ★
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Your Experience</label>
                    <textarea 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you think of this gym?"
                      required
                    />
                  </div>
                  {submitError && <p className="error-small">{submitError}</p>}
                  <button type="submit" className="btn btn-primary submit-btn" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Post Review'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="login-prompt">
                <p>Loved this gym? Share your thoughts.</p>
                <Link to="/profile" className="btn btn-outline">Login to Review</Link>
              </div>
            )}
          </div>
        </div>

        <div className="gym-detail-right">
          <div className="gym-detail-reviews premium-card">
            <h2>Reviews ({gym.reviews?.length || 0})</h2>
            {gym.reviews?.length > 0 ? (
              <ul className="review-list">
                {gym.reviews.map((review) => (
                  <li key={review.id} className="review-item">
                    <div className="review-meta">
                      <div className="reviewer-info">
                        <strong>{review.authorName}</strong>
                        <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="review-stars">{'★'.repeat(review.rating)}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="state-msg muted">No reviews yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GymDetail;

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
    // Auth0 user sub (e.g. "auth0|abc123")
    authorSub: {
      type: String,
      required: [true, 'Author sub is required'],
    },
    authorName: {
      type: String,
      default: 'Anonymous',
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;

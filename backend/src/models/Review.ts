import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IReview extends Document {
  gym: Types.ObjectId;
  rating: number;
  comment?: string;
  authorSub: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema: Schema = new Schema(
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

const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);

export default Review;

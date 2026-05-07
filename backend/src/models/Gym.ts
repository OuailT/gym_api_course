import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IGym extends Document {
  name: string;
  address: string;
  description?: string;
  amenities: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const gymSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Gym name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    amenities: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Gym: Model<IGym> = mongoose.model<IGym>('Gym', gymSchema);

export default Gym;

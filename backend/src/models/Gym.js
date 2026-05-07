import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema(
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

const Gym = mongoose.model('Gym', gymSchema);

export default Gym;

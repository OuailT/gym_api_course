import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Gym from './models/Gym.js';
import Review from './models/Review.js';

const gyms = [
  {
    name: "Iron Paradise",
    address: "123 Muscle Beach, CA",
    description: "The ultimate training ground for serious athletes. Featuring top-tier equipment and a high-energy atmosphere.",
    amenities: ["Free Weights", "Power Racks", "Sauna", "Juice Bar"],
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000"
  },
  {
    name: "Zenith Yoga & Wellness",
    address: "456 Serenity Dr, NY",
    description: "Find your balance in our peaceful studio. Offering Hatha, Vinyasa, and restorative yoga sessions.",
    amenities: ["Yoga Mats Provided", "Changing Rooms", "Meditation Hall"],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000"
  },
  {
    name: "Velocity CrossFit",
    address: "789 Speed Way, TX",
    description: "High-intensity functional training designed to push your limits. Join our thriving community.",
    amenities: ["Rowing Machines", "Climbing Ropes", "Outdoor Area"],
    imageUrl: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=1000"
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Gym.deleteMany({});
    await Review.deleteMany({});

    // Insert new gyms
    const createdGyms = await Gym.insertMany(gyms);
    console.log(`✅ Successfully seeded ${createdGyms.length} gyms.`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err.message);
    process.exit(1);
  }
};

seedData();

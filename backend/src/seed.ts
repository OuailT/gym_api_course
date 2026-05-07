import 'dotenv/config';
import prisma from './config/prisma.js';

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
    // Clear existing data
    await prisma.review.deleteMany({});
    await prisma.gym.deleteMany({});

    // Insert new gyms
    for (const gym of gyms) {
      await prisma.gym.create({
        data: gym
      });
    }
    
    const count = await prisma.gym.count();
    console.log(`✅ Successfully seeded ${count} gyms into PostgreSQL.`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error seeding data:', err.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedData();

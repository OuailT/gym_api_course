import 'dotenv/config';
import prisma from './config/prisma';

const gyms = [
  {
    name: "SATS Sveavägen",
    address: "Sveavägen 100, 113 50 Stockholm, Sweden",
    description: "Premium fitness center in the heart of Stockholm. State-of-the-art equipment, group classes, and personal training.",
    amenities: ["Free Weights", "Yoga Studio", "Sauna", "Personal Trainers"],
    imageUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200"
  },
  {
    name: "Friskis & Svettis City",
    address: "Regeringsgatan 59, 111 56 Stockholm, Sweden",
    description: "Inclusive and energetic atmosphere with a wide variety of workout styles and modern facilities.",
    amenities: ["Spinning", "Olympic Racks", "Lounge", "Group Workouts"],
    imageUrl: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1200"
  },
  {
    name: "Nordic Wellness Avenyn",
    address: "Kungsportsavenyn 33, 411 36 Göteborg, Sweden",
    description: "One of Gothenburg's most popular gyms, featuring elite strength equipment and wellness areas.",
    amenities: ["Crossfit Area", "Spa", "Solarium", "Kidz Club"],
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1200"
  },
  {
    name: "Gymmet Stockholm",
    address: "Sorterargatan 8, 162 50 Vällingby, Sweden",
    description: "A specialized gym for those who take their strength training seriously. Open 24/7.",
    amenities: ["Powerlifting Platforms", "Strongman Equipment", "Competition Benches"],
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=1200"
  }
];

const seedData = async () => {
  try {
    // Clear existing data (this removes the "AuthGym" and old placeholders)
    console.log('🗑️ Cleaning up old data...');
    await prisma.review.deleteMany({});
    await prisma.gym.deleteMany({});

    console.log('🌱 Seeding Swedish gyms...');
    for (const gym of gyms) {
      await prisma.gym.create({
        data: gym
      });
    }
    
    const count = await prisma.gym.count();
    console.log(`✅ Successfully seeded ${count} premium Swedish gyms into PostgreSQL.`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error seeding data:', err.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedData();

const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Attraction = require('./models/Attraction');
const User = require('./models/User');
const Guide = require('./models/Guide');

const MOCK_ATTRACTIONS = [
  {
    name: 'Sigiriya Rock Fortress',
    description: 'An ancient rock fortress and palace ruin in central Sri Lanka. Known as the Eighth Wonder of the World, it features ancient frescoes and a massive lion carved from the rock.',
    location: {
      city: 'Dambulla',
      province: 'Central',
      coordinates: { latitude: 7.9570, longitude: 80.7603 }
    },
    category: 'history',
    images: ['https://images.unsplash.com/photo-1588598198321-179be400a400?w=800', 'https://images.unsplash.com/photo-1627896157734-4d7d4388f28b?w=800'],
    rating: 4.9,
    totalReviews: 1250,
    entryFee: 9000,
    openingHours: '7:00 AM - 5:30 PM',
    bestTimeToVisit: 'Early morning to avoid heat',
    tags: ['UNESCO', 'Hiking', 'Ancient'],
    isPopular: true
  },
  {
    name: 'Temple of the Sacred Tooth Relic',
    description: 'The sacred Buddhist temple housing the relic of the tooth of the Buddha, located in the royal palace complex of the former Kingdom of Kandy.',
    location: {
      city: 'Kandy',
      province: 'Central',
      coordinates: { latitude: 7.2936, longitude: 80.6413 }
    },
    category: 'religious',
    images: ['https://images.unsplash.com/photo-1625739958742-1e967a57eb0f?w=800'],
    rating: 4.8,
    totalReviews: 890,
    entryFee: 2000,
    openingHours: '5:30 AM - 8:00 PM',
    bestTimeToVisit: 'During the evening pooja',
    tags: ['UNESCO', 'Buddhism', 'Cultural'],
    isPopular: true
  },
  {
    name: 'Yala National Park',
    description: 'The most visited and second largest national park in Sri Lanka, famous for its high density of leopards, elephants, and diverse bird species.',
    location: {
      city: 'Tissamaharama',
      province: 'Southern',
      coordinates: { latitude: 6.3687, longitude: 81.5165 }
    },
    category: 'wildlife',
    images: ['https://images.unsplash.com/photo-1612025890978-c3c7d54e6e78?w=800', 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800'],
    rating: 4.7,
    totalReviews: 1120,
    entryFee: 8500,
    openingHours: '6:00 AM - 6:00 PM',
    bestTimeToVisit: 'February to July for leopard sightings',
    tags: ['Safari', 'Leopards', 'Nature'],
    isPopular: true
  },
  {
    name: 'Galle Fort',
    description: 'A UNESCO World Heritage Site originally built by the Portuguese in 1588 and extensively fortified by the Dutch in the 17th century. Filled with boutiques, cafes, and history.',
    location: {
      city: 'Galle',
      province: 'Southern',
      coordinates: { latitude: 6.0270, longitude: 80.2168 }
    },
    category: 'history',
    images: ['https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800'],
    rating: 4.6,
    totalReviews: 950,
    entryFee: 0,
    openingHours: 'Open 24 hours',
    bestTimeToVisit: 'Late afternoon for sunset views',
    tags: ['Colonial', 'Shopping', 'Ocean View'],
    isPopular: true
  },
  {
    name: 'Nine Arch Bridge',
    description: 'Iconic colonial railway bridge in Ella built entirely of brick, rock, and cement without any steel. Surrounded by lush tea fields and jungle.',
    location: {
      city: 'Ella',
      province: 'Uva',
      coordinates: { latitude: 6.8767, longitude: 81.0607 }
    },
    category: 'nature',
    images: ['https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800'],
    rating: 4.8,
    totalReviews: 2100,
    entryFee: 0,
    openingHours: 'Open 24 hours',
    bestTimeToVisit: 'When the train passes (check schedule)',
    tags: ['Photography', 'Train', 'Scenic'],
    isPopular: true
  },
  {
    name: 'Mirissa Beach',
    description: 'A beautiful crescent beach famous for whale watching, surfing, and vibrant nightlife. One of the best spots to see Blue Whales in their natural habitat.',
    location: {
      city: 'Mirissa',
      province: 'Southern',
      coordinates: { latitude: 5.9483, longitude: 80.4571 }
    },
    category: 'beach',
    images: ['https://images.unsplash.com/photo-1590377503702-4f5c89be8955?w=800'],
    rating: 4.5,
    totalReviews: 840,
    entryFee: 0,
    openingHours: 'Open 24 hours',
    bestTimeToVisit: 'November to April for whale watching',
    tags: ['Whale Watching', 'Surfing', 'Nightlife'],
    isPopular: true
  },
  {
    name: 'Horton Plains & World\'s End',
    description: 'A protected national park in the central highlands featuring montane grassland and cloud forest. The hike ends at a dramatic 4,000-foot drop known as World\'s End.',
    location: {
      city: 'Nuwara Eliya',
      province: 'Central',
      coordinates: { latitude: 6.8016, longitude: 80.8066 }
    },
    category: 'nature',
    images: ['https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800'],
    rating: 4.7,
    totalReviews: 620,
    entryFee: 6500,
    openingHours: '6:00 AM - 4:00 PM',
    bestTimeToVisit: 'Arrive before 9 AM to avoid mist',
    tags: ['Hiking', 'Views', 'Cool Climate'],
    isPopular: false
  },
  {
    name: 'Arugam Bay',
    description: 'A world-class surfing destination on Sri Lanka\'s east coast, known for its laid-back atmosphere, excellent point breaks, and beachfront cafes.',
    location: {
      city: 'Ampara',
      province: 'Eastern',
      coordinates: { latitude: 6.8436, longitude: 81.8266 }
    },
    category: 'beach',
    images: ['https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800'],
    rating: 4.6,
    totalReviews: 730,
    entryFee: 0,
    openingHours: 'Open 24 hours',
    bestTimeToVisit: 'May to September for best surf',
    tags: ['Surfing', 'Chill', 'Backpackers'],
    isPopular: false
  }
];

const MOCK_GUIDES = [
  {
    name: 'Kamal Perera',
    email: 'kamal@guide.com',
    password: 'password123',
    city: 'Kandy',
    bio: 'Passionate about Sri Lankan history and culture. Let me show you the hidden gems of Kandy and the Cultural Triangle.',
    languages: ['English', 'Sinhala'],
    specializations: ['history', 'culture', 'religious'],
    hourlyRate: 2000,
    experience: 8,
    trustScore: 92,
    rating: 4.9,
    isVerified: true
  },
  {
    name: 'Saman Kumara',
    email: 'saman@guide.com',
    password: 'password123',
    city: 'Galle',
    bio: 'Your local expert for the Southern Coast. I arrange the best whale watching tours and surf lessons.',
    languages: ['English', 'Sinhala', 'Russian'],
    specializations: ['beach', 'wildlife'],
    hourlyRate: 1500,
    experience: 5,
    trustScore: 85,
    rating: 4.6,
    isVerified: true
  },
  {
    name: 'Nimali Silva',
    email: 'nimali@guide.com',
    password: 'password123',
    city: 'Ella',
    bio: 'Experienced hiker and nature lover. Join me for the best trails around Ella and Horton Plains.',
    languages: ['English', 'Sinhala', 'German'],
    specializations: ['nature', 'adventure'],
    hourlyRate: 2500,
    experience: 10,
    trustScore: 98,
    rating: 5.0,
    isVerified: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // Clear Collections
    console.log('Clearing existing data...');
    await Attraction.deleteMany({});
    
    // Find all users who are guides and delete their profiles and user accounts
    const guideUsers = await User.find({ role: 'guide' });
    const guideIds = guideUsers.map(u => u._id);
    await Guide.deleteMany({ userId: { $in: guideIds } });
    await User.deleteMany({ role: 'guide' });

    // Seed Attractions
    console.log('Seeding attractions...');
    await Attraction.insertMany(MOCK_ATTRACTIONS);
    console.log(`✅ Seeded ${MOCK_ATTRACTIONS.length} attractions.`);

    // Seed Guides
    console.log('Seeding guides...');
    for (const guideData of MOCK_GUIDES) {
      // Create User
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(guideData.password, salt);
      
      const user = new User({
        name: guideData.name,
        email: guideData.email,
        password: hashedPassword,
        role: 'guide',
        location: { city: guideData.city, country: 'Sri Lanka' }
      });
      await user.save();

      // Create Guide Profile
      const guide = new Guide({
        userId: user._id,
        bio: guideData.bio,
        languages: guideData.languages,
        specializations: guideData.specializations,
        hourlyRate: guideData.hourlyRate,
        location: { city: guideData.city },
        isVerified: guideData.isVerified,
        trustScore: guideData.trustScore,
        rating: guideData.rating,
        experience: guideData.experience
      });
      await guide.save();
    }
    console.log(`✅ Seeded ${MOCK_GUIDES.length} guides.`);

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();

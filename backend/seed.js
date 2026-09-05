const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const bcrypt = require('bcryptjs');

const Attraction = require('./models/Attraction');
const User = require('./models/User');
const Guide = require('./models/Guide');
const Review = require('./models/Review');

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
    images: ['https://images.unsplash.com/photo-1588598198321-179be400a400?q=80&w=1000', 'https://images.unsplash.com/photo-1627896157734-4d7d4388f28b?q=80&w=1000'],
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
    images: ['https://images.unsplash.com/photo-1625739958742-1e967a57eb0f?q=80&w=1000', 'https://images.unsplash.com/photo-1587595431973-125d05f941f0?q=80&w=1000'],
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
    images: ['https://images.unsplash.com/photo-1612025890978-c3c7d54e6e78?q=80&w=1000', 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?q=80&w=1000'],
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
    images: ['https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=1000', 'https://images.unsplash.com/photo-1549473889-14f410d83298?q=80&w=1000'],
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
    images: ['https://images.unsplash.com/photo-1568454537842-d933259bb258?q=80&w=1000', 'https://images.unsplash.com/photo-1621831825835-f09d8d6728ac?q=80&w=1000'],
    rating: 4.9,
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
    images: ['https://images.unsplash.com/photo-1590377503702-4f5c89be8955?q=80&w=1000', 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?q=80&w=1000'],
    rating: 4.5,
    totalReviews: 840,
    entryFee: 0,
    openingHours: 'Open 24 hours',
    bestTimeToVisit: 'November to April for whale watching',
    tags: ['Whale Watching', 'Surfing', 'Nightlife'],
    isPopular: true
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
    images: ['https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1000', 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?q=80&w=1000'],
    rating: 4.6,
    totalReviews: 730,
    entryFee: 0,
    openingHours: 'Open 24 hours',
    bestTimeToVisit: 'May to September for best surf',
    tags: ['Surfing', 'Chill', 'Backpackers'],
    isPopular: false
  },
  {
    name: 'Pinnawala Elephant Orphanage',
    description: 'An orphanage, nursery and captive breeding ground for wild Asian elephants located at Pinnawala village, known for its large herd.',
    location: {
      city: 'Kegalle',
      province: 'Sabaragamuwa',
      coordinates: { latitude: 7.3005, longitude: 80.3871 }
    },
    category: 'wildlife',
    images: ['https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=1000', 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?q=80&w=1000'],
    rating: 4.4,
    totalReviews: 1450,
    entryFee: 3000,
    openingHours: '8:30 AM - 5:30 PM',
    bestTimeToVisit: 'Bathing times (10:00 AM & 2:00 PM)',
    tags: ['Elephants', 'Family', 'Nature'],
    isPopular: true
  }
];

const MOCK_GUIDES = [
  {
    name: 'Kasun Rathnayake',
    email: 'kasun@guide.com',
    password: 'password123',
    city: 'Kandy',
    bio: 'Passionate about Sri Lankan history and culture. Let me show you the hidden gems of Kandy and the Cultural Triangle. With 8 years of experience, I ensure a memorable journey.',
    languages: ['English', 'Sinhala', 'French'],
    specializations: ['history', 'culture', 'religious'],
    hourlyRate: 2000,
    experience: 8,
    trustScore: 95,
    rating: 4.9,
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500',
    isVerified: true
  },
  {
    name: 'Deshan Fernando',
    email: 'deshan@guide.com',
    password: 'password123',
    city: 'Galle',
    bio: 'Your local expert for the Southern Coast. I arrange the best whale watching tours, hidden beach experiences, and surf lessons. Let\'s explore the beautiful southern shores!',
    languages: ['English', 'Sinhala', 'Russian'],
    specializations: ['beach', 'wildlife', 'adventure'],
    hourlyRate: 1500,
    experience: 5,
    trustScore: 88,
    rating: 4.6,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500',
    isVerified: true
  },
  {
    name: 'Nethmi Silva',
    email: 'nethmi@guide.com',
    password: 'password123',
    city: 'Ella',
    bio: 'Experienced hiker and nature lover. Join me for the best trails around Ella, Little Adams Peak, and Horton Plains. I know all the best sunrise spots!',
    languages: ['English', 'Sinhala', 'German'],
    specializations: ['nature', 'adventure'],
    hourlyRate: 2500,
    experience: 10,
    trustScore: 98,
    rating: 5.0,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500',
    isVerified: true
  },
  {
    name: 'Chamara Perera',
    email: 'chamara@guide.com',
    password: 'password123',
    city: 'Dambulla',
    bio: 'Discover the ancient wonders of Sigiriya and Dambulla cave temples with a certified archaeological guide. I love sharing the deep history of our island.',
    languages: ['English', 'Sinhala', 'Japanese'],
    specializations: ['history', 'cultural'],
    hourlyRate: 2200,
    experience: 12,
    trustScore: 99,
    rating: 4.8,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500',
    isVerified: true
  }
];

const MOCK_TOURISTS = [
  {
    name: 'Emma Watson',
    email: 'emma@tourist.com',
    password: 'password123',
    city: 'London',
    country: 'United Kingdom',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=500'
  },
  {
    name: 'Michael Chen',
    email: 'michael@tourist.com',
    password: 'password123',
    city: 'Singapore',
    country: 'Singapore',
    profileImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=500'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@tourist.com',
    password: 'password123',
    city: 'Sydney',
    country: 'Australia',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500'
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
    await Review.deleteMany({});
    
    // Find all users and clear them
    const allUsers = await User.find({});
    await Guide.deleteMany({});
    await User.deleteMany({});

    // Seed Attractions
    console.log('Seeding attractions...');
    await Attraction.insertMany(MOCK_ATTRACTIONS);
    console.log(`✅ Seeded ${MOCK_ATTRACTIONS.length} attractions.`);

    // Seed Guides
    console.log('Seeding guides...');
    for (const guideData of MOCK_GUIDES) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(guideData.password, salt);
      
      const user = new User({
        name: guideData.name,
        email: guideData.email,
        password: hashedPassword,
        role: 'guide',
        location: { city: guideData.city, country: 'Sri Lanka' },
        profileImage: guideData.profileImage
      });
      await user.save();

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
        experience: guideData.experience,
        profileImage: guideData.profileImage,
        completedTours: Math.floor(Math.random() * 50) + 10
      });
      await guide.save();
    }
    console.log(`✅ Seeded ${MOCK_GUIDES.length} guides.`);

    // Seed Tourists
    console.log('Seeding tourists...');
    for (const tourist of MOCK_TOURISTS) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(tourist.password, salt);
      
      const user = new User({
        name: tourist.name,
        email: tourist.email,
        password: hashedPassword,
        role: 'tourist',
        location: { city: tourist.city, country: tourist.country },
        profileImage: tourist.profileImage
      });
      await user.save();
    }
    console.log(`✅ Seeded ${MOCK_TOURISTS.length} tourists.`);

    console.log('🎉 Database successfully seeded with rich data!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();

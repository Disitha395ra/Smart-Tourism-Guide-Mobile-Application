const Attraction = require('../models/Attraction');

// Seed data for Sri Lankan attractions
const sriLankanAttractions = [
  {
    name: 'Sigiriya Rock Fortress',
    description: 'An ancient rock fortress and palace ruin in central Sri Lanka. Built by King Kashyapa, it is a UNESCO World Heritage Site featuring stunning frescoes and water gardens.',
    location: { city: 'Dambulla', province: 'Central', coordinates: { latitude: 7.9572, longitude: 80.7600 } },
    category: 'history',
    images: ['https://images.unsplash.com/photo-1588598198321-179be400a400?w=800'],
    rating: 4.9, totalReviews: 2847, entryFee: 4500,
    openingHours: '7:00 AM - 5:30 PM',
    bestTimeToVisit: 'December to April',
    tags: ['UNESCO', 'fortress', 'ancient', 'climbing'],
    isPopular: true
  },
  {
    name: 'Temple of the Sacred Tooth Relic',
    description: 'A Buddhist temple in Kandy housing the relic of the tooth of the Buddha. This is the most sacred place of worship in Sri Lanka and a UNESCO World Heritage Site.',
    location: { city: 'Kandy', province: 'Central', coordinates: { latitude: 7.2931, longitude: 80.6413 } },
    category: 'religious',
    images: ['https://images.unsplash.com/photo-1625739958742-1e967a57eb0f?w=800'],
    rating: 4.8, totalReviews: 3210, entryFee: 1500,
    openingHours: '5:30 AM - 8:00 PM',
    bestTimeToVisit: 'January to March',
    tags: ['UNESCO', 'temple', 'Buddhist', 'sacred'],
    isPopular: true
  },
  {
    name: 'Yala National Park',
    description: 'The most visited and second largest national park in Sri Lanka. Famous for its leopard population, wild elephants, sloth bears, and hundreds of bird species.',
    location: { city: 'Tissamaharama', province: 'Southern', coordinates: { latitude: 6.3729, longitude: 81.5216 } },
    category: 'wildlife',
    images: ['https://images.unsplash.com/photo-1612025890978-c3c7d54e6e78?w=800'],
    rating: 4.7, totalReviews: 1956, entryFee: 3500,
    openingHours: '6:00 AM - 6:00 PM',
    bestTimeToVisit: 'February to July',
    tags: ['safari', 'leopard', 'elephant', 'birds', 'wildlife'],
    isPopular: true
  },
  {
    name: 'Galle Fort',
    description: 'A Dutch colonial fort in the Bay of Galle on the southwest coast. A UNESCO World Heritage Site with beautifully preserved Dutch colonial buildings and ramparts.',
    location: { city: 'Galle', province: 'Southern', coordinates: { latitude: 6.0252, longitude: 80.2170 } },
    category: 'history',
    images: ['https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800'],
    rating: 4.6, totalReviews: 2105, entryFee: 0,
    openingHours: 'Open 24 hours',
    bestTimeToVisit: 'November to April',
    tags: ['UNESCO', 'fort', 'colonial', 'Dutch', 'sunset'],
    isPopular: true
  },
  {
    name: 'Nine Arch Bridge',
    description: 'One of the best examples of colonial-era railway construction in Sri Lanka. This iconic bridge in Ella is built entirely of brick, stone and cement without any steel.',
    location: { city: 'Ella', province: 'Uva', coordinates: { latitude: 6.8761, longitude: 81.0626 } },
    category: 'nature',
    images: ['https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800'],
    rating: 4.8, totalReviews: 1745, entryFee: 0,
    openingHours: 'Open anytime',
    bestTimeToVisit: 'December to April',
    tags: ['bridge', 'train', 'colonial', 'scenic', 'photography'],
    isPopular: true
  },
  {
    name: 'Mirissa Beach',
    description: 'A beautiful crescent-shaped beach on the south coast of Sri Lanka. Famous for whale watching, surfing, and relaxed beach life with stunning sunsets.',
    location: { city: 'Mirissa', province: 'Southern', coordinates: { latitude: 5.9483, longitude: 80.4716 } },
    category: 'beach',
    images: ['https://images.unsplash.com/photo-1590377503702-4f5c89be8955?w=800'],
    rating: 4.5, totalReviews: 1423, entryFee: 0,
    openingHours: 'Open 24 hours',
    bestTimeToVisit: 'November to April',
    tags: ['beach', 'whale watching', 'surfing', 'sunset'],
    isPopular: true
  }
];

// GET /api/attractions - Get all with filters
exports.getAllAttractions = async (req, res) => {
  try {
    const { category, city, search } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (search) filter.name = { $regex: search, $options: 'i' };

    let attractions = await Attraction.find(filter).sort({ isPopular: -1, rating: -1 });
    
    // If DB is empty, return seed data
    if (attractions.length === 0) {
      return res.json(sriLankanAttractions);
    }

    res.json(attractions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/attractions/:id
exports.getAttractionById = async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);
    if (!attraction) return res.status(404).json({ error: 'Attraction not found' });
    res.json(attraction);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/attractions/seed - Admin only to seed attractions
exports.seedAttractions = async (req, res) => {
  try {
    await Attraction.deleteMany({});
    const inserted = await Attraction.insertMany(sriLankanAttractions);
    res.json({ message: `Seeded ${inserted.length} attractions successfully` });
  } catch (err) {
    res.status(500).json({ error: 'Server error seeding data' });
  }
};

// GET /api/attractions/recommend - AI Rule-based recommendation
exports.getRecommendations = async (req, res) => {
  try {
    const { preferences, limit = 5 } = req.query;
    let prefArray = preferences ? preferences.split(',') : [];
    
    let filter = {};
    if (prefArray.length > 0) {
      filter.category = { $in: prefArray };
    }

    let attractions = await Attraction.find(filter)
      .sort({ rating: -1, totalReviews: -1 })
      .limit(Number(limit));

    // If no matches on preferences, fall back to popular
    if (attractions.length === 0) {
      attractions = await Attraction.find({ isPopular: true }).limit(Number(limit));
    }
    
    // If DB is empty, use seed data
    if (attractions.length === 0) {
      const filtered = prefArray.length > 0 
        ? sriLankanAttractions.filter(a => prefArray.includes(a.category))
        : sriLankanAttractions;
      return res.json(filtered.slice(0, Number(limit)));
    }

    res.json(attractions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

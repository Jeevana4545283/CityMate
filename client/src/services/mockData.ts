import { IUser, IProperty, IServiceProvider, IServiceBooking, IGame, ICommunity, IPost, IMarketplaceItem } from '../types';

export const MOCK_CURRENT_USER: IUser = {
  _id: 'usr_001',
  id: 'usr_001',
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  age: 22,
  gender: 'Male',
  bio: 'CS student at IIIT Hyderabad who just moved to Gachibowli! Passionate about badminton doubles, web dev, and weekend food exploring.',
  city: 'Hyderabad',
  area: 'Gachibowli',
  latitude: 17.4401,
  longitude: 78.3489,
  role: 'USER',
  interests: ['Badminton', 'Technology', 'Gaming', 'Food', 'Movies'],
  sports: [
    {
      sport: 'Badminton',
      skillLevel: 'Intermediate',
      playingStyle: 'Doubles',
      preferredTime: 'Evening',
      availableDays: ['Saturday', 'Sunday', 'Wednesday']
    },
    {
      sport: 'Cricket',
      skillLevel: 'Beginner',
      playingStyle: 'Casual',
      preferredTime: 'Morning',
      availableDays: ['Sunday']
    }
  ]
};

export const MOCK_USERS: IUser[] = [
  MOCK_CURRENT_USER,
  {
    _id: 'usr_002',
    name: 'Priya Patel',
    email: 'priya@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    age: 24,
    gender: 'Female',
    bio: 'Frontend dev who just moved from Pune to Kondapur. Looking for badminton doubles partners & female flatmates!',
    city: 'Hyderabad',
    area: 'Kondapur',
    latitude: 17.4622,
    longitude: 78.3568,
    role: 'USER',
    interests: ['Badminton', 'Music', 'Fitness', 'Travel'],
    sports: [
      {
        sport: 'Badminton',
        skillLevel: 'Intermediate',
        playingStyle: 'Doubles',
        preferredTime: 'Evening',
        availableDays: ['Saturday', 'Sunday', 'Friday']
      }
    ]
  },
  {
    _id: 'usr_003',
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    age: 26,
    gender: 'Male',
    bio: 'Product manager in Hitech City. Avid badminton enthusiast and box cricket captain.',
    city: 'Hyderabad',
    area: 'Gachibowli',
    latitude: 17.4410,
    longitude: 78.3495,
    role: 'USER',
    interests: ['Badminton', 'Cricket', 'Movies', 'Tech'],
    sports: [
      {
        sport: 'Badminton',
        skillLevel: 'Advanced',
        playingStyle: 'Both',
        preferredTime: 'Evening',
        availableDays: ['Saturday', 'Sunday']
      }
    ]
  },
  {
    _id: 'usr_004',
    name: 'Ananya Reddy',
    email: 'ananya@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    age: 36,
    gender: 'Female',
    bio: 'Property Owner managing student PGs and 2BHK flats in Gachibowli & Madhapur.',
    city: 'Hyderabad',
    area: 'Madhapur',
    role: 'PROPERTY_OWNER',
    interests: ['Hospitality', 'Real Estate'],
    sports: []
  },
  {
    _id: 'usr_005',
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    age: 34,
    gender: 'Male',
    bio: 'Ravi Electrical Services — Certified electrician & handyman.',
    city: 'Hyderabad',
    area: 'Gachibowli',
    role: 'SERVICE_PROVIDER',
    interests: ['Electrical Services'],
    sports: []
  }
];

export const MOCK_PROPERTIES: IProperty[] = [
  {
    _id: 'prop_1',
    owner: 'Ananya Reddy',
    title: 'Stanza Living Luxury Student PG',
    type: 'PG',
    description: 'Modern fully furnished luxury PG for students & professionals. Includes 3 meals daily, 200 Mbps WiFi, daily housekeeping, biometric security, and gaming lounge.',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'
    ],
    city: 'Hyderabad',
    area: 'Gachibowli',
    address: 'Plot 42, DLF Cyber City Road, Gachibowli',
    latitude: 17.4401,
    longitude: 78.3489,
    rent: 9500,
    deposit: 15000,
    amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Parking', 'Attached Bathroom', 'Gaming Room'],
    rules: ['No smoking inside room', 'Visitor cutoff 10:30 PM'],
    availability: 'Available',
    genderPreference: 'Any',
    sharingType: '2-Sharing',
    rating: 4.8,
    reviewCount: 38,
    isVerified: true
  },
  {
    _id: 'prop_2',
    owner: 'Ananya Reddy',
    title: 'Botanical Greens 2BHK Flat for Flatmates',
    type: 'Flat',
    description: 'Spacious 2BHK furnished flat in Kondapur, 5 mins from Botanical Garden. Master bedroom available for move-in.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'
    ],
    city: 'Hyderabad',
    area: 'Kondapur',
    address: 'Botanical Garden Main Road, Kondapur',
    latitude: 17.4622,
    longitude: 78.3568,
    rent: 14000,
    deposit: 28000,
    amenities: ['WiFi', 'AC', 'Parking', 'Balcony', 'Washing Machine', 'Refrigerator'],
    rules: ['Pets allowed', 'Guests permitted'],
    availability: 'Available',
    genderPreference: 'Any',
    sharingType: 'Private Room in 2BHK',
    rating: 4.7,
    reviewCount: 22,
    isVerified: true
  },
  {
    _id: 'prop_3',
    owner: 'Ananya Reddy',
    title: 'Executive Womens PG & Hostel',
    type: 'Hostel',
    description: 'Safe, high-end womens hostel with biometric entry, CCTV security, nutritional meals, and attached balconies near Inorbit Mall.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
    ],
    city: 'Hyderabad',
    area: 'Madhapur',
    address: 'Behind Inorbit Mall, Madhapur',
    latitude: 17.4399,
    longitude: 78.3808,
    rent: 8500,
    deposit: 10000,
    amenities: ['WiFi', 'Food', 'Laundry', 'Security Guard', 'Attached Bathroom'],
    rules: ['Female residents only'],
    availability: 'Booking Fast',
    genderPreference: 'Female',
    sharingType: '3-Sharing',
    rating: 4.9,
    reviewCount: 45,
    isVerified: true
  }
];

export const MOCK_SERVICE_PROVIDERS: IServiceProvider[] = [
  {
    _id: 'prov_1',
    user: 'usr_005',
    businessName: 'Ravi Electrical & Fan Services',
    category: 'Electrician',
    services: ['Fan repair', 'Switch repair', 'Wiring & short circuit fix', 'Light installation'],
    experienceYears: 8,
    serviceAreas: ['Gachibowli', 'Kondapur', 'Madhapur', 'Hitech City'],
    pricingInfo: '₹249 inspection fee + parts at MRP',
    baseFee: 249,
    availabilityStatus: 'Available',
    rating: 4.9,
    reviewCount: 56,
    completedJobs: 142,
    verificationStatus: 'Verified',
    phone: '+91 98765 43210',
    bio: 'Certified electrician specializing in fan noise fixes, switchboards, and emergency light repairs.',
    city: 'Hyderabad',
    area: 'Gachibowli',
    latitude: 17.4401,
    longitude: 78.3489
  },
  {
    _id: 'prov_2',
    user: 'usr_005',
    businessName: 'Express Plumbing Solutions',
    category: 'Plumber',
    services: ['Pipe leak repairs', 'Tap & shower replacement', 'Geyser installation', 'Flush tank fix'],
    experienceYears: 10,
    serviceAreas: ['Gachibowli', 'Kondapur', 'Miyapur'],
    pricingInfo: '₹299 inspection fee',
    baseFee: 299,
    availabilityStatus: 'Available',
    rating: 4.8,
    reviewCount: 42,
    completedJobs: 115,
    verificationStatus: 'Verified',
    phone: '+91 98123 45678',
    bio: 'Fast leak fixes and geyser installations for flats & PGs.',
    city: 'Hyderabad',
    area: 'Kondapur',
    latitude: 17.4622,
    longitude: 78.3568
  },
  {
    _id: 'prov_3',
    user: 'usr_005',
    businessName: 'CoolBreeze AC Repair & Cleaning',
    category: 'AC Technician',
    services: ['AC deep foam jet cleaning', 'Gas refilling', 'Compressor repair', 'Installation'],
    experienceYears: 6,
    serviceAreas: ['Gachibowli', 'Madhapur', 'Hitech City'],
    pricingInfo: '₹499 service fee',
    baseFee: 499,
    availabilityStatus: 'Available',
    rating: 4.7,
    reviewCount: 39,
    completedJobs: 94,
    verificationStatus: 'Verified',
    phone: '+91 97654 32109',
    bio: 'Expert AC service to keep your room ice cold during Hyderabad summer.',
    city: 'Hyderabad',
    area: 'Madhapur',
    latitude: 17.4399,
    longitude: 78.3808
  }
];

export const MOCK_BOOKINGS: IServiceBooking[] = [
  {
    _id: 'book_1',
    user: MOCK_CURRENT_USER,
    provider: MOCK_SERVICE_PROVIDERS[0],
    serviceCategory: 'Fan Repair',
    problemDescription: 'Ceiling fan is making a loud rattling sound and stops completely after 10 minutes of running.',
    bookingDate: '2026-08-22',
    bookingTimeSlot: '06:00 PM',
    locationAddress: 'Flat 302, Stanza Living, DLF Cyber City Road, Gachibowli',
    area: 'Gachibowli',
    city: 'Hyderabad',
    status: 'Accepted',
    estimatedCost: 349,
    workerName: 'Ravi Kumar',
    workerPhone: '+91 98765 43210',
    notes: 'Please bring capacitor and bearing replacement parts.',
    createdAt: new Date().toISOString()
  }
];

export const MOCK_GAMES: IGame[] = [
  {
    _id: 'game_1',
    host: MOCK_CURRENT_USER,
    sport: 'Badminton',
    title: 'Saturday Evening Doubles Badminton',
    date: '2026-08-22',
    time: '06:00 PM',
    venue: 'Smash Badminton Arena, Gachibowli',
    city: 'Hyderabad',
    area: 'Gachibowli',
    latitude: 17.4401,
    longitude: 78.3489,
    skillLevel: 'Intermediate',
    playingStyle: 'Doubles',
    maxPlayers: 4,
    playersJoined: [MOCK_CURRENT_USER, MOCK_USERS[1]],
    description: 'Looking for 2 more intermediate badminton enthusiasts for a fun 2-hour doubles match this Saturday!'
  },
  {
    _id: 'game_2',
    host: MOCK_USERS[2],
    sport: 'Cricket',
    title: 'Sunday Morning Box Cricket',
    date: '2026-08-23',
    time: '07:00 AM',
    venue: 'Turf Park Box Cricket Ground, Kondapur',
    city: 'Hyderabad',
    area: 'Kondapur',
    latitude: 17.4622,
    longitude: 78.3568,
    skillLevel: 'All Levels',
    playingStyle: 'Casual',
    maxPlayers: 12,
    playersJoined: [MOCK_USERS[2], MOCK_CURRENT_USER, MOCK_USERS[1]],
    description: 'Friendly box cricket match! Equipment provided. Booked for 2 hours.'
  }
];

export const MOCK_COMMUNITIES: ICommunity[] = [
  {
    _id: 'comm_1',
    name: 'Hyderabad Newcomers & Expats',
    description: 'An open, welcoming community for anyone moving to Hyderabad for college, job, or travel. Ask questions, meet locals, and discover the city!',
    city: 'Hyderabad',
    area: 'All Areas',
    category: 'Newcomers',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=800',
    members: [MOCK_CURRENT_USER, MOCK_USERS[1], MOCK_USERS[2]]
  },
  {
    _id: 'comm_2',
    name: 'Gachibowli Badminton Club',
    description: 'Connecting badminton players around Gachibowli, IIIT, and DLF. Daily court bookings and weekend doubles games.',
    city: 'Hyderabad',
    area: 'Gachibowli',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
    members: [MOCK_CURRENT_USER, MOCK_USERS[1], MOCK_USERS[2]]
  }
];

export const MOCK_POSTS: IPost[] = [
  {
    _id: 'post_1',
    author: MOCK_CURRENT_USER,
    community: MOCK_COMMUNITIES[0],
    type: 'Question',
    title: 'Which area is best for affordable PGs near Gachibowli?',
    content: 'Hey everyone! I just moved to Hyderabad for college. Looking for a good PG under ₹10,000 with clean food and fast WiFi. Any recommendations around Gachibowli or Kondapur?',
    city: 'Hyderabad',
    area: 'Gachibowli',
    likes: ['usr_002', 'usr_003'],
    comments: [
      {
        author: MOCK_USERS[1],
        authorName: 'Priya Patel',
        authorPhoto: MOCK_USERS[1].profilePhoto,
        content: 'Check out Stanza Living near DLF! Stayed there when I arrived, WiFi and cleaning are top notch.',
        createdAt: '2026-08-17T18:30:00.000Z'
      }
    ],
    createdAt: '2026-08-17T17:00:00.000Z'
  }
];

export const MOCK_MARKETPLACE: IMarketplaceItem[] = [
  {
    _id: 'mkt_1',
    seller: MOCK_USERS[1],
    title: 'Wooden Study Table + Ergonomic Mesh Chair',
    description: 'Sturdy wooden study table with drawer and height-adjustable mesh chair. Perfectly working condition, 6 months old.',
    price: 1500,
    category: 'Furniture',
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800'],
    city: 'Hyderabad',
    area: 'Kondapur',
    status: 'Available',
    distance: 1.8
  },
  {
    _id: 'mkt_2',
    seller: MOCK_USERS[2],
    title: 'Single Size Orthopedic Foam Mattress',
    description: 'Super comfortable single mattress (6x3 feet), clean cover included. Moving to 2BHK so selling cheap.',
    price: 1200,
    category: 'Furniture',
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'],
    city: 'Hyderabad',
    area: 'Gachibowli',
    status: 'Available',
    distance: 1.2
  }
];

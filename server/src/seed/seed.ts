import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { ServiceProvider } from '../models/ServiceProvider';
import { ServiceBooking } from '../models/ServiceBooking';
import { Game } from '../models/Game';
import { Community } from '../models/Community';
import { Post } from '../models/Post';
import { Review } from '../models/Review';
import { MarketplaceItem } from '../models/MarketplaceItem';

dotenv.config();

const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citymate';

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(connStr);
    console.log('[Seed] Connected. Clearing old collections...');

    await User.deleteMany({});
    await Property.deleteMany({});
    await ServiceProvider.deleteMany({});
    await ServiceBooking.deleteMany({});
    await Game.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Review.deleteMany({});
    await MarketplaceItem.deleteMany({});

    console.log('[Seed] Inserting users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const usersData = [
      {
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        password: hashedPassword,
        city: 'Hyderabad',
        area: 'Gachibowli',
        role: 'USER',
        age: 22,
        gender: 'Male',
        bio: 'New CS student at IIIT Hyderabad. Passionate about badminton, coding, and exploring food joints!',
        profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
        interests: ['Badminton', 'Technology', 'Gaming', 'Food'],
        sports: [{ sport: 'Badminton', skillLevel: 'Intermediate', playingStyle: 'Doubles', preferredTime: 'Evening', availableDays: ['Saturday', 'Sunday', 'Wednesday'] }]
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: hashedPassword,
        city: 'Hyderabad',
        area: 'Kondapur',
        role: 'USER',
        age: 24,
        gender: 'Female',
        bio: 'Software engineer who just moved to Hyderabad. Looking for flatmates and weekend badminton partners!',
        profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
        interests: ['Badminton', 'Music', 'Fitness', 'Travel'],
        sports: [{ sport: 'Badminton', skillLevel: 'Intermediate', playingStyle: 'Doubles', preferredTime: 'Evening', availableDays: ['Friday', 'Saturday'] }]
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@example.com',
        password: hashedPassword,
        city: 'Hyderabad',
        area: 'Gachibowli',
        role: 'USER',
        age: 26,
        gender: 'Male',
        bio: 'Product Designer at Hitech City. Avid badminton & tennis player.',
        profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        interests: ['Badminton', 'Tennis', 'Movies', 'Tech'],
        sports: [{ sport: 'Badminton', skillLevel: 'Advanced', playingStyle: 'Singles', preferredTime: 'Morning', availableDays: ['Saturday', 'Sunday'] }]
      },
      {
        name: 'Ananya Reddy',
        email: 'ananya@example.com',
        password: hashedPassword,
        city: 'Hyderabad',
        area: 'Madhapur',
        role: 'PROPERTY_OWNER',
        age: 38,
        gender: 'Female',
        bio: 'Managing modern luxury PGs & serviced apartments in Gachibowli & Madhapur.',
        profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        interests: ['Hospitality', 'Interior Design'],
        sports: []
      },
      {
        name: 'Ravi Kumar',
        email: 'ravi@example.com',
        password: hashedPassword,
        city: 'Hyderabad',
        area: 'Gachibowli',
        role: 'SERVICE_PROVIDER',
        age: 34,
        gender: 'Male',
        bio: 'Certified electrician with 8+ years experience in fan repair, switches, and home wiring.',
        profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
        interests: ['Electricals', 'Services'],
        sports: []
      },
      {
        name: 'Vikram Singh',
        email: 'admin@citymate.com',
        password: hashedPassword,
        city: 'Hyderabad',
        area: 'Hitech City',
        role: 'ADMIN',
        age: 30,
        gender: 'Male',
        bio: 'Platform Administrator for CityMate.',
        profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        interests: ['Community', 'Admin'],
        sports: []
      }
    ];

    const users = await User.insertMany(usersData);
    console.log(`[Seed] Created ${users.length} users.`);

    const owner = users.find(u => u.role === 'PROPERTY_OWNER') || users[0];
    const workerUser = users.find(u => u.role === 'SERVICE_PROVIDER') || users[0];

    // Seed Properties
    console.log('[Seed] Inserting properties...');
    const propertiesData = [
      {
        owner: owner._id,
        title: 'Stanza Living Luxury Student PG',
        type: 'PG',
        description: 'Modern fully furnished luxury PG for students & professionals. Includes 3 meals, high-speed WiFi, laundry, and daily cleaning.',
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'],
        city: 'Hyderabad',
        area: 'Gachibowli',
        address: 'Near DLF Cyber City, Gachibowli',
        latitude: 17.4401,
        longitude: 78.3489,
        rent: 9500,
        deposit: 15000,
        amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Parking', 'Attached Bathroom'],
        rules: ['No smoking inside rooms', 'Gate closes at 10:30 PM'],
        availability: 'Available',
        genderPreference: 'Any',
        sharingType: '2-Sharing',
        rating: 4.8,
        reviewCount: 24,
        isVerified: true
      },
      {
        owner: owner._id,
        title: 'Green View 2BHK Apartment for Flatmates',
        type: 'Flat',
        description: 'Spacious 2BHK flat available for rent in Kondapur. Looking for friendly roommates or IT professionals.',
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'],
        city: 'Hyderabad',
        area: 'Kondapur',
        address: 'Botanical Garden Road, Kondapur',
        latitude: 17.4622,
        longitude: 78.3568,
        rent: 14000,
        deposit: 28000,
        amenities: ['WiFi', 'AC', 'Parking', 'Attached Bathroom', 'Balcony'],
        rules: ['Pets allowed', 'Visitors allowed'],
        availability: 'Available',
        genderPreference: 'Any',
        sharingType: 'Private Room in 2BHK',
        rating: 4.6,
        reviewCount: 18,
        isVerified: true
      },
      {
        owner: owner._id,
        title: 'Executive Womens PG & Hostel',
        type: 'Hostel',
        description: 'Safe, premium womens hostel with biometric security, healthy food, and high-speed fiber internet near Hitech City.',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
        city: 'Hyderabad',
        area: 'Madhapur',
        address: 'Near Inorbit Mall, Madhapur',
        latitude: 17.4399,
        longitude: 78.3808,
        rent: 8500,
        deposit: 10000,
        amenities: ['WiFi', 'Food', 'Laundry', 'Security Guard', 'Attached Bathroom'],
        rules: ['Strictly female residents only'],
        availability: 'Booking Fast',
        genderPreference: 'Female',
        sharingType: '3-Sharing',
        rating: 4.9,
        reviewCount: 42,
        isVerified: true
      }
    ];

    await Property.insertMany(propertiesData);
    console.log('[Seed] Inserted properties.');

    // Seed Service Providers
    console.log('[Seed] Inserting service providers...');
    const providersData = [
      {
        user: workerUser._id,
        businessName: 'Ravi Electrical & Fan Services',
        category: 'Electrician',
        services: ['Fan repair', 'Switch repair', 'Main line wiring', 'Light installation', 'Short circuit fix'],
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
        bio: 'Professional certified electrician prompt on-time service for home repairs.',
        city: 'Hyderabad',
        area: 'Gachibowli',
        latitude: 17.4401,
        longitude: 78.3489
      },
      {
        user: workerUser._id,
        businessName: 'Hyderabad Fast Plumbing Experts',
        category: 'Plumber',
        services: ['Pipe leak repair', 'Tap replacement', 'Flush tank repair', 'Geyser installation'],
        experienceYears: 10,
        serviceAreas: ['Gachibowli', 'Kukataplly', 'Miyapur'],
        pricingInfo: '₹299 inspection fee',
        baseFee: 299,
        availabilityStatus: 'Available',
        rating: 4.7,
        reviewCount: 38,
        completedJobs: 98,
        verificationStatus: 'Verified',
        phone: '+91 98123 45678',
        bio: 'Quick plumbing solutions for apartments and hostellers.',
        city: 'Hyderabad',
        area: 'Kondapur',
        latitude: 17.4622,
        longitude: 78.3568
      },
      {
        user: workerUser._id,
        businessName: 'CoolTech AC & Appliance Services',
        category: 'AC Technician',
        services: ['AC deep cleaning', 'Gas refilling', 'Compressor repair', 'General service'],
        experienceYears: 6,
        serviceAreas: ['Gachibowli', 'Madhapur', 'Hitech City', 'Kondapur'],
        pricingInfo: '₹499 service charge',
        baseFee: 499,
        availabilityStatus: 'Available',
        rating: 4.8,
        reviewCount: 44,
        completedJobs: 110,
        verificationStatus: 'Verified',
        phone: '+91 97654 32109',
        bio: 'Keep your room cool during summer! AC cleaning and repair specialists.',
        city: 'Hyderabad',
        area: 'Madhapur',
        latitude: 17.4399,
        longitude: 78.3808
      }
    ];

    await ServiceProvider.insertMany(providersData);
    console.log('[Seed] Inserted service providers.');

    // Seed Games
    console.log('[Seed] Inserting games...');
    const gamesData = [
      {
        host: users[0]._id,
        sport: 'Badminton',
        title: 'Saturday Evening Doubles Badminton',
        date: '2026-08-22',
        time: '06:00 PM',
        venue: 'Smash Badminton Arena, Gachibowli',
        city: 'Hyderabad',
        area: 'Gachibowli',
        skillLevel: 'Intermediate',
        playingStyle: 'Doubles',
        maxPlayers: 4,
        playersJoined: [users[0]._id, users[1]._id],
        description: 'Looking for 2 more intermediate badminton players for a fun 2-hour doubles match this Saturday!'
      },
      {
        host: users[2]._id,
        sport: 'Cricket',
        title: 'Sunday Morning Box Cricket',
        date: '2026-08-23',
        time: '07:00 AM',
        venue: 'Turf Park Box Cricket Ground, Kondapur',
        city: 'Hyderabad',
        area: 'Kondapur',
        skillLevel: 'All Levels',
        playingStyle: 'Casual',
        maxPlayers: 12,
        playersJoined: [users[2]._id, users[0]._id],
        description: 'Friendly box cricket match! Everyone welcome. Slot booked for 2 hours.'
      }
    ];

    await Game.insertMany(gamesData);
    console.log('[Seed] Inserted games.');

    // Seed Communities
    console.log('[Seed] Inserting communities...');
    const communitiesData = [
      {
        name: 'Hyderabad Newcomers & Expats',
        description: 'A friendly community for anyone who moved to Hyderabad for college, job, or travel. Ask questions, find friends, and discover the city together!',
        city: 'Hyderabad',
        area: 'All Areas',
        category: 'Newcomers',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=800',
        members: [users[0]._id, users[1]._id, users[2]._id],
        creator: users[0]._id
      },
      {
        name: 'Gachibowli Badminton Club',
        description: 'Community of badminton enthusiasts around Gachibowli, DLF, and IIIT. Weekend matches and friendly games!',
        city: 'Hyderabad',
        area: 'Gachibowli',
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
        members: [users[0]._id, users[1]._id, users[2]._id],
        creator: users[0]._id
      }
    ];

    const createdCommunities = await Community.insertMany(communitiesData);
    console.log('[Seed] Inserted communities.');

    // Seed Posts
    console.log('[Seed] Inserting posts...');
    const postsData = [
      {
        author: users[0]._id,
        community: createdCommunities[0]._id,
        type: 'Question',
        title: 'Which area is best for affordable PGs near Gachibowli?',
        content: 'Hi everyone! I just moved to Hyderabad for college. Looking for a decent PG under ₹10,000 with good WiFi and food near Gachibowli or Kondapur. Any recommendations?',
        city: 'Hyderabad',
        area: 'Gachibowli',
        likes: [users[1]._id, users[2]._id],
        comments: [
          {
            author: users[1]._id,
            authorName: 'Priya Patel',
            authorPhoto: users[1].profilePhoto,
            content: 'Check out Stanza Living near DLF! I stayed there for 3 months, food and WiFi were super reliable.',
            createdAt: new Date()
          }
        ]
      }
    ];

    await Post.insertMany(postsData);
    console.log('[Seed] Seed script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
}

seedDatabase();

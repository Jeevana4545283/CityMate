import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { RoommateProfile } from '../models/RoommateProfile';

dotenv.config();

const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citymate';

const dummyProfiles = [
  {
    age: 24,
    gender: 'Male',
    occupation: 'Working Professional',
    budgetMin: 8000,
    budgetMax: 15000,
    preferredPropertyType: 'Flat',
    preferredRoomType: 'Single Room',
    moveInDate: new Date('2026-09-01'),
    preferredLocations: ['Gachibowli', 'Kondapur'],
    foodPreference: 'Non-Vegetarian',
    smokingPreference: 'Non-Smoker',
    drinkingPreference: 'Occasional',
    sleepSchedule: 'Night Owl',
    cleanlinessPreference: 'Very Clean',
    petsPreference: 'Cats ok',
    interests: ['Coding', 'Gaming', 'Music'],
    bio: 'Software engineer looking for a chill roommate to share a 2BHK. I love gaming on weekends and keeping the common areas clean.'
  },
  {
    age: 22,
    gender: 'Female',
    occupation: 'Student',
    budgetMin: 5000,
    budgetMax: 10000,
    preferredPropertyType: 'PG',
    preferredRoomType: 'Shared Room',
    moveInDate: new Date('2026-08-25'),
    preferredLocations: ['Madhapur', 'Jubilee Hills'],
    foodPreference: 'Vegetarian',
    smokingPreference: 'Non-Smoker',
    drinkingPreference: 'Non-Drinker',
    sleepSchedule: 'Early Bird',
    cleanlinessPreference: 'Average',
    petsPreference: 'No pets',
    interests: ['Reading', 'Yoga', 'Coffee'],
    bio: 'Student at local university. Mostly busy with studies. Looking for a quiet place with good internet.'
  },
  {
    age: 26,
    gender: 'Male',
    occupation: 'Working Professional',
    budgetMin: 15000,
    budgetMax: 25000,
    preferredPropertyType: 'Flat',
    preferredRoomType: 'Single Room',
    moveInDate: new Date('2026-10-01'),
    preferredLocations: ['Banjara Hills', 'Jubilee Hills'],
    foodPreference: 'Any',
    smokingPreference: 'Outside Only',
    drinkingPreference: 'Regular',
    sleepSchedule: 'Any',
    cleanlinessPreference: 'Average',
    petsPreference: 'Dog lover',
    interests: ['Fitness', 'Travel', 'Movies'],
    bio: 'Marketing manager, out of town often. Looking for a friendly flatmate for a premium flat. I have a golden retriever.'
  },
  {
    age: 23,
    gender: 'Female',
    occupation: 'Working Professional',
    budgetMin: 10000,
    budgetMax: 18000,
    preferredPropertyType: 'Flat',
    preferredRoomType: 'Single Room',
    moveInDate: new Date('2026-09-15'),
    preferredLocations: ['Kondapur', 'Hitech City'],
    foodPreference: 'Vegan',
    smokingPreference: 'Non-Smoker',
    drinkingPreference: 'Occasional',
    sleepSchedule: 'Night Owl',
    cleanlinessPreference: 'Very Clean',
    petsPreference: 'No pets',
    interests: ['Art', 'Design', 'Photography'],
    bio: 'UX Designer working mostly from home. Need a quiet space and respect for privacy.'
  }
];

async function seedRoommates() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(connStr);
    console.log('[Seed] Connected. Clearing old RoommateProfiles...');
    
    await RoommateProfile.deleteMany({});
    
    console.log('[Seed] Fetching users...');
    const users = await User.find({}).limit(5);
    
    if (users.length < dummyProfiles.length) {
      console.log('Not enough users in DB to seed all dummy profiles.');
    }

    console.log('[Seed] Inserting dummy roommate profiles...');
    for (let i = 0; i < Math.min(users.length, dummyProfiles.length); i++) {
      await RoommateProfile.create({
        ...dummyProfiles[i],
        user: users[i]._id
      });
      console.log(`Created profile for ${users[i].name}`);
    }

    console.log('[Seed] Roommate Profiles seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
}

seedRoommates();

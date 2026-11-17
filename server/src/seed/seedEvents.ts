import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Event } from '../models/Event';

dotenv.config();

const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citymate';

const dummyEvents = [
  {
    title: 'Hyderabad Tech Meetup 2026',
    description: 'Join us for an evening of networking, tech talks, and pizza! We will be discussing the latest trends in AI and web development.',
    category: 'TECH',
    date: '2026-09-15',
    startTime: '18:00',
    endTime: '21:00',
    location: 'T-Hub, Madhapur',
    city: 'Hyderabad',
    maxParticipants: 150
  },
  {
    title: 'Sunday Morning Yoga in the Park',
    description: 'Start your Sunday right with a relaxing outdoor yoga session. Open to all skill levels. Please bring your own mat.',
    category: 'FITNESS',
    date: '2026-09-20',
    startTime: '07:00',
    endTime: '08:30',
    location: 'KBR Park, Jubilee Hills',
    city: 'Hyderabad',
    maxParticipants: 30
  },
  {
    title: 'Acoustic Open Mic Night',
    description: 'Showcase your musical talent or just come to enjoy local artists. Sign-ups start at 7 PM. One free drink for performers!',
    category: 'OPEN_MIC',
    date: '2026-09-18',
    startTime: '19:30',
    endTime: '23:00',
    location: 'Moonshine Cafe, Kondapur',
    city: 'Hyderabad',
    maxParticipants: 50
  },
  {
    title: 'Weekend Badminton Tournament',
    description: 'Amateur badminton doubles tournament. Great prizes for the winners! Registration fee included in the RSVP.',
    category: 'SPORTS',
    date: '2026-09-26',
    startTime: '09:00',
    endTime: '15:00',
    location: 'Smash Arena, Gachibowli',
    city: 'Hyderabad',
    maxParticipants: 64
  },
  {
    title: 'Modern Art Exhibition Opening',
    description: 'Opening night for the new modern art exhibit featuring local CityMate artists. Wine and cheese will be served.',
    category: 'ART',
    date: '2026-09-22',
    startTime: '18:30',
    endTime: '21:30',
    location: 'State Art Gallery, Madhapur',
    city: 'Hyderabad',
    maxParticipants: 100
  },
  {
    title: 'Indie Rock Concert',
    description: 'Local indie bands battle it out on stage. Come support your local music scene!',
    category: 'MUSIC',
    date: '2026-09-25',
    startTime: '20:00',
    endTime: '23:59',
    location: 'Hard Rock Cafe, Banjara Hills',
    city: 'Hyderabad',
    maxParticipants: 200
  }
];

async function seedEvents() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(connStr);
    console.log('[Seed] Connected. Clearing old Events...');
    
    await Event.deleteMany({});
    
    console.log('[Seed] Fetching users for organizers...');
    const users = await User.find({}).limit(2);
    
    if (users.length === 0) {
      console.log('No users found in DB. Cannot assign organizers to events.');
      process.exit(1);
    }

    console.log('[Seed] Inserting dummy events...');
    for (let i = 0; i < dummyEvents.length; i++) {
      // Alternate organizers between the found users
      const organizer = users[i % users.length]._id;
      
      await Event.create({
        ...dummyEvents[i],
        organizer: organizer,
        participants: [organizer] // Organizer is usually participating
      });
      console.log(`Created event: ${dummyEvents[i].title}`);
    }

    console.log('[Seed] Events seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
}

seedEvents();

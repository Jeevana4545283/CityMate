export type UserRole = 'USER' | 'SERVICE_PROVIDER' | 'PROPERTY_OWNER' | 'ADMIN';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
export type PlayingStyle = 'Singles' | 'Doubles' | 'Both' | 'Casual' | 'Competitive';
export type PreferredTime = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface ISportPreference {
  sport: string;
  skillLevel: SkillLevel;
  playingStyle: PlayingStyle;
  preferredTime: PreferredTime;
  availableDays: string[];
}

export interface IUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  profilePhoto?: string;
  age?: number;
  gender?: string;
  bio?: string;
  city: string;
  area: string;
  latitude?: number;
  longitude?: number;
  interests: string[];
  sports: ISportPreference[];
  role: UserRole;
  isVerified?: boolean;
  phone?: string;
  distance?: number;
  matchScore?: number;
  matchReasons?: string[];
}

export type ConnectionStatus = 'None' | 'Pending_Sent' | 'Pending_Received' | 'Accepted' | 'Rejected';

export interface IConnection {
  _id: string;
  sender: IUser | string;
  receiver: IUser | string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

export interface IConversation {
  partner: IUser;
  connectionId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface IProperty {
  _id: string;
  owner: IUser | string;
  title: string;
  type: 'PG' | 'Hostel' | 'Single Room' | 'Shared Room' | 'Flat' | 'Apartment' | 'Roommate';
  description: string;
  images: string[];
  city: string;
  area: string;
  address?: string;
  latitude: number;
  longitude: number;
  rent: number;
  deposit: number;
  amenities: string[];
  rules: string[];
  availability: 'Available' | 'Occupied' | 'Booking Fast';
  genderPreference: 'Male' | 'Female' | 'Any';
  sharingType?: string;
  rating: number;
  reviewCount: number;
  isVerified?: boolean;
  distance?: number;
}

export type ServiceCategory =
  | 'Plumber'
  | 'Electrician'
  | 'Fan Repair'
  | 'AC Technician'
  | 'Mechanic'
  | 'Carpenter'
  | 'Cleaner'
  | 'Painter'
  | 'Appliance Repair'
  | 'Locksmith'
  | 'Mobile Repair'
  | 'Computer Repair'
  | 'TV Repair';

export interface IServiceProvider {
  _id: string;
  user: IUser | string;
  businessName: string;
  category: ServiceCategory;
  services: string[];
  experienceYears: number;
  serviceAreas: string[];
  pricingInfo: string;
  baseFee: number;
  availabilityStatus: 'Available' | 'Busy' | 'Offline';
  rating: number;
  reviewCount: number;
  completedJobs: number;
  verificationStatus: 'Verified' | 'Pending' | 'Unverified';
  phone: string;
  bio: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

export type BookingStatus =
  | 'Requested'
  | 'Accepted'
  | 'Worker Assigned'
  | 'On The Way'
  | 'Service Started'
  | 'Completed'
  | 'Cancelled';

export interface IServiceBooking {
  _id: string;
  user: IUser | string;
  provider: IServiceProvider | string;
  serviceCategory: string;
  problemDescription: string;
  bookingDate: string;
  bookingTimeSlot: string;
  locationAddress: string;
  area: string;
  city: string;
  status: BookingStatus;
  estimatedCost: number;
  workerName?: string;
  workerPhone?: string;
  notes?: string;
  createdAt: string;
}

export interface IGame {
  _id: string;
  host: IUser | string;
  sport: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  area: string;
  latitude?: number;
  longitude?: number;
  skillLevel: SkillLevel | 'All Levels';
  playingStyle: PlayingStyle;
  maxPlayers: number;
  playersJoined: (IUser | string)[];
  description: string;
  distance?: number;
}

export interface ICommunity {
  _id: string;
  name: string;
  description: string;
  city: string;
  area: string;
  category: string;
  image: string;
  members: (IUser | string)[];
  creator?: IUser | string;
}

export interface IComment {
  _id?: string;
  author: IUser | string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: string;
}

export interface IPost {
  _id: string;
  author: IUser | string;
  community?: ICommunity | string;
  type: 'Discussion' | 'Question' | 'Event';
  title?: string;
  content: string;
  city: string;
  area: string;
  likes: string[];
  comments: IComment[];
  createdAt: string;
}

export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  read: boolean;
  status?: MessageStatus;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

export interface IMarketplaceItem {
  _id: string;
  seller: IUser | string;
  title: string;
  description: string;
  price: number;
  category: 'Furniture' | 'Electronics' | 'Appliances' | 'Bicycles' | 'Books' | 'Other';
  images: string[];
  city: string;
  area: string;
  status: 'Available' | 'Sold';
  distance?: number;
}

export interface INotification {
  _id: string;
  user: string;
  type: 'ConnectionRequest' | 'ConnectionAccepted' | 'Message' | 'BookingUpdate' | 'GameInvite' | 'System';
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

import { Schema, model, Document } from 'mongoose';

export interface ISportPreference {
  sport: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  playingStyle: 'Singles' | 'Doubles' | 'Both';
  preferredTime: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  availableDays: string[];
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  profilePhoto?: string;
  age?: number;
  gender?: string;
  bio?: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  interests: string[];
  sports: ISportPreference[];
  role: 'USER' | 'SERVICE_PROVIDER' | 'PROPERTY_OWNER' | 'ADMIN';
  isVerified?: boolean;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false, default: '' },
    profilePhoto: { type: String, default: '' },
    age: { type: Number, default: 24 },
    gender: { type: String, default: 'Male' },
    bio: { type: String, default: '' },
    city: { type: String, required: true, default: 'Hyderabad' },
    area: { type: String, required: true, default: 'Gachibowli' },
    latitude: { type: Number, default: 17.4401 },
    longitude: { type: Number, default: 78.3489 },
    interests: [{ type: String }],
    sports: [
      {
        sport: { type: String, required: true },
        skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'], default: 'Intermediate' },
        playingStyle: { type: String, enum: ['Singles', 'Doubles', 'Both'], default: 'Both' },
        preferredTime: { type: String, enum: ['Morning', 'Afternoon', 'Evening', 'Night'], default: 'Evening' },
        availableDays: [{ type: String }]
      }
    ],
    role: { type: String, enum: ['USER', 'SERVICE_PROVIDER', 'PROPERTY_OWNER', 'ADMIN'], default: 'USER' },
    isVerified: { type: Boolean, default: false },
    phone: { type: String, default: '' }
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);

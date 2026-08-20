import { Schema, model, Document, Types } from 'mongoose';

export interface IRoommateProfile extends Document {
  user: Types.ObjectId;
  age?: number;
  gender?: string;
  occupation?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredPropertyType?: string;
  preferredRoomType?: string;
  moveInDate?: Date;
  preferredLocations: string[];
  foodPreference?: string;
  smokingPreference?: string;
  drinkingPreference?: string;
  sleepSchedule?: string;
  cleanlinessPreference?: string;
  petsPreference?: string;
  interests: string[];
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoommateProfileSchema = new Schema<IRoommateProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    occupation: { type: String },
    budgetMin: { type: Number },
    budgetMax: { type: Number },
    preferredPropertyType: { type: String },
    preferredRoomType: { type: String },
    moveInDate: { type: Date },
    preferredLocations: [{ type: String }],
    foodPreference: { type: String },
    smokingPreference: { type: String },
    drinkingPreference: { type: String },
    sleepSchedule: { type: String },
    cleanlinessPreference: { type: String },
    petsPreference: { type: String },
    interests: [{ type: String }],
    bio: { type: String }
  },
  { timestamps: true }
);

export const RoommateProfile = model<IRoommateProfile>('RoommateProfile', RoommateProfileSchema);

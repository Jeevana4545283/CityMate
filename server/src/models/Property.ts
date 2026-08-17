import { Schema, model, Document, Types } from 'mongoose';

export interface IProperty extends Document {
  owner: Types.ObjectId;
  title: string;
  type: 'PG' | 'Hostel' | 'Single Room' | 'Shared Room' | 'Flat' | 'Apartment' | 'Roommate';
  description: string;
  images: string[];
  city: string;
  area: string;
  address: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['PG', 'Hostel', 'Single Room', 'Shared Room', 'Flat', 'Apartment', 'Roommate'],
      required: true
    },
    description: { type: String, required: true },
    images: [{ type: String }],
    city: { type: String, required: true, default: 'Hyderabad' },
    area: { type: String, required: true, default: 'Gachibowli' },
    address: { type: String, default: '' },
    latitude: { type: Number, required: true, default: 17.4401 },
    longitude: { type: Number, required: true, default: 78.3489 },
    rent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    amenities: [{ type: String }],
    rules: [{ type: String }],
    availability: { type: String, enum: ['Available', 'Occupied', 'Booking Fast'], default: 'Available' },
    genderPreference: { type: String, enum: ['Male', 'Female', 'Any'], default: 'Any' },
    sharingType: { type: String, default: 'Single / 2-Sharing' },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Property = model<IProperty>('Property', PropertySchema);

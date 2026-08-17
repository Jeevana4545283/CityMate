import { Schema, model, Document, Types } from 'mongoose';

export interface IServiceProvider extends Document {
  user: Types.ObjectId;
  businessName: string;
  category: 'Plumber' | 'Electrician' | 'Fan Repair' | 'AC Technician' | 'Mechanic' | 'Carpenter' | 'Cleaner' | 'Painter' | 'Appliance Repair' | 'Locksmith';
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
  createdAt: Date;
  updatedAt: Date;
}

const ServiceProviderSchema = new Schema<IServiceProvider>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    businessName: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Plumber',
        'Electrician',
        'Fan Repair',
        'AC Technician',
        'Mechanic',
        'Carpenter',
        'Cleaner',
        'Painter',
        'Appliance Repair',
        'Locksmith',
        'Mobile Repair',
        'Computer Repair',
        'TV Repair'
      ],
      required: true
    },
    services: [{ type: String }],
    experienceYears: { type: Number, default: 5 },
    serviceAreas: [{ type: String }],
    pricingInfo: { type: String, default: '₹299 inspection fee + service cost' },
    baseFee: { type: Number, default: 299 },
    availabilityStatus: { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Available' },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    verificationStatus: { type: String, enum: ['Verified', 'Pending', 'Unverified'], default: 'Verified' },
    phone: { type: String, required: true },
    bio: { type: String, default: '' },
    city: { type: String, required: true, default: 'Hyderabad' },
    area: { type: String, required: true, default: 'Gachibowli' },
    latitude: { type: Number, required: true, default: 17.4401 },
    longitude: { type: Number, required: true, default: 78.3489 }
  },
  { timestamps: true }
);

export const ServiceProvider = model<IServiceProvider>('ServiceProvider', ServiceProviderSchema);

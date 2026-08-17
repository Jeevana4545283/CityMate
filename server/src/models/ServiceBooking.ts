import { Schema, model, Document, Types } from 'mongoose';

export type BookingStatus =
  | 'Requested'
  | 'Accepted'
  | 'Worker Assigned'
  | 'On The Way'
  | 'Service Started'
  | 'Completed'
  | 'Cancelled';

export interface IServiceBooking extends Document {
  user: Types.ObjectId;
  provider: Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const ServiceBookingSchema = new Schema<IServiceBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
    serviceCategory: { type: String, required: true },
    problemDescription: { type: String, required: true },
    bookingDate: { type: String, required: true },
    bookingTimeSlot: { type: String, required: true },
    locationAddress: { type: String, required: true },
    area: { type: String, required: true, default: 'Gachibowli' },
    city: { type: String, required: true, default: 'Hyderabad' },
    status: {
      type: String,
      enum: ['Requested', 'Accepted', 'Worker Assigned', 'On The Way', 'Service Started', 'Completed', 'Cancelled'],
      default: 'Requested'
    },
    estimatedCost: { type: Number, default: 350 },
    workerName: { type: String, default: '' },
    workerPhone: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const ServiceBooking = model<IServiceBooking>('ServiceBooking', ServiceBookingSchema);

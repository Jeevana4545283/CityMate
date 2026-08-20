import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  property: Types.ObjectId;
  owner: Types.ObjectId;
  requester: Types.ObjectId;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  moveInDate?: Date;
  rentAgreed?: number;
  depositAgreed?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING'
    },
    moveInDate: { type: Date },
    rentAgreed: { type: Number },
    depositAgreed: { type: Number }
  },
  { timestamps: true }
);

export const Booking = model<IBooking>('Booking', BookingSchema);

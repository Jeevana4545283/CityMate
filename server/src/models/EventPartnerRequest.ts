import { Schema, model, Document, Types } from 'mongoose';

export interface IEventPartnerRequest extends Document {
  event: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const EventPartnerRequestSchema = new Schema<IEventPartnerRequest>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
);

export const EventPartnerRequest = model<IEventPartnerRequest>('EventPartnerRequest', EventPartnerRequestSchema);

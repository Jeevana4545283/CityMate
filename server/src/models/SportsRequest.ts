import { Schema, model, Document, Types } from 'mongoose';

export interface ISportsRequest extends Document {
  post: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const SportsRequestSchema = new Schema<ISportsRequest>(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
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

export const SportsRequest = model<ISportsRequest>('SportsRequest', SportsRequestSchema);

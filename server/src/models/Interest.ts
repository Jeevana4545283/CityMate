import { Schema, model, Document, Types } from 'mongoose';

export interface IInterest extends Document {
  fromUser: Types.ObjectId;
  toProfile: Types.ObjectId;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const InterestSchema = new Schema<IInterest>(
  {
    fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    toProfile: { type: Schema.Types.ObjectId, ref: 'RoommateProfile', required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
);

// Prevent duplicate interests
InterestSchema.index({ fromUser: 1, toProfile: 1 }, { unique: true });

export const Interest = model<IInterest>('Interest', InterestSchema);

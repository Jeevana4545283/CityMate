import { Schema, model, Document, Types } from 'mongoose';

export interface IMatch extends Document {
  userA: Types.ObjectId;
  userB: Types.ObjectId;
  compatibilityScore: number;
  status: 'ACTIVE' | 'REMOVED';
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    userA: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userB: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    compatibilityScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['ACTIVE', 'REMOVED'],
      default: 'ACTIVE'
    }
  },
  { timestamps: true }
);

// Ensure unique pairs regardless of order
MatchSchema.index({ userA: 1, userB: 1 }, { unique: true });

export const Match = model<IMatch>('Match', MatchSchema);

import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  author: Types.ObjectId;
  targetType: 'Property' | 'ServiceProvider' | 'Game' | 'User';
  targetId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['Property', 'ServiceProvider', 'Game', 'User'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

export const Review = model<IReview>('Review', ReviewSchema);

import { Schema, model, Document, Types } from 'mongoose';

export interface ICommunity extends Document {
  name: string;
  description: string;
  city: string;
  area: string;
  category: string;
  image: string;
  members: Types.ObjectId[];
  creator: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommunitySchema = new Schema<ICommunity>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    city: { type: String, required: true, default: 'Hyderabad' },
    area: { type: String, default: 'All Areas' },
    category: { type: String, default: 'General' },
    image: { type: String, default: '' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    creator: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Community = model<ICommunity>('Community', CommunitySchema);

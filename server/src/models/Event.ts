import { Schema, model, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  category: 'MUSIC' | 'SPORTS' | 'OPEN_MIC' | 'TECH' | 'FITNESS' | 'ART';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  city: string;
  organizer: Types.ObjectId;
  maxParticipants: number;
  participants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['MUSIC', 'SPORTS', 'OPEN_MIC', 'TECH', 'FITNESS', 'ART'],
      required: true
    },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    maxParticipants: { type: Number, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export const Event = model<IEvent>('Event', EventSchema);

import { Schema, model, Document, Types } from 'mongoose';

export interface IGame extends Document {
  host: Types.ObjectId;
  sport: 'Badminton' | 'Cricket' | 'Football' | 'Tennis' | 'Basketball' | 'Volleyball' | 'Table Tennis' | 'Running';
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional' | 'All Levels';
  playingStyle: 'Singles' | 'Doubles' | 'Casual' | 'Competitive';
  maxPlayers: number;
  playersJoined: Types.ObjectId[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sport: {
      type: String,
      enum: ['Badminton', 'Cricket', 'Football', 'Tennis', 'Basketball', 'Volleyball', 'Table Tennis', 'Running'],
      required: true
    },
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    city: { type: String, required: true, default: 'Hyderabad' },
    area: { type: String, required: true, default: 'Gachibowli' },
    latitude: { type: Number, default: 17.4401 },
    longitude: { type: Number, default: 78.3489 },
    skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional', 'All Levels'], default: 'Intermediate' },
    playingStyle: { type: String, enum: ['Singles', 'Doubles', 'Casual', 'Competitive'], default: 'Doubles' },
    maxPlayers: { type: Number, required: true, default: 4 },
    playersJoined: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Game = model<IGame>('Game', GameSchema);

import { Schema, model, Document, Types } from 'mongoose';

export interface IComment {
  _id?: Types.ObjectId;
  author: Types.ObjectId;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: Date;
}

export interface IPost extends Document {
  author: Types.ObjectId;
  community?: Types.ObjectId;
  type: 'Discussion' | 'Question' | 'Event';
  title?: string;
  content: string;
  city: string;
  area: string;
  likes: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    community: { type: Schema.Types.ObjectId, ref: 'Community' },
    type: { type: String, enum: ['Discussion', 'Question', 'Event'], default: 'Discussion' },
    title: { type: String, default: '' },
    content: { type: String, required: true },
    city: { type: String, required: true, default: 'Hyderabad' },
    area: { type: String, default: 'Gachibowli' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        authorName: { type: String, required: true },
        authorPhoto: { type: String, default: '' },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const Post = model<IPost>('Post', PostSchema);

import { Schema, model, Document, Types } from 'mongoose';

export interface IConnection extends Document {
  sender: any;
  receiver: any;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema = new Schema<IConnection>(
  {
    sender: { type: Schema.Types.Mixed, ref: 'User', required: true },
    receiver: { type: Schema.Types.Mixed, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }
  },
  { timestamps: true }
);

export const Connection = model<IConnection>('Connection', ConnectionSchema);

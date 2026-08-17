import { Schema, model, Document, Types } from 'mongoose';

export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface IMessage extends Document {
  sender: any;
  receiver: any;
  content: string;
  read: boolean;
  status: MessageStatus;
  deliveredAt?: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.Mixed, ref: 'User', required: true },
    receiver: { type: Schema.Types.Mixed, ref: 'User', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    status: { type: String, enum: ['SENT', 'DELIVERED', 'READ'], default: 'SENT' },
    deliveredAt: { type: Date },
    readAt: { type: Date }
  },
  { timestamps: true }
);

export const Message = model<IMessage>('Message', MessageSchema);

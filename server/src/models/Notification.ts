import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  user: any;
  type: 'ConnectionRequest' | 'ConnectionAccepted' | 'Message' | 'BookingUpdate' | 'GameInvite' | 'System';
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.Mixed, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['ConnectionRequest', 'ConnectionAccepted', 'Message', 'BookingUpdate', 'GameInvite', 'System'],
      required: true
    },
    message: { type: String, required: true },
    link: { type: String, default: '' },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification = model<INotification>('Notification', NotificationSchema);

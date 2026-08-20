import { Schema, model, Document, Types } from 'mongoose';

export interface IReportBlock extends Document {
  reporter: Types.ObjectId;
  reportedUser: Types.ObjectId;
  type: 'REPORT' | 'BLOCK';
  reason?: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: Date;
  updatedAt: Date;
}

const ReportBlockSchema = new Schema<IReportBlock>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['REPORT', 'BLOCK'], required: true },
    reason: { type: String },
    status: { type: String, enum: ['OPEN', 'RESOLVED'], default: 'OPEN' }
  },
  { timestamps: true }
);

export const ReportBlock = model<IReportBlock>('ReportBlock', ReportBlockSchema);

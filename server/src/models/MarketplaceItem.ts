import { Schema, model, Document, Types } from 'mongoose';

export interface IMarketplaceItem extends Document {
  seller: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: 'Furniture' | 'Electronics' | 'Appliances' | 'Bicycles' | 'Books' | 'Other';
  images: string[];
  city: string;
  area: string;
  status: 'Available' | 'Sold';
  createdAt: Date;
  updatedAt: Date;
}

const MarketplaceItemSchema = new Schema<IMarketplaceItem>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Furniture', 'Electronics', 'Appliances', 'Bicycles', 'Books', 'Other'],
      default: 'Furniture'
    },
    images: [{ type: String }],
    city: { type: String, required: true, default: 'Hyderabad' },
    area: { type: String, required: true, default: 'Gachibowli' },
    status: { type: String, enum: ['Available', 'Sold'], default: 'Available' }
  },
  { timestamps: true }
);

export const MarketplaceItem = model<IMarketplaceItem>('MarketplaceItem', MarketplaceItemSchema);

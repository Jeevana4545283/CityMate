import { Request, Response } from 'express';
import { MarketplaceItem } from '../models/MarketplaceItem';
import { AuthRequest } from '../middleware/auth';

export const getMarketplaceItems = async (req: Request, res: Response) => {
  try {
    const { category, city, area } = req.query;
    let query: any = {};

    if (category && category !== 'All') query.category = category;
    if (city) query.city = new RegExp(city as string, 'i');
    if (area) query.area = new RegExp(area as string, 'i');

    const items = await MarketplaceItem.find(query).populate('seller', 'name email phone profilePhoto');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching marketplace items' });
  }
};

export const createMarketplaceItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const item = await MarketplaceItem.create({
      ...req.body,
      seller: req.user.id
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error listing marketplace item' });
  }
};

import { Request, Response } from 'express';
import { Property } from '../models/Property';
import { AuthRequest } from '../middleware/auth';
import { calculateHaversineDistance } from '../services/locationService';

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { city, area, type, minRent, maxRent, genderPreference, search } = req.query;
    let query: any = {};

    if (city) query.city = new RegExp(city as string, 'i');
    if (area) query.area = new RegExp(area as string, 'i');
    if (type && type !== 'All') query.type = type;
    if (genderPreference && genderPreference !== 'Any') query.genderPreference = genderPreference;

    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search as string, 'i') },
        { area: new RegExp(search as string, 'i') },
        { description: new RegExp(search as string, 'i') }
      ];
    }

    const properties = await Property.find(query).populate('owner', 'name email phone profilePhoto');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties' });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone profilePhoto city area');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property' });
  }
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const property = await Property.create({
      ...req.body,
      owner: req.user.id
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error creating property listing', error: (error as Error).message });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error updating property' });
  }
};

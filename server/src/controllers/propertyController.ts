import { Request, Response } from 'express';
import { Property } from '../models/Property';
import { AuthRequest } from '../middleware/auth';
import { calculateHaversineDistance } from '../services/locationService';

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { city, area, type, minRent, maxRent, genderPreference, search, sort, limit, page, minDeposit, maxDeposit, roomType, furnishing, availability } = req.query;
    let query: any = {};

    if (city) query.city = new RegExp(city as string, 'i');
    if (area) query.area = new RegExp(area as string, 'i');
    if (type && type !== 'All') query.type = type;
    if (genderPreference && genderPreference !== 'Any') query.genderPreference = genderPreference;
    if (roomType && roomType !== 'All') query.sharingType = roomType; // Mapping roomType to sharingType
    if (availability && availability !== 'All') query.availability = availability;
    
    // Some properties might not have furnishing stored, but if they do:
    if (furnishing && furnishing !== 'All') query.furnishing = furnishing;

    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }
    
    if (minDeposit || maxDeposit) {
      query.deposit = {};
      if (minDeposit) query.deposit.$gte = Number(minDeposit);
      if (maxDeposit) query.deposit.$lte = Number(maxDeposit);
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search as string, 'i') },
        { area: new RegExp(search as string, 'i') },
        { description: new RegExp(search as string, 'i') },
        { amenities: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }
    
    let sortOption: any = { createdAt: -1 };
    if (sort === 'rent_asc') sortOption = { rent: 1 };
    if (sort === 'rent_desc') sortOption = { rent: -1 };

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 50;
    const skip = (pageNum - 1) * limitNum;

    const properties = await Property.find(query)
      .populate('owner', 'name email phone profilePhoto')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);
      
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
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    if (property.owner.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only edit your own properties' });
    }
    
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Error updating property' });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    if (property.owner.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own properties' });
    }
    
    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property' });
  }
};

export const getMyListings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const properties = await Property.find({ owner: req.user.id }).populate('owner', 'name email phone profilePhoto');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your listings' });
  }
};

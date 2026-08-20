import { Request, Response } from 'express';
import { RoommateProfile } from '../models/RoommateProfile';
import { Interest } from '../models/Interest';
import { Match } from '../models/Match';
import { ReportBlock } from '../models/ReportBlock';
import { User } from '../models/User';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await RoommateProfile.findOne({ user: req.user?.id }).populate('user', 'name profilePhoto');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createOrUpdateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    let profile = await RoommateProfile.findOne({ user: userId });
    
    if (profile) {
      profile = await RoommateProfile.findOneAndUpdate({ user: userId }, req.body, { new: true });
    } else {
      profile = new RoommateProfile({ ...req.body, user: userId });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const discoverPartners = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    // Get users that I have blocked or reported, or that have blocked me
    const blocks = await ReportBlock.find({
      $or: [{ reporter: currentUserId }, { reportedUser: currentUserId }]
    });
    const blockedIds = blocks.map(b => b.reporter.toString() === currentUserId ? b.reportedUser : b.reporter);
    
    // Find profiles excluding self and blocked
    const profiles = await RoommateProfile.find({
      user: { $ne: currentUserId, $nin: blockedIds }
    }).populate('user', 'name profilePhoto age gender city area');
    
    // In a real app, we would calculate a compatibility score here.
    // For now, we return them with a dummy score property
    const formattedProfiles = profiles.map(p => ({
      ...p.toObject(),
      compatibilityScore: Math.floor(Math.random() * 30) + 70 // 70-99 random score
    }));
    
    res.json(formattedProfiles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const expressInterest = async (req: Request, res: Response) => {
  try {
    const fromUser = req.user?.id;
    const { toProfileId } = req.body; // RoommateProfile ID
    
    const toProfile = await RoommateProfile.findById(toProfileId);
    if (!toProfile) return res.status(404).json({ message: 'Profile not found' });
    
    // Check if interest already exists
    const existing = await Interest.findOne({ fromUser, toProfile: toProfileId });
    if (existing) return res.status(400).json({ message: 'Interest already sent' });
    
    const interest = new Interest({ fromUser, toProfile: toProfileId, status: 'PENDING' });
    await interest.save();
    
    // Check if the other user also expressed interest in my profile
    const myProfile = await RoommateProfile.findOne({ user: fromUser });
    if (myProfile) {
      const mutual = await Interest.findOne({ fromUser: toProfile.user, toProfile: myProfile._id });
      if (mutual) {
        // It's a match!
        mutual.status = 'ACCEPTED';
        interest.status = 'ACCEPTED';
        await mutual.save();
        await interest.save();
        
        const match = new Match({ userA: fromUser, userB: toProfile.user });
        await match.save();
        
        return res.json({ message: 'It is a match!', match });
      }
    }
    
    res.json({ message: 'Interest expressed successfully', interest });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMatches = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const matches = await Match.find({
      $or: [{ userA: userId }, { userB: userId }],
      status: 'ACTIVE'
    }).populate('userA', 'name profilePhoto area').populate('userB', 'name profilePhoto area');
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const reportOrBlock = async (req: Request, res: Response) => {
  try {
    const reporter = req.user?._id;
    const { reportedUser, type, reason } = req.body;
    
    const rb = new ReportBlock({ reporter, reportedUser, type, reason });
    await rb.save();
    
    // If block, remove matches
    if (type === 'BLOCK') {
      await Match.updateMany(
        {
          $or: [
            { userA: reporter, userB: reportedUser },
            { userA: reportedUser, userB: reporter }
          ]
        },
        { status: 'REMOVED' }
      );
    }
    
    res.json({ message: `${type} recorded successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

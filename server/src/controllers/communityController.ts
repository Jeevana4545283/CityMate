import { Request, Response } from 'express';
import { Community } from '../models/Community';
import { Post } from '../models/Post';
import { AuthRequest } from '../middleware/auth';

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const { city, category } = req.query;
    let query: any = {};

    if (city) query.city = new RegExp(city as string, 'i');
    if (category) query.category = category;

    const communities = await Community.find(query).populate('members', 'name profilePhoto');
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching communities' });
  }
};

export const joinCommunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    if (!community.members.includes(req.user.id as any)) {
      community.members.push(req.user.id as any);
      await community.save();
    }

    res.json(community);
  } catch (error) {
    res.status(500).json({ message: 'Error joining community' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { type, communityId, city } = req.query;
    let query: any = {};

    if (type) query.type = type;
    if (communityId) query.community = communityId;
    if (city) query.city = new RegExp(city as string, 'i');

    const posts = await Post.find(query)
      .populate('author', 'name profilePhoto city area')
      .populate('community', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const post = await Post.create({
      ...req.body,
      author: req.user.id
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name profilePhoto city area');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: (error as Error).message });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { content, authorName, authorPhoto } = req.body;
    post.comments.push({
      author: req.user.id as any,
      authorName: authorName || 'Anonymous',
      authorPhoto: authorPhoto || '',
      content,
      createdAt: new Date()
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};

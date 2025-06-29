import { Request, Response } from 'express';
import User from '../models/User';
import Skill from '../models/Skill';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query = { 'profile.name': { $regex: search, $options: 'i' } };
  }

  const users = await User.find(query, 'profile.name profile.profilePicture skills_offered skills_needed');
  
  const formattedUsers = await Promise.all(users.map(async (user) => {
    const offeredSkills = await Skill.find({ _id: { $in: user.skills_offered.map(s => s.skillId) } }, 'name level');
    const neededSkills = await Skill.find({ _id: { $in: user.skills_needed.map(s => s.skillId) } }, 'name level');

    const skills = [
      ...offeredSkills.map(s => ({ ...s.toObject(), type: 'offered' })),
      ...neededSkills.map(s => ({ ...s.toObject(), type: 'needed' }))
    ];

    return {
      _id: user._id,
      name: user.profile.name,
      profile: user.profile,
      skills: skills
    };
  }));

  res.json(formattedUsers);
});

export const getUserSkills = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const offeredSkills = await Skill.find({ _id: { $in: user.skills_offered.map(s => s.skillId) } });
  const neededSkills = await Skill.find({ _id: { $in: user.skills_needed.map(s => s.skillId) } });

  res.json({ offered: offeredSkills, needed: neededSkills });
});

export const uploadProfilePicture = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'profile-pictures',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
    });

    const result = await uploadPromise as any;

    // Update user profile with new picture URL
    const user = await User.findByIdAndUpdate(
      userId,
      { 'profile.profilePicture': result.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: result.secure_url
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
});

export const removeProfilePicture = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If there's an existing profile picture, delete it from Cloudinary
    if (user.profile.profilePicture) {
      const publicId = user.profile.profilePicture.split('/').pop()?.split('.')[0];
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError);
          // Continue with the update even if Cloudinary deletion fails
        }
      }
    }

    // Update user profile to remove picture URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 'profile.profilePicture': undefined },
      { new: true }
    );

    res.json({
      message: 'Profile picture removed successfully',
      profilePicture: null
    });
  } catch (error) {
    console.error('Profile picture removal error:', error);
    res.status(500).json({ message: 'Failed to remove profile picture' });
  }
}); 
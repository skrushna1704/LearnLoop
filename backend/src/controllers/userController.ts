import { Request, Response } from 'express';
import User from '../models/User';
import Skill from '../models/Skill';
import { asyncHandler } from '../utils/asyncHandler';

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
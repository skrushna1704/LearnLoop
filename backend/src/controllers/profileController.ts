import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User, { IUser } from '../models/User';
import Skill, { ISkill } from '../models/Skill';
import mongoose from 'mongoose';

interface PopulatedSkillOffered extends Omit<IUser['skills_offered'][0], 'skillId'> {
  _id: mongoose.Types.ObjectId;
  skillId: ISkill;
}

interface PopulatedSkillNeeded extends Omit<IUser['skills_needed'][0], 'skillId'> {
  _id: mongoose.Types.ObjectId;
  skillId: ISkill;
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  // Populate skills_offered.skillId and skills_needed.skillId
  const populatedUser = await User.findById(user._id)
    .populate({
      path: 'skills_offered.skillId',
      select: 'name category level description'
    })
    .populate({
      path: 'skills_needed.skillId',
      select: 'name category level description'
    })
    .exec();

  if (!populatedUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // Map the skills to include both reference and skill details
  const mappedSkillsOffered = (populatedUser.skills_offered as unknown as PopulatedSkillOffered[]).map(skill => ({
    _id: skill._id,
    verified: skill.verified,
    portfolio: skill.portfolio,
    experience: skill.experience,
    description: skill.description,
    endorsements: skill.endorsements,
    name: skill.skillId?.name,
    category: skill.skillId?.category,
    level: skill.skillId?.level
  }));

  const mappedSkillsNeeded = (populatedUser.skills_needed as unknown as PopulatedSkillNeeded[]).map(skill => ({
    _id: skill._id,
    priority: skill.priority,
    learning_goals: skill.learning_goals,
    experience: skill.experience,
    description: skill.description,
    name: skill.skillId?.name,
    category: skill.skillId?.category,
    level: skill.skillId?.level
  }));

  res.json({
    id: populatedUser._id,
    email: populatedUser.email,
    isProfileComplete: populatedUser.isProfileComplete,
    profile: populatedUser.profile,
    skills_offered: mappedSkillsOffered,
    skills_needed: mappedSkillsNeeded,
    rating: populatedUser.rating,
    createdAt: populatedUser.createdAt,
    updatedAt: populatedUser.updatedAt,
  });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { profile, skills_offered, skills_needed } = req.body;
    
    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    // Handle skills_offered (teaching skills)
    if (skills_offered) {
      // Create or find each skill and create references
      const skillPromises = skills_offered.map(async (skillData: any) => {
        try {
          // First, try to find the skill in the Skill collection
          let skill = await Skill.findOne({
            name: skillData.name,
            category: skillData.category || 'Technology',
            level: skillData.level
          });

          if (!skill) {
            // If not found, create it
            skill = await Skill.create({
              name: skillData.name,
              category: skillData.category || 'Technology',
              level: skillData.level,
              description: skillData.description
            });
          }

          // Return the skill reference object
          return {
            skillId: skill._id,
            verified: false,
            portfolio: [],
            experience: skillData.experience,
            description: skillData.description,
            endorsements: 0
          };
        } catch (error: any) {
          // If there's a duplicate key error, try to find the existing skill
          if (error.code === 11000) {
            const skill = await Skill.findOne({ name: skillData.name });
            if (skill) {
              return {
                skillId: skill._id,
                verified: false,
                portfolio: [],
                experience: skillData.experience,
                description: skillData.description,
                endorsements: 0
              };
            }
          }
          throw error;
        }
      });

      user.skills_offered = await Promise.all(skillPromises);
    }

    // Handle skills_needed (learning skills)
    if (skills_needed) {
      // Create or find each skill and create references
      const skillPromises = skills_needed.map(async (skillData: any) => {
        try {
          // First, try to find the skill in the Skill collection
          let skill = await Skill.findOne({
            name: skillData.name,
            category: skillData.category || 'Technology',
            level: skillData.level
          });

          if (!skill) {
            // If not found, create it
            skill = await Skill.create({
              name: skillData.name,
              category: skillData.category || 'Technology',
              level: skillData.level,
              description: skillData.description
            });
          }

          // Return the skill reference object
          return {
            skillId: skill._id,
            priority: 1,
            learning_goals: skillData.description,
            experience: skillData.experience,
            description: skillData.description
          };
        } catch (error: any) {
          // If there's a duplicate key error, try to find the existing skill
          if (error.code === 11000) {
            const skill = await Skill.findOne({ name: skillData.name });
            if (skill) {
              return {
                skillId: skill._id,
                priority: 1,
                learning_goals: skillData.description,
                experience: skillData.experience,
                description: skillData.description
              };
            }
          }
          throw error;
        }
      });

      user.skills_needed = await Promise.all(skillPromises);
    }

    // Check if profile is complete
    const isProfileComplete =
      !!user.profile?.name &&
      Array.isArray(user.skills_offered) && user.skills_offered.length > 0 &&
      Array.isArray(user.skills_needed) && user.skills_needed.length > 0;
    
    user.isProfileComplete = isProfileComplete;
    
    // Save user and populate skills
    await user.save();
    
    const updatedUser = await User.findById(user._id)
      .populate({
        path: 'skills_offered.skillId',
        select: 'name category level description'
      })
      .populate({
        path: 'skills_needed.skillId',
        select: 'name category level description'
      });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Map the skills to include both reference and skill details
    const mappedSkillsOffered = updatedUser.skills_offered.map((skill: any) => ({
      _id: skill._id,
      verified: skill.verified,
      portfolio: skill.portfolio,
      experience: skill.experience,
      description: skill.description,
      endorsements: skill.endorsements,
      name: skill.skillId?.name,
      category: skill.skillId?.category,
      level: skill.skillId?.level
    }));

    const mappedSkillsNeeded = updatedUser.skills_needed.map((skill: any) => ({
      _id: skill._id,
      priority: skill.priority,
      learning_goals: skill.learning_goals,
      experience: skill.experience,
      description: skill.description,
      name: skill.skillId?.name,
      category: skill.skillId?.category,
      level: skill.skillId?.level
    }));

    res.json({
      message: 'Profile updated.',
      isProfileComplete,
      profile: updatedUser.profile,
      skills_offered: mappedSkillsOffered,
      skills_needed: mappedSkillsNeeded
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}; 
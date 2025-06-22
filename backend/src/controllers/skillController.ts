import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Skill, { ISkill } from '../models/Skill';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

interface PopulatedSkillOffered extends Omit<IUser['skills_offered'][0], 'skillId'> {
  _id: mongoose.Types.ObjectId;
  skillId: ISkill;
}

interface PopulatedSkillNeeded extends Omit<IUser['skills_needed'][0], 'skillId'> {
  _id: mongoose.Types.ObjectId;
  skillId: ISkill;
}

// Create a new skill (if not exists)
export const createSkill = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { name, category, level, description, experience, type = 'teaching' } = req.body;

    // First, create or find the skill in the Skill collection
    let skill = await Skill.findOne({ name, category, level });
    if (!skill) {
      skill = await Skill.create({
        name,
        category,
        level,
        description
      });
    }

    // Create the skill reference object with the correct structure
    const skillRef = type === 'teaching' ? {
      skillId: skill._id,
      verified: false,
      portfolio: [],
      experience,
      description,
      endorsements: 0,
      proficiency: 1
    } : {
      skillId: skill._id,
      priority: 1,
      learning_goals: description,
      experience,
      description
    };

    // Update the user document with the new skill reference
    const updateField = type === 'teaching' ? 'skills_offered' : 'skills_needed';
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { [updateField]: skillRef } },
      { new: true }
    )
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
    const mappedSkillsOffered = (updatedUser.skills_offered as unknown as PopulatedSkillOffered[]).map(skill => ({
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

    const mappedSkillsNeeded = (updatedUser.skills_needed as unknown as PopulatedSkillNeeded[]).map(skill => ({
      _id: skill._id,
      priority: skill.priority,
      learning_goals: skill.learning_goals,
      experience: skill.experience,
      description: skill.description,
      name: skill.skillId?.name,
      category: skill.skillId?.category,
      level: skill.skillId?.level
    }));

    res.status(201).json({
      message: 'Skill added successfully',
      skills_offered: mappedSkillsOffered,
      skills_needed: mappedSkillsNeeded
    });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ message: 'Failed to create skill' });
  }
};

// Get all skills
export const getAllSkills = async (_req: Request, res: Response) => {
  try {
    const allUsers = await User.find({ 'skills_offered.0': { $exists: true } }).populate({
      path: 'skills_offered.skillId',
      model: 'Skill',
      select: 'name category level description'
    });

    const skillsMap = new Map<string, any>();

    allUsers.forEach(user => {
      if (user.skills_offered && user.skills_offered.length > 0) {
        user.skills_offered.forEach((skillOffer: any) => {
          const skillId = skillOffer.skillId?._id.toString();
          if (!skillId) return;

          const teacherInfo = {
            _id: user._id,
            name: user.profile?.name,
            rating: 4.5, // Placeholder for rating
            location: user.profile?.location,
            availability: user.profile?.availability,
            profilePicture: user.profile?.profilePicture
          };

          if (skillsMap.has(skillId)) {
            const existingSkill = skillsMap.get(skillId);
            // Avoid duplicate teachers
            if (!existingSkill.teachers.some((t: any) => t._id.equals(teacherInfo._id))) {
              existingSkill.teachers.push(teacherInfo);
            }
          } else {
            skillsMap.set(skillId, {
              _id: skillId,
              name: skillOffer.skillId.name,
              description: skillOffer.skillId.description,
              category: skillOffer.skillId.category,
              level: skillOffer.level, // Level from the user's offer
              teachers: [teacherInfo],
              learners: [], // Placeholder for learners
              popularity: 0, // Placeholder for popularity
              tags: [skillOffer.skillId.category] // Example tag
            });
          }
        });
      }
    });

    const aggregatedSkills = Array.from(skillsMap.values());
    res.json(aggregatedSkills);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get skill by ID
export const getSkillById = async (req: Request, res: Response) => {
  const { skillId } = req.params;
  try {
    const skill = await Skill.findById(skillId).populate('teachers learners', 'profile.name profile.profilePicture');
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update skill
export const updateSkill = async (req: Request, res: Response) => {
  const { skillId } = req.params;
  const { name, description, category, level } = req.body;
  try {
    const skill = await Skill.findByIdAndUpdate(
      skillId,
      { name, description, category, level },
      { new: true, runValidators: true }
    );
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete skill
export const deleteSkill = async (req: Request, res: Response) => {
  const { skillId } = req.params;
  try {
    const skill = await Skill.findByIdAndDelete(skillId);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Add user as teacher
export const addTeacher = async (req: Request, res: Response) => {
  const { skillId } = req.params;
  const userId = req.body.userId;
  try {
    const skill = await Skill.findById(skillId);
    if (!skill) return res.status(404).json({ error: 'Skill not found' });
    if (!skill.teachers.includes(userId)) {
      skill.teachers.push(userId);
      await skill.save();
    }
    // Optionally update user profile
    await User.findByIdAndUpdate(userId, { $addToSet: { 'skills_offered': { skillId } } });
    res.json(skill);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Add user as learner
export const addLearner = async (req: Request, res: Response) => {
  const { skillId } = req.params;
  const userId = req.body.userId;
  try {
    const skill = await Skill.findById(skillId);
    if (!skill) return res.status(404).json({ error: 'Skill not found' });
    if (!skill.learners.includes(userId)) {
      skill.learners.push(userId);
      await skill.save();
    }
    // Optionally update user profile
    await User.findByIdAndUpdate(userId, { $addToSet: { 'skills_needed': { skillId } } });
    res.json(skill);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}; 
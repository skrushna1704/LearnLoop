import User from '../../models/User';

interface ProfileAnalysis {
  name: string;
  hasBio: boolean;
  skillsOfferedCount: number;
  skillsNeededCount: number;
  hasPortfolio: boolean;
  completenessScore: number; // A score from 0 to 1
  suggestions: string[];
}

/**
 * @description Analyzes a user's profile to find areas for improvement.
 * @param userId - The ID of the user to analyze.
 * @returns An object containing the profile analysis.
 */
export async function getProfileAnalysis(userId: string): Promise<ProfileAnalysis> {
  const user = await User.findById(userId).populate('skills_offered.skillId skills_needed.skillId');

  if (!user) {
    throw new Error('User not found');
  }

  const analysis: ProfileAnalysis = {
    name: user.profile?.name || 'User',
    hasBio: !!user.profile?.bio && user.profile.bio.length > 20,
    skillsOfferedCount: user.skills_offered?.length || 0,
    skillsNeededCount: user.skills_needed?.length || 0,
    hasPortfolio: user.skills_offered?.some(skill => skill.portfolio && skill.portfolio.length > 0),
    completenessScore: 0,
    suggestions: [],
  };

  // Calculate completeness score (simple version)
  let score = 0;
  if (analysis.hasBio) score += 1;
  if (analysis.skillsOfferedCount > 0) score += 1;
  if (analysis.skillsNeededCount > 0) score += 1;
  if (analysis.hasPortfolio) score += 1;
  if (user.profile?.profilePicture) score += 1;
  analysis.completenessScore = score / 5;

  // Generate suggestions
  if (!analysis.hasBio) {
    analysis.suggestions.push("Your bio is a bit short. A detailed bio helps build trust.");
  }
  if (analysis.skillsOfferedCount === 0) {
    analysis.suggestions.push("You haven't listed any skills to teach. Add a skill you're confident in!");
  }
  if (analysis.skillsNeededCount === 0) {
    analysis.suggestions.push("What do you want to learn? Add some 'skills needed' to find matches.");
  }
  if (analysis.skillsOfferedCount > 0 && !analysis.hasPortfolio) {
    analysis.suggestions.push("Consider adding a portfolio or examples to your offered skills to showcase your talent.");
  }
  if (!user.profile?.profilePicture) {
    analysis.suggestions.push("A profile picture makes your account more personal and trustworthy.");
  }

  return analysis;
} 
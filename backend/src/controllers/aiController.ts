import { Request, Response } from 'express';
import OpenAI from 'openai';
import { asyncHandler } from '../utils/asyncHandler';
import { getProfileAnalysis } from '../services/ai/tools';

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @desc    Get a response from the AI chatbot
 * @route   POST /api/ai/chat
 * @access  Public (for now, can be restricted to logged-in users later)
 */
export const getChatCompletion = asyncHandler(async (req: Request, res: Response) => {
  const { message, history = [] } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  // System message to set the context for the AI
  const systemMessage = {
    role: 'system',
    content: `You are "LearnLoop AI", a helpful and friendly assistant for the LearnLoop skill-exchange platform. Your goal is to help users learn, teach, and connect. You are positive and encouraging. Keep your answers concise and easy to understand. The platform allows users to trade skills without money.`,
  };

  // Combine system message, previous history, and the new user message
  const messages = [
    systemMessage,
    ...history.map((item: { role: string; content: string }) => ({
      role: item.role,
      content: item.content,
    })),
    { role: 'user', content: message },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Efficient and cost-effective model for chat
      messages: messages,
      temperature: 0.7, // A bit of creativity
      max_tokens: 150, // Limit response length
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim();

    if (!aiResponse) {
      res.status(500);
      throw new Error('AI did not return a response.');
    }

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500);
    throw new Error('Failed to get a response from the AI assistant.');
  }
});

/**
 * @desc    Get personalized suggestions for the user's dashboard
 * @route   GET /api/ai/suggestions
 * @access  Private (requires authentication)
 */
export const getDashboardSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  if (!userId) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  // 1. Get the raw data using our tool
  const analysis = await getProfileAnalysis(userId);

  // If the profile is great, send a nice message
  if (analysis.completenessScore > 0.8 && analysis.suggestions.length === 0) {
    return res.status(200).json({
      suggestions: [{ id: 1, text: "Your profile is looking great! Keep up the excellent work." }]
    });
  }

  // 2. Ask the AI to turn the analysis into friendly suggestions
  const prompt = `
    The user's profile analysis is as follows:
    - Profile Completeness: ${Math.round(analysis.completenessScore * 100)}%
    - Areas for improvement: ${analysis.suggestions.join(', ')}

    Based on this, generate 2-3 friendly, encouraging, and actionable tips for a user named ${analysis.name}.
    Frame them as helpful advice from a coach. Speak directly to the user.
    Return the output as a JSON array of strings. For example: ["Your first tip.", "Your second tip."]
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful and encouraging AI Profile Coach for a skill-exchange platform. Your goal is to help users improve their profiles to find better matches.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
    });
    
    const rawResponse = completion.choices[0]?.message?.content;
    if (!rawResponse) {
      throw new Error('AI did not return a valid response.');
    }
    
    // Parse the JSON response from the AI
    const suggestions = JSON.parse(rawResponse);

    // Format for the frontend
    const formattedSuggestions = suggestions.map((text: string, index: number) => ({
      id: index + 1,
      text,
    }));

    res.status(200).json({ suggestions: formattedSuggestions });

  } catch (error) {
    console.error('Error in getDashboardSuggestions:', error);
    res.status(500).json({ message: "Could not generate AI suggestions at this time." });
  }
}); 
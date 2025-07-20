// OpenRouter API Configuration (Currently Active)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// OpenAI Configuration (Commented for future use)
// import OpenAI from 'openai';
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export interface AIEvaluationResult {
  isCorrect: boolean;
  confidence: number;
  feedback: string;
}

export interface QuestionData {
  question: string;
  category?: string;
  answer: string[];
}

/**
 * Evaluate a user's answer using AI via OpenRouter
 * @param userAnswer - The user's submitted answer
 * @param questionData - The question data including question text and correct answers
 * @returns Promise<AIEvaluationResult> - The AI evaluation result
 */
export async function evaluateAnswerWithAI(
  userAnswer: string, 
  questionData: QuestionData
): Promise<AIEvaluationResult> {
  console.log('🤖 Starting AI evaluation via OpenRouter...');
  console.log('Question:', questionData.question);
  console.log('User Answer:', userAnswer);
  console.log('Expected Answers:', questionData.answer);

  const prompt = `
You are an expert evaluating a practice answer for a skill-learning platform.

Question: "${questionData.question}"
Category: ${questionData.category || 'General'}

User's Answer: "${userAnswer}"

Expected Correct Answers:
${questionData.answer.map((ans: string, index: number) => `${index + 1}. "${ans}"`).join('\n')}

Instructions:
1. Evaluate if the user's answer is correct based on the expected answers
2. Consider semantic meaning, not just exact word matches
3. Account for different writing styles and levels of detail
4. If the user's answer covers the key concepts correctly, mark it as correct
5. Return ONLY a JSON object with this exact format:
{
  "isCorrect": true/false,
  "confidence": 0.0-1.0,
  "feedback": "Brief explanation of why it's correct or incorrect"
}

Be fair and understanding. If the user's answer demonstrates understanding of the core concepts, even with different wording, mark it as correct.
`;

  try {
    console.log('📤 Sending prompt to OpenRouter...');
    
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app-domain.com', // Replace with your domain
        'X-Title': 'Skill Practice Platform' // Optional: your app name
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // Using OpenAI model via OpenRouter
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert educational evaluator. Always respond with valid JSON only.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent evaluation
        max_tokens: 200,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawResponse = data.choices[0]?.message?.content;
    console.log('📥 OpenRouter Raw Response:', rawResponse);
    
    if (rawResponse) {
      const evaluation = JSON.parse(rawResponse);
      console.log('✅ Parsed Evaluation:', evaluation);
      return {
        isCorrect: evaluation.isCorrect,
        confidence: evaluation.confidence,
        feedback: evaluation.feedback
      };
    } else {
      throw new Error('AI did not return a valid response.');
    }
  } catch (error) {
    console.error('❌ OpenRouter AI evaluation failed:', error);
    throw error;
  }
}

/**
 * OpenAI Evaluation Function (Commented for future use)
 * Uncomment and use this if you want to switch back to direct OpenAI API
 */
/*
export async function evaluateAnswerWithOpenAI(
  userAnswer: string, 
  questionData: QuestionData
): Promise<AIEvaluationResult> {
  console.log('🤖 Starting OpenAI evaluation...');
  console.log('Question:', questionData.question);
  console.log('User Answer:', userAnswer);
  console.log('Expected Answers:', questionData.answer);

  const prompt = `
You are an expert evaluating a practice answer for a skill-learning platform.

Question: "${questionData.question}"
Category: ${questionData.category || 'General'}

User's Answer: "${userAnswer}"

Expected Correct Answers:
${questionData.answer.map((ans: string, index: number) => `${index + 1}. "${ans}"`).join('\n')}

Instructions:
1. Evaluate if the user's answer is correct based on the expected answers
2. Consider semantic meaning, not just exact word matches
3. Account for different writing styles and levels of detail
4. If the user's answer covers the key concepts correctly, mark it as correct
5. Return ONLY a JSON object with this exact format:
{
  "isCorrect": true/false,
  "confidence": 0.0-1.0,
  "feedback": "Brief explanation of why it's correct or incorrect"
}

Be fair and understanding. If the user's answer demonstrates understanding of the core concepts, even with different wording, mark it as correct.
`;

  try {
    console.log('📤 Sending prompt to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert educational evaluator. Always respond with valid JSON only.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent evaluation
      max_tokens: 200,
    });
    
    const rawResponse = completion.choices[0]?.message?.content;
    console.log('📥 OpenAI Raw Response:', rawResponse);
    
    if (rawResponse) {
      const evaluation = JSON.parse(rawResponse);
      console.log('✅ Parsed Evaluation:', evaluation);
      return {
        isCorrect: evaluation.isCorrect,
        confidence: evaluation.confidence,
        feedback: evaluation.feedback
      };
    } else {
      throw new Error('AI did not return a valid response.');
    }
  } catch (error) {
    console.error('❌ OpenAI evaluation failed:', error);
    throw error;
  }
}
*/

/**
 * Fallback evaluation using simple keyword matching
 * @param userAnswer - The user's submitted answer
 * @param correctAnswers - Array of correct answers
 * @returns AIEvaluationResult - Fallback evaluation result
 */
export function fallbackEvaluation(
  userAnswer: string, 
  correctAnswers: string[]
): AIEvaluationResult {
  console.log('🔄 Using fallback evaluation...');
  
  const userAnswerLower = userAnswer.toLowerCase();
  const isCorrect = correctAnswers.some(ans => {
    const ansLower = ans.toLowerCase();
    const keyWords = ansLower.split(' ').filter(word => word.length > 3);
    return keyWords.some(word => userAnswerLower.includes(word));
  });
  
  return {
    isCorrect,
    confidence: 0.5,
    feedback: "AI evaluation unavailable. Using fallback method."
  };
} 
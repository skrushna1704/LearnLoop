const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: __dirname + '/../.env' });

// Define the Quiz Question Schema inline to avoid import issues
const quizQuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  question: { type: String, required: true },
  options: [{
    id: { type: String, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  explanation: { type: String, required: true },
  interview_tip: { type: String, default: null },
  references: [{ type: String }],
  timeLimit: { type: Number, required: true },
  points: { type: Number, required: true },
  slug: { type: String, required: true }
});

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables');
}

async function importQuizQuestions() {
  try {
    console.log('🚀 Starting quiz import process...');
    console.log('📡 Attempting to connect to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Read the JSON file
    const jsonPath = path.join(__dirname, '../src/db/quiz_mode_que-ans.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const questions = JSON.parse(jsonData);

    console.log(`📖 Found ${questions.length} questions in JSON file`);

    // Clear existing quiz questions
    await QuizQuestion.deleteMany({});
    console.log('🗑️  Cleared existing quiz questions');

    // Insert in batches to avoid memory issues (following the same pattern as practice import)
    const batchSize = 100;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      await QuizQuestion.insertMany(batch);
      console.log(`📦 Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(questions.length / batchSize)}`);
    }

    console.log('✅ Successfully imported all quiz questions!');

    // Display statistics
    const difficultyStats = {};
    const categoryStats = {};
    
    questions.forEach(q => {
      difficultyStats[q.difficulty] = (difficultyStats[q.difficulty] || 0) + 1;
      categoryStats[q.category] = (categoryStats[q.category] || 0) + 1;
    });

    console.log('\n📊 Import Summary:');
    console.log(`Total questions: ${questions.length}`);
    console.log(`ID Range: ${questions[0].id} - ${questions[questions.length - 1].id}`);
    
    console.log('\nDifficulty Distribution:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      console.log(`  ${difficulty}: ${count} questions`);
    });

    console.log('\nCategory Distribution:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} questions`);
    });

  } catch (error) {
    console.error('❌ Error importing quiz questions:', error);
    console.error('Error details:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } finally {
    try {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    } catch (disconnectError) {
      console.log('⚠️  Error during disconnect:', disconnectError.message);
    }
  }
}

// Run the import
importQuizQuestions(); 
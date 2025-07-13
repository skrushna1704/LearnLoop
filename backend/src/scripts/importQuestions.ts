import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Question } from '../models/Practice';

dotenv.config({ path: __dirname + '/../../.env' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables');
}

async function importQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Read the JSON file
    const jsonPath = path.join(__dirname, '../db/javascript_krushna_unique_slugs_with_examples.json');
    const questionsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log(`Found ${questionsData.length} questions to import`);

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Transform and insert questions
    const questionsToInsert = questionsData.map((q: any) => ({
      id: q.id,
      title: q.title,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      answer: q.answer,
      interview_tip: q.interview_tip || null,
      references: q.references || [],
      slug: q.slug,
      example: q.example
    }));

    // Insert in batches to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < questionsToInsert.length; i += batchSize) {
      const batch = questionsToInsert.slice(i, i + batchSize);
      await Question.insertMany(batch);
      console.log(`Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(questionsToInsert.length / batchSize)}`);
    }

    console.log('✅ Successfully imported all questions!');
    
    // Print summary
    const categories = await Question.distinct('category');
    console.log('\n📊 Import Summary:');
    console.log(`Total questions: ${questionsToInsert.length}`);
    console.log(`Categories: ${categories.join(', ')}`);
    
    for (const category of categories) {
      const count = await Question.countDocuments({ category });
      console.log(`${category}: ${count} questions`);
    }

  } catch (error) {
    console.error('❌ Error importing questions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the import
importQuestions(); 
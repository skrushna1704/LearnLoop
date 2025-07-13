// Usage: node backend/scripts/add_dsa_examples.js
require('dotenv').config({ path: __dirname + '/../.env' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set. Please check your .env file or environment variables.');
}
const DB_NAME = 'learnloop'; // update if needed
const COLLECTION = 'questions'; // update if needed

async function addExamplesToDSAQuestions() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // Find all DSA questions
    const dsaQuestions = await collection.find({ category: 'DSA' }).toArray();
    console.log(`Found ${dsaQuestions.length} DSA questions.`);

    for (const q of dsaQuestions) {
      // If already has an example, skip or update as needed
      if (q.example && q.example.trim() !== '') continue;
      // Set a default example (customize as needed)
      const defaultExample = `Input: ...\nOutput: ...\nExplanation: ...`;
      await collection.updateOne(
        { _id: q._id },
        { $set: { example: defaultExample } }
      );
      console.log(`Updated question: ${q.title}`);
    }
    console.log('Done updating DSA examples.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

addExamplesToDSAQuestions(); 
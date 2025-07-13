const fs = require('fs');
const path = require('path');

// Path to your JSON file
const jsonPath = path.join(__dirname, '../dist/db/javascript_krushna_unique_slugs.json');
const outputPath = path.join(__dirname, '../dist/db/javascript_krushna_unique_slugs_with_examples.json');

// Read and parse the JSON
const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Add example field to DSA questions if missing
const updated = questions.map(q => {
  if (q.category === 'DSA' && !q.example) {
    return {
      ...q,
      example: "Input: ...\nOutput: ...\nExplanation: ..."
    };
  }
  return q;
});

// Write to a new file
fs.writeFileSync(outputPath, JSON.stringify(updated, null, 2));
console.log(`Updated DSA questions with example field. Output: ${outputPath}`); 
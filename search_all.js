const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const searchStrings = [
  '@ai-sdk/google',
  'createGoogleGenerativeAI',
  'GOOGLE_GENERATIVE_AI_API_KEY',
  'Google Generative AI API key is missing',
  'generativelanguage.googleapis.com',
  'gemini',
];

const ignoreDirs = ['node_modules', '.next', '.git'];

function searchDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (true) {
        searchDirectory(fullPath);
      }
    } else {
      // Check if it's a binary file (very simple heuristic)
      const ext = path.extname(fullPath).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp'].includes(ext)) continue;
      
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        for (const searchString of searchStrings) {
          if (lines[i].includes(searchString)) {
            console.log(`FOUND "${searchString}" IN ${fullPath}:${i + 1}`);
            console.log(`  -> ${lines[i].trim()}`);
          }
        }
      }
    }
  }
}

console.log('--- STARTING AUDIT ---');
searchDirectory(path.join(rootDir, '.next'));
console.log('--- END OF AUDIT ---');

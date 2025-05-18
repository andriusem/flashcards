/**
 * Script to parse the phrasal_verbs file and generate gapFillData.js
 */
const fs = require('fs');
const path = require('path');

// Read the phrasal_verbs file
const phrasalVerbsPath = path.join(__dirname, '..', 'phrasal_verbs');
const phrasalVerbsContent = fs.readFileSync(phrasalVerbsPath, 'utf8');

// Parse the content to extract verbs and sentences
const exercises = [];
const allPhrasalVerbs = [];
const verbsByBaseVerb = {};

// Regular expressions for parsing
const verbSectionRegex = /\*\*(.*?)\*\*/g;
const sentenceRegex = /- "(.*?)" \((.*?)\)/g;
const sectionHeaderRegex = /## \d+\. ([A-Z]+)/g;

// Extract all phrasal verbs and group by base verb
let currentBaseVerb = '';
let sectionMatch;

// First, find all base verbs and their phrasal verb variations
while ((sectionMatch = sectionHeaderRegex.exec(phrasalVerbsContent)) !== null) {
  currentBaseVerb = sectionMatch[1].toLowerCase();
  verbsByBaseVerb[currentBaseVerb] = [];
  
  // Find the end of this section
  const sectionStartPos = sectionMatch.index + sectionMatch[0].length;
  let sectionEndPos = phrasalVerbsContent.indexOf('##', sectionStartPos);
  if (sectionEndPos === -1) {
    sectionEndPos = phrasalVerbsContent.length;
  }
  
  // Extract the section for this base verb
  const baseVerbSection = phrasalVerbsContent.substring(sectionStartPos, sectionEndPos);
  
  // Find all phrasal verbs in this section
  const verbRegexForSection = new RegExp(verbSectionRegex);
  let verbMatch;
  while ((verbMatch = verbRegexForSection.exec(baseVerbSection)) !== null) {
    const phrasalVerb = verbMatch[1].trim();
    verbsByBaseVerb[currentBaseVerb].push(phrasalVerb);
    allPhrasalVerbs.push(phrasalVerb);
  }
}

// Reset regex indices
verbSectionRegex.lastIndex = 0;
sectionHeaderRegex.lastIndex = 0;

// Now extract sentences and create exercises
let currentVerb = '';
let verbMatch2;

while ((verbMatch2 = verbSectionRegex.exec(phrasalVerbsContent)) !== null) {
  currentVerb = verbMatch2[1].trim();
  
  // Find the base verb for this phrasal verb
  let baseVerb = '';
  for (const [base, phrasals] of Object.entries(verbsByBaseVerb)) {
    if (phrasals.includes(currentVerb)) {
      baseVerb = base;
      break;
    }
  }
  
  // Find the end of this verb section
  const startPos = verbMatch2.index + verbMatch2[0].length;
  let endPos = phrasalVerbsContent.indexOf('**', startPos);
  if (endPos === -1) {
    endPos = phrasalVerbsContent.length;
  }
  
  // Extract the section for this verb
  const verbSection = phrasalVerbsContent.substring(startPos, endPos);
  
  // Find all sentences in this section
  let sentenceMatch;
  const sentenceRegexForSection = new RegExp(sentenceRegex);
  while ((sentenceMatch = sentenceRegexForSection.exec(verbSection)) !== null) {
    const sentenceWithGap = sentenceMatch[1].trim();
    const meaning = sentenceMatch[2].trim();
    
    // Create a full sentence by replacing the gap with the phrasal verb
    const fullSentence = sentenceWithGap.replace('___', currentVerb);
    
    // Get distractors from the same base verb
    const sameBaseVerbDistractors = getSameBaseVerbDistractors(currentVerb, baseVerb, verbsByBaseVerb);
    
    // Skip this exercise if we couldn't find enough distractors
    if (sameBaseVerbDistractors.length < 3) {
      continue;
    }
    
    exercises.push({
      verb: currentVerb,
      sentence: sentenceWithGap,
      fullSentence,
      meaning,
      distractors: sameBaseVerbDistractors,
      baseVerb
    });
  }
}

// Function to get distractors from the same base verb
function getSameBaseVerbDistractors(correctVerb, baseVerb, verbsByBaseVerb) {
  // Get all phrasal verbs with the same base verb
  const sameBaseVerbs = verbsByBaseVerb[baseVerb] || [];
  
  // Filter out the correct verb
  const availableVerbs = sameBaseVerbs.filter(verb => verb !== correctVerb);
  
  // We require at least 3 distractors to build a full options set (4 total)
  if (availableVerbs.length < 3) {
    return [];
  }
  
  // Shuffle and take the first 3
  return availableVerbs.sort(() => 0.5 - Math.random()).slice(0, 3);
}

// Generate the output JavaScript file
const outputContent = `// Gap Fill Exercise Data
// Generated from phrasal_verbs file on ${new Date().toISOString()}
// Total exercises: ${exercises.length}

export const gapFillExercises = ${JSON.stringify(exercises, null, 2)};`;

// Write the output to gapFillData.js
const outputPath = path.join(__dirname, '..', 'src', 'gapFillData.js');
fs.writeFileSync(outputPath, outputContent, 'utf8');

console.log(`Successfully generated ${exercises.length} exercises in ${outputPath}`);

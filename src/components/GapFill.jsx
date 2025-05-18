import React, { useState, useEffect } from 'react';
import OptionsBar from './OptionsBar';

/**
 * Component for a single gap fill exercise
 * 
 * @param {Object} props
 * @param {Object} props.exercise - The current exercise data
 * @param {Function} props.onNext - Function to call when moving to next exercise
 */
const GapFill = ({ exercise, onNext }) => {
  // State for tracking wrong selections and whether the exercise is solved
  const [wrongSelections, setWrongSelections] = useState([]);
  const [solved, setSolved] = useState(false);
  
  // Randomize the order of options (3 distractors + 1 correct)
  const [options, setOptions] = useState([]);
  
  useEffect(() => {
    // Reset state when exercise changes
    setWrongSelections([]);
    setSolved(false);
    
    // Randomize options order
    const allOptions = [...exercise.distractors, exercise.verb];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  }, [exercise]);
  
  // Handle option selection
  const handleSelect = (verb) => {
    if (solved) return;
    
    if (verb === exercise.verb) {
      // Correct answer
      setSolved(true);
      // No auto-advance - user must click Next button
    } else {
      // Wrong answer - add to wrong selections if not already there
      if (!wrongSelections.includes(verb)) {
        setWrongSelections([...wrongSelections, verb]);
      }
    }
  };
  
  // Render the sentence with or without the gap
  const renderSentence = () => {
    let sentenceHtml = '';
    
    if (solved) {
      // We need to create a sentence with the bold verb
      // First, find where the gap is in the sentence
      const gapIndex = exercise.sentence.indexOf('___');
      
      if (gapIndex !== -1) {
        const beforeGap = exercise.sentence.substring(0, gapIndex);
        const afterGap = exercise.sentence.substring(gapIndex + 3); // 3 is the length of '___'
        
        sentenceHtml = `${beforeGap}<strong>${exercise.verb}</strong>${afterGap}`;
      } else {
        // Fallback to the full sentence if gap not found
        sentenceHtml = exercise.fullSentence;
      }
    } else {
      sentenceHtml = exercise.sentence;
    }
    
    // Add the meaning in parentheses
    return `${sentenceHtml} <span class="meaning">(${exercise.meaning})</span>`;
  };
  
  return (
    <div className="gap-fill-container">
      <OptionsBar
        options={options}
        correctVerb={exercise.verb}
        wrongSelections={wrongSelections}
        isSolved={solved}
        onSelect={handleSelect}
      />
      
      <div 
        className="sentence"
        dangerouslySetInnerHTML={{ __html: renderSentence() }}
      />
      
      {solved && (
        <button className="next-btn" onClick={onNext}>
          Next →
        </button>
      )}
    </div>
  );
};

export default GapFill;

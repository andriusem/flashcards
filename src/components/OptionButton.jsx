import React from 'react';

/**
 * Button component for phrasal verb options
 * 
 * @param {Object} props
 * @param {string} props.verb - The phrasal verb text
 * @param {boolean} props.isWrong - Whether this option was incorrectly selected
 * @param {boolean} props.isCorrect - Whether this is the correct answer
 * @param {boolean} props.isSolved - Whether the exercise has been solved
 * @param {Function} props.onClick - Click handler function
 */
const OptionButton = ({ verb, isWrong, isCorrect, isSolved, onClick }) => {
  // Determine button class based on state
  let buttonClass = 'option-btn';
  
  if (isWrong) {
    buttonClass += ' wrong';
  } else if (isSolved && isCorrect) {
    buttonClass += ' correct';
  }
  
  if (isSolved) {
    buttonClass += ' disabled';
  }
  
  return (
    <button 
      className={buttonClass}
      onClick={() => onClick(verb)}
      disabled={isSolved}
    >
      {verb}
    </button>
  );
};

export default OptionButton;

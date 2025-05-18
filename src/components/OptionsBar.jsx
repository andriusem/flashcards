import React from 'react';
import OptionButton from './OptionButton';

/**
 * Component to display a horizontal bar of phrasal verb options
 * 
 * @param {Object} props
 * @param {Array<string>} props.options - Array of phrasal verb options to display
 * @param {string} props.correctVerb - The correct phrasal verb
 * @param {Array<string>} props.wrongSelections - Array of incorrectly selected verbs
 * @param {boolean} props.isSolved - Whether the exercise has been solved
 * @param {Function} props.onSelect - Handler for option selection
 */
const OptionsBar = ({ options, correctVerb, wrongSelections, isSolved, onSelect }) => {
  return (
    <div className="options-bar">
      {options.map((verb) => (
        <OptionButton
          key={verb}
          verb={verb}
          isWrong={wrongSelections.includes(verb)}
          isCorrect={verb === correctVerb}
          isSolved={isSolved}
          onClick={onSelect}
        />
      ))}
    </div>
  );
};

export default OptionsBar;

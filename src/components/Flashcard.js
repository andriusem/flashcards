import React, { useState } from 'react';
import '../styles/Flashcard.css';

const Flashcard = ({ card, language }) => {
  const [displayState, setDisplayState] = useState(0);
  // displayState: 0 = phrasal verb only, 1 = show synonym, 2 = show example

  const handleCardClick = () => {
    // Only advance to show synonym if currently showing just the verb
    if (displayState === 0) {
      setDisplayState(1);
    }
  };

  const handleShowExample = () => {
    // Only advance to show example if currently showing the synonym
    if (displayState === 1) {
      setDisplayState(2);
    }
  };


  const resetCard = () => {
    setDisplayState(0);
  };

  // Reset display state when card changes
  React.useEffect(() => {
    resetCard();
  }, [card]);

  return (
    // Attach handleCardClick to the main div
    <div className="flashcard" onClick={handleCardClick}>
      <div className="flashcard-content">
        <h2 className="phrasal-verb">{card.phrasalVerb}</h2>

        {displayState >= 1 && (
          <div className="synonym-container">
            <div className="synonym">
              <p>{language === 'en' ? card.synonym : `${card.synonym} (${card.synonym_fr})`}</p>
            </div>
            {displayState === 1 && (
              // Attach handleShowExample to the button
              <button className="show-btn" onClick={handleShowExample}>Show Example Sentence</button>
            )}
          </div>
        )}

        {displayState >= 2 && (
          <div className="example-container">
            <div className="example">
              <p>{card.example}</p>
              {language === 'fr' && <p className="translation">{card.example_fr}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;

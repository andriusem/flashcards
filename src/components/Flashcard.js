import React, { useState } from 'react';
import '../styles/Flashcard.css';

const Flashcard = ({ card, language }) => {
  const [displayState, setDisplayState] = useState(0);
  // displayState: 0 = phrasal verb only, 1 = show synonym, 2 = show example

  const handleClick = () => {
    setDisplayState((prevState) => (prevState + 1) % 3);
  };

  const resetCard = () => {
    setDisplayState(0);
  };

  // Reset display state when card changes
  React.useEffect(() => {
    resetCard();
  }, [card]);

  return (
    <div className="flashcard" onClick={handleClick}>
      <div className="flashcard-content">
        <h2 className="phrasal-verb">{card.phrasalVerb}</h2>

        {displayState >= 1 && (
          <div className="synonym-container">
            <div className="synonym">
              <p>{language === 'en' ? card.synonym : `${card.synonym} (${card.synonym_fr})`}</p>
            </div>
            {displayState === 1 && (
              <button className="show-btn">Show Example Sentence</button>
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

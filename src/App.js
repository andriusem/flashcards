import React, { useState, useEffect } from 'react';
import './App.css';
import { phrasalVerbs } from './data';
import Flashcard from './components/Flashcard';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState('en'); // 'en' for English, 'fr' for French
  const [cards, setCards] = useState([...phrasalVerbs]);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const shuffleCards = () => {
    // Create a shuffled copy of the cards
    const shuffled = [...phrasalVerbs].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="app">
      <div className="language-selector">
        <button 
          className={`language-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
        >
          🇬🇧 EN
        </button>
        <button 
          className={`language-btn ${language === 'fr' ? 'active' : ''}`}
          onClick={() => setLanguage('fr')}
        >
          🇫🇷 FR
        </button>
      </div>
      
      <div className="flashcard-container">
        <Flashcard 
          card={cards[currentIndex]} 
          language={language}
        />
      </div>

      <div className="navigation">
        <button className="nav-btn prev" onClick={goToPrevious}>
          &lt;
        </button>
        <span className="progress-counter">
          {currentIndex + 1} of {cards.length}
        </span>
        <button className="nav-btn next" onClick={goToNext}>
          &gt;
        </button>
      </div>
      
      <button className="shuffle-btn" onClick={shuffleCards}>
        Shuffle
      </button>
    </div>
  );
}

export default App;

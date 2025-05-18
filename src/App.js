import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import './styles/gapFill.css';
import { gapFillExercises } from './gapFillData';
import GapFill from './components/GapFill';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exercises, setExercises] = useState([...gapFillExercises]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? exercises.length - 1 : prevIndex - 1
    );
  }, [exercises.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === exercises.length - 1 ? 0 : prevIndex + 1
    );
  }, [exercises.length]);

  const shuffleExercises = () => {
    // Create a shuffled copy of the exercises
    const shuffled = [...gapFillExercises].sort(() => Math.random() - 0.5);
    setExercises(shuffled);
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
  }, [goToPrevious, goToNext]);

  return (
    <div className="app">
      
      <div className="gap-fill-wrapper">
        <GapFill 
          exercise={exercises[currentIndex]} 
          onNext={goToNext}
        />
      </div>

      <div className="navigation">
        <button className="nav-btn prev" onClick={goToPrevious}>
          &lt;
        </button>
        <span className="progress-counter">
          {currentIndex + 1} of {exercises.length}
        </span>
        <button className="nav-btn next" onClick={goToNext}>
          &gt;
        </button>
      </div>
      
      <button className="shuffle-btn" onClick={shuffleExercises}>
        Shuffle
      </button>
    </div>
  );
}

export default App;

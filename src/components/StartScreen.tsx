import React, { useState } from "react";
import ScoreHistory from "./ScoreHistory";

interface StartScreenProps {
  onStart: () => void;
  scores: number[];
  bestScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  scores,
  bestScore,
}) => {
  const [showScoreHistory, setShowScoreHistory] = useState(false);

  return (
    <div className="start-screen">
      <h1>Welcome to Actors Quiz</h1>
      <div className="start-buttons">
        <button onClick={onStart} className="start-button">
          Start Quiz
        </button>
        <button
          onClick={() => setShowScoreHistory(true)}
          className="score-history-button"
        >
          View Score History
        </button>
      </div>
      {showScoreHistory && (
        <ScoreHistory
          scores={scores}
          bestScore={bestScore}
          onClose={() => setShowScoreHistory(false)}
        />
      )}
    </div>
  );
};

export default StartScreen;

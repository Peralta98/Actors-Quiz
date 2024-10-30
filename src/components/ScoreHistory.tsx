import React from "react";

interface ScoreHistoryProps {
  scores: number[];
  bestScore: number;
  onClose: () => void;
}

const ScoreHistory: React.FC<ScoreHistoryProps> = ({
  scores,
  bestScore,
  onClose,
}) => {
  return (
    <div className="score-history-modal">
      <div className="score-history-content">
        <h2>Score History</h2>
        <div className="best-score">
          <h3>Best Score</h3>
          <p className="best-score-value">{bestScore} points</p>
        </div>
        <div className="scores-list">
          <h3>Latest Scores</h3>
          {scores.length > 0 ? (
            <div className="scores-scroll-container">
              <ul>
                {scores.map((score, index) => (
                  <li key={index}>
                    Game {scores.length - index}: {score} points
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No games played yet</p>
          )}
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ScoreHistory;

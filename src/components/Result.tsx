import React from "react";

interface AnswerRecord {
  question: {
    id: number;
    name: string;
    gender: string;
    image: string;
  };
  userAnswer: string;
  isCorrect: boolean;
}

interface ResultProps {
  score: number;
  total: number;
  onRestart: () => void;
  answerRecords: AnswerRecord[];
  bestScore: number;
  onHome: () => void;
}

const Result: React.FC<ResultProps> = ({
  score,
  total,
  onRestart,
  answerRecords,
  bestScore,
  onHome,
}) => {
  const correctAnswers = score / 100;
  const percentage = Math.round((correctAnswers / total) * 100);
  const incorrectAnswers = answerRecords.filter((record) => !record.isCorrect);
  const isNewBestScore = score > bestScore;

  return (
    <div className="result-container">
      <h2>Final Result</h2>
      <div className="score-summary">
        <p>
          You got {correctAnswers} out of {total} questions correct (
          {percentage}
          %).
        </p>
        <p className="points">Total Score: {score} points</p>
        {isNewBestScore && (
          <p className="new-best-score">🎉 New Best Score! 🎉</p>
        )}
      </div>
      {incorrectAnswers.length > 0 && (
        <div className="incorrect-answers">
          <h3>Incorrect Answers:</h3>
          {incorrectAnswers.map((record, index) => (
            <div key={index} className="incorrect-answer">
              <img
                src={record.question.image}
                alt={record.question.name}
                className="actor-image-small"
              />
              <div className="answer-text">
                <p>
                  Your answer:{" "}
                  <span className="incorrect-name">{record.userAnswer}</span>
                </p>
                <p>
                  Correct answer:{" "}
                  <span className="correct-name">{record.question.name}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="result-buttons">
        <button onClick={onRestart} className="start-button">
          Play Again
        </button>
        <button onClick={onHome} className="score-history-button">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Result;

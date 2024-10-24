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
}

const Result: React.FC<ResultProps> = ({
  score,
  total,
  onRestart,
  answerRecords,
}) => {
  const percentage = Math.round((score / total) * 100);
  const incorrectAnswers = answerRecords.filter((record) => !record.isCorrect);

  return (
    <div className="result-container">
      <h2>Final Result</h2>
      <p>
        You got {score} out of {total} questions correct ({percentage}%).
      </p>
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
                <p>Your answer: {record.userAnswer}</p>
                <p>Correct answer: {record.question.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={onRestart}>Restart Quiz</button>
    </div>
  );
};

export default Result;

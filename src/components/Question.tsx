import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

interface QuestionProps {
  question: {
    image: string;
    options: string[];
    correct: string;
  };
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
  currentQuestionNumber: number;
  totalQuestions: number;
}

const Question: React.FC<QuestionProps> = ({
  question,
  onAnswer,
  currentQuestionNumber,
  totalQuestions,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option: string) => {
    setSelectedAnswer(option);
    setShowResult(true);
    const isCorrect = option === question.correct;
    setTimeout(() => {
      onAnswer(isCorrect, option);
      setSelectedAnswer(null);
      setShowResult(false);
    }, 2000); // Increased to 2 seconds to give time to see the correct answer
  };

  const getButtonClass = (option: string) => {
    if (!showResult) return "option-button";
    if (option === question.correct) return "option-button correct";
    if (option === selectedAnswer) return "option-button incorrect";
    return "option-button";
  };

  return (
    <div className="question-container">
      <div className="question-number">
        Question {currentQuestionNumber}/{totalQuestions}
      </div>
      <div className="image-container">
        <img src={question.image} alt="Actor" className="actor-image" />
        <div className="image-overlay"></div>
        <div className="image-border"></div>
        {showResult && (
          <div
            className={`result-icon ${
              selectedAnswer === question.correct ? "correct" : "incorrect"
            }`}
          >
            <FontAwesomeIcon
              icon={selectedAnswer === question.correct ? faCheck : faXmark}
            />
          </div>
        )}
      </div>
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={showResult}
            className={getButtonClass(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;

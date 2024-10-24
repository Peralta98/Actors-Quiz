import { useState, useEffect } from "react";
import Question from "./Question";
import Result from "./Result";
import StartScreen from "./StartScreen";
import actorsData from "../data/actors.json";

interface Actor {
  id: number;
  name: string;
  gender: string;
  image: string;
}

interface AnswerRecord {
  question: Actor;
  userAnswer: string;
  isCorrect: boolean;
}

const Quiz = () => {
  const [questions, setQuestions] = useState<Actor[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);

  const loadQuestions = () => {
    const shuffled = [...actorsData.actors].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 3));
  };

  useEffect(() => {
    if (gameStarted) {
      loadQuestions();
    }
  }, [gameStarted]);

  const handleStart = () => {
    setGameStarted(true);
    setShowResult(false);
    setScore(0);
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (isCorrect: boolean, userAnswer: string) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnswerRecords([
      ...answerRecords,
      {
        question: questions[currentQuestionIndex],
        userAnswer,
        isCorrect,
      },
    ]);
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setShowResult(true);
    }
  };

  if (!gameStarted) {
    return <StartScreen onStart={handleStart} />;
  }

  if (showResult) {
    return (
      <Result
        score={score}
        total={questions.length}
        onRestart={handleStart}
        answerRecords={answerRecords}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const sameGenderActors = actorsData.actors.filter(
    (actor) =>
      actor.gender === currentQuestion.gender && actor.id !== currentQuestion.id
  );
  let shuffledOptions = [currentQuestion.name];
  while (shuffledOptions.length < 3 && sameGenderActors.length > 0) {
    const randomIndex = Math.floor(Math.random() * sameGenderActors.length);
    const randomActor = sameGenderActors[randomIndex];
    if (!shuffledOptions.includes(randomActor.name)) {
      shuffledOptions.push(randomActor.name);
      sameGenderActors.splice(randomIndex, 1);
    }
  }
  shuffledOptions = shuffledOptions.sort(() => 0.5 - Math.random());

  return (
    <Question
      key={currentQuestion.id}
      question={{
        image: currentQuestion.image,
        options: shuffledOptions,
        correct: currentQuestion.name,
      }}
      onAnswer={(isCorrect, selectedAnswer) =>
        handleAnswer(isCorrect, selectedAnswer)
      }
      currentQuestionNumber={currentQuestionIndex + 1}
      totalQuestions={questions.length}
    />
  );
};

export default Quiz;

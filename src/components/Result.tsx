import React from "react";

interface ResultProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ score, total, onRestart }) => {
  return (
    <div>
      <h2>Resultado</h2>
      <p>
        Você acertou {score} de {total} questões.
      </p>
      <button onClick={onRestart}>Reiniciar Quizz</button>
    </div>
  );
};

export default Result;

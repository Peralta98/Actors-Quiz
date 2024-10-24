import React from "react";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="start-screen">
      <h1>Bem-vindo ao Quizz de Atores</h1>
      <button onClick={onStart}>Iniciar Quizz</button>
    </div>
  );
};

export default StartScreen;

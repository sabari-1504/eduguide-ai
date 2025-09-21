import React, { useState } from 'react';

interface LogicGameProps {
  onComplete: (result: { correct: number; total: number }) => void;
}

const QUESTIONS = [
  {
    question: '2, 4, 6, ?',
    options: [8, 7, 10],
    answer: 8
  },
  {
    question: '1, 3, 6, 10, ?',
    options: [12, 15, 20],
    answer: 15
  },
  {
    question: '5, 10, 20, ?',
    options: [30, 35, 40],
    answer: 40
  },
  {
    question: '3, 6, 12, 24, ?',
    options: [36, 48, 50],
    answer: 48
  },
  {
    question: '7, 14, 21, ?',
    options: [24, 28, 35],
    answer: 28
  }
];

const LogicGame: React.FC<LogicGameProps> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleOption = (option: number) => {
    if (finished) return;
    if (option === QUESTIONS[current].answer) {
      setCorrect(c => c + 1);
    }
    if (current === QUESTIONS.length - 1) {
      setFinished(true);
      setTimeout(() => onComplete({ correct: option === QUESTIONS[current].answer ? correct + 1 : correct, total: QUESTIONS.length }), 1000);
    } else {
      setCurrent(c => c + 1);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Logic Game</h2>
      <p className="mb-4 text-gray-700">Choose the correct answer to complete the sequence. There are {QUESTIONS.length} questions.</p>
      {!finished && (
        <>
          <div className="mb-4 text-lg font-semibold">{QUESTIONS[current].question}</div>
          <div className="flex flex-col gap-4 items-center">
            {QUESTIONS[current].options.map(option => (
              <button
                key={option}
                className="w-32 py-2 rounded bg-blue-100 hover:bg-blue-300 text-blue-900 font-semibold shadow"
                onClick={() => handleOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
      {finished && (
        <div className="text-green-700 font-semibold text-lg mt-4">
          Game Over!<br />
          Correct: {correct} / {QUESTIONS.length}
        </div>
      )}
    </div>
  );
};

export default LogicGame; 
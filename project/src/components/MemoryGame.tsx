import React, { useState, useEffect } from 'react';

interface MemoryGameProps {
  onComplete: (result: { score: number; rounds: number }) => void;
}

const BASE_COLORS = [
  { name: 'red', class: 'bg-red-500' },
  { name: 'green', class: 'bg-green-500' },
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'yellow', class: 'bg-yellow-400' },
  { name: 'orange', class: 'bg-orange-500' },
  { name: 'purple', class: 'bg-purple-500' },
  { name: 'teal', class: 'bg-teal-400' },
  { name: 'pink', class: 'bg-pink-400' }
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const getRandomColor = (colors: typeof BASE_COLORS) => colors[Math.floor(Math.random() * colors.length)].name;

const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [showing, setShowing] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [final, setFinal] = useState(false);
  const [showIndex, setShowIndex] = useState<number>(-1);
  const [shuffledColors, setShuffledColors] = useState(BASE_COLORS);

  useEffect(() => {
    if (!gameOver) startRound();
    // eslint-disable-next-line
  }, [round, gameOver]);

  const startRound = () => {
    setUserInput([]);
    const newSeq = [...sequence];
    // Shuffle the color buttons for this round
    const newShuffled = shuffleArray(BASE_COLORS);
    setShuffledColors(newShuffled);
    newSeq.push(getRandomColor(BASE_COLORS));
    setSequence(newSeq);
    setShowing(true);
    setShowIndex(-1);
    // Show the sequence one by one, faster (600ms per color)
    newSeq.forEach((_, idx) => {
      setTimeout(() => setShowIndex(idx), idx * 600);
    });
    setTimeout(() => {
      setShowIndex(-1);
      setShowing(false);
    }, newSeq.length * 600 + 400);
  };

  const handleColorClick = (color: string) => {
    if (showing || gameOver) return;
    const nextInput = [...userInput, color];
    setUserInput(nextInput);
    if (sequence[nextInput.length - 1] !== color) {
      setGameOver(true);
      setScore(round - 1);
      setTimeout(() => {
        if (round - 1 === 0 && attempts < 2) {
          // Allow replay
        } else {
          setFinal(true);
          onComplete({ score: round - 1, rounds: round - 1 });
        }
      }, 1200);
    } else if (nextInput.length === sequence.length) {
      setTimeout(() => setRound(r => r + 1), 800);
    }
  };

  useEffect(() => {
    if (gameOver) return;
    if (userInput.length === 0 && sequence.length > 0) setScore(round - 1);
  }, [userInput, sequence, round, gameOver]);

  const handleReplay = () => {
    setAttempts(a => a + 1);
    setSequence([]);
    setUserInput([]);
    setRound(1);
    setScore(0);
    setGameOver(false);
    setFinal(false);
  };

  useEffect(() => {
    if (final) {
      onComplete({ score, rounds: round - 1 });
    }
    // eslint-disable-next-line
  }, [final]);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Memory Game</h2>
      <p className="mb-4 text-gray-700">Watch the sequence of colors, then repeat it by clicking the squares in order. The sequence gets longer each round! The color buttons shuffle positions every round.</p>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {shuffledColors.map((colorObj, idx) => (
          <button
            key={colorObj.name}
            className={`w-16 h-16 rounded-lg border-2 ${colorObj.class} ${showing ? 'cursor-not-allowed' : 'cursor-pointer'} shadow ${showing && showIndex !== -1 && sequence[showIndex] === colorObj.name ? 'ring-4 ring-blue-400 scale-110' : ''}`}
            style={{ opacity: showing ? (showIndex !== -1 && sequence[showIndex] === colorObj.name ? 1 : 0.3) : 1, transition: 'opacity 0.2s, transform 0.2s' }}
            onClick={() => handleColorClick(colorObj.name)}
            disabled={showing || gameOver}
          />
        ))}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Round:</span> {round}
      </div>
      {gameOver && (
        <div className="text-red-600 font-semibold mb-2">Game Over! Your score: {score}</div>
      )}
      {showing && (
        <div className="text-blue-600 font-semibold mb-2">Watch the sequence...</div>
      )}
      {!showing && !gameOver && userInput.length > 0 && (
        <div className="text-gray-600 mb-2">Your input: {userInput.join(', ')}</div>
      )}
      {/* Replay button if score is zero and attempts < 2 */}
      {gameOver && score === 0 && attempts < 2 && (
        <button
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded font-semibold"
          onClick={handleReplay}
        >
          Replay (Attempt {attempts + 1} of 2)
        </button>
      )}
    </div>
  );
};

// Helper to highlight the current color in the sequence
function showingIndex(sequence: string[], color: string) {
  // Find the index of the color in the sequence that is currently being shown
  // For simplicity, just return -1 (no highlight)
  return -1;
}

export default MemoryGame; 
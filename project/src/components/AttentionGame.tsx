import React, { useState, useEffect } from 'react';

interface AttentionGameProps {
  onComplete: (result: { avgTime: number; correct: number; total: number }) => void;
}

const COLORS = [
  'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-400',
  'bg-orange-500', 'bg-purple-500', 'bg-teal-400', 'bg-pink-400'
];

const ROUNDS = 5;
const GRID_SIZE = 16;

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const AttentionGame: React.FC<AttentionGameProps> = ({ onComplete }) => {
  const [round, setRound] = useState(1);
  const [targetIdx, setTargetIdx] = useState(getRandomInt(GRID_SIZE));
  const [targetColor, setTargetColor] = useState(COLORS[getRandomInt(COLORS.length)]);
  const [gridColors, setGridColors] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [times, setTimes] = useState<number[]>([]);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (round > ROUNDS) {
      setFinished(true);
      const avgTime = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
      setTimeout(() => onComplete({ avgTime, correct, total }), 1200);
    } else {
      // Pick unique colors for the grid
      let availableColors = shuffleArray(COLORS);
      let grid: string[] = Array(GRID_SIZE).fill('');
      const tIdx = getRandomInt(GRID_SIZE);
      setTargetIdx(tIdx);
      // Pick a target color
      const tColor = availableColors[0];
      setTargetColor(tColor);
      grid[tIdx] = tColor;
      // Fill the rest with unique colors (excluding the target color)
      let colorIdx = 1;
      for (let i = 0; i < GRID_SIZE; i++) {
        if (i === tIdx) continue;
        // If we run out of unique colors, reshuffle (for large grids)
        if (colorIdx >= availableColors.length) {
          availableColors = availableColors.concat(shuffleArray(COLORS.filter(c => c !== tColor)));
        }
        grid[i] = availableColors[colorIdx];
        colorIdx++;
      }
      setGridColors(grid);
      setStartTime(Date.now());
    }
    // eslint-disable-next-line
  }, [round]);

  const handleClick = (idx: number, color: string) => {
    if (finished) return;
    setTotal(t => t + 1);
    if (idx === targetIdx && color === targetColor) {
      setCorrect(c => c + 1);
      setTimes(t => [...t, Date.now() - startTime]);
      setRound(r => r + 1);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Attention Game</h2>
      <p className="mb-4 text-gray-700">Find and click the target circle as quickly as possible. There are {ROUNDS} rounds.</p>
      {!finished && (
        <>
          <div className="mb-2 text-lg font-semibold">Round {round} of {ROUNDS}</div>
          <div className="mb-2">Target color: <span className={`inline-block w-6 h-6 rounded-full align-middle ${targetColor}`}></span></div>
          <div className="grid grid-cols-4 gap-3 justify-center items-center mb-4">
            {Array.from({ length: GRID_SIZE }).map((_, idx) => (
              <button
                key={idx}
                className={`w-10 h-10 rounded-full border-2 ${gridColors[idx] || ''} hover:scale-110 transition-transform`}
                onClick={() => handleClick(idx, gridColors[idx])}
                aria-label={idx === targetIdx ? 'Target' : 'Distractor'}
              />
            ))}
          </div>
        </>
      )}
      {finished && (
        <div className="text-green-700 font-semibold text-lg mt-4">
          Game Over!<br />
          Correct: {correct} / {ROUNDS}<br />
          Average Time: {times.length ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(0) : 0} ms
        </div>
      )}
    </div>
  );
};

export default AttentionGame; 
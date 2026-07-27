import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

const HOLE_COUNT = 9;
const GAME_SECONDS = 30;

const WhackAMole: React.FC = () => {
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [status, setStatus] = useState<'idle' | 'playing' | 'over'>('idle');
  const [whacked, setWhacked] = useState<number | null>(null);
  const popTimeout = useRef<ReturnType<typeof setTimeout>>();

  const popRandomHole = useCallback(() => {
    setActiveHole((prev) => {
      let next = Math.floor(Math.random() * HOLE_COUNT);
      while (next === prev) next = Math.floor(Math.random() * HOLE_COUNT);
      return next;
    });
  }, []);

  useEffect(() => {
    if (status !== 'playing') return;

    const scheduleNext = () => {
      const delay = 500 + Math.random() * 500;
      popTimeout.current = setTimeout(() => {
        popRandomHole();
        scheduleNext();
      }, delay);
    };
    popRandomHole();
    scheduleNext();

    return () => { if (popTimeout.current) clearTimeout(popTimeout.current); };
  }, [status, popRandomHole]);

  useEffect(() => {
    if (status !== 'playing') return;
    if (timeLeft <= 0) {
      setStatus('over');
      setActiveHole(null);
      setBest((b) => Math.max(b, score));
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, timeLeft, score]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setStatus('playing');
  };

  const whack = (i: number) => {
    if (status !== 'playing' || i !== activeHole) return;
    setScore((s) => s + 1);
    setWhacked(i);
    setActiveHole(null);
    setTimeout(() => setWhacked(null), 150);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="flex justify-center gap-8 mb-2 text-sm font-semibold text-gray-700">
        <span>Score: <span className="text-amber-700">{score}</span></span>
        <span>Best: <span className="text-amber-700">{best}</span></span>
        <span>Time: <span className="text-amber-700">{timeLeft}s</span></span>
      </div>
      <p className="text-center text-xs text-gray-500 mb-6">Whack the knots as they pop out of the timber</p>

      <div className="relative">
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {Array.from({ length: HOLE_COUNT }).map((_, i) => (
            <button
              key={i}
              onClick={() => whack(i)}
              disabled={status !== 'playing'}
              className="aspect-square rounded-full relative overflow-hidden border-4 border-amber-800"
              style={{
                background: 'radial-gradient(circle at 50% 40%, #78350f 0%, #451a03 70%)',
              }}
            >
              {activeHole === i && (
                <div
                  className={`absolute inset-3 rounded-full bg-gradient-to-br from-orange-100 to-amber-200 border-2 border-amber-500 shadow-lg transition-transform ${
                    whacked === i ? 'scale-0' : 'scale-100'
                  }`}
                  style={{
                    backgroundImage:
                      'repeating-radial-gradient(circle at 50% 50%, rgba(120,53,15,0.35) 0px, rgba(120,53,15,0.35) 2px, transparent 2px, transparent 6px)',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {status !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-lg">
            <p className="text-gray-900 font-bold text-lg mb-3">
              {status === 'over' ? `Time's up — ${score} knots whacked!` : 'Ready to whack some knots?'}
            </p>
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
            >
              <RotateCcw size={16} /> {status === 'over' ? 'Play again' : 'Start'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhackAMole;

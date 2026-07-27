import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

const GRID = 20;
const CELL = 20;
const CANVAS_SIZE = GRID * CELL;
const TICK_MS = 130;

type Point = { x: number; y: number };
type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const randomFood = (snake: Point[]): Point => {
  let food: Point;
  do {
    food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
};

const Snake: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Dir>('RIGHT');
  const nextDirRef = useRef<Dir>('RIGHT');
  const foodRef = useRef<Point>({ x: 14, y: 10 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<'idle' | 'playing' | 'over'>('idle');

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#fefbf3';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = 'rgba(146,64,14,0.06)';
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(CANVAS_SIZE, i * CELL);
      ctx.stroke();
    }

    const f = foodRef.current;
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2.6, 0, Math.PI * 2);
    ctx.fill();

    snakeRef.current.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#92400e' : '#c2792d';
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    foodRef.current = randomFood(snakeRef.current);
    setScore(0);
    setStatus('playing');
    draw();
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (status !== 'playing') return;

    const interval = setInterval(() => {
      dirRef.current = nextDirRef.current;
      const snake = snakeRef.current;
      const head = snake[0];
      let next: Point = { ...head };
      if (dirRef.current === 'UP') next.y -= 1;
      if (dirRef.current === 'DOWN') next.y += 1;
      if (dirRef.current === 'LEFT') next.x -= 1;
      if (dirRef.current === 'RIGHT') next.x += 1;

      const hitWall = next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID;
      const hitSelf = snake.some((s) => s.x === next.x && s.y === next.y);

      if (hitWall || hitSelf) {
        setStatus('over');
        setBest((b) => Math.max(b, score));
        return;
      }

      const ateFood = next.x === foodRef.current.x && next.y === foodRef.current.y;
      const newSnake = [next, ...snake];
      if (ateFood) {
        setScore((s) => s + 10);
        foodRef.current = randomFood(newSnake);
      } else {
        newSnake.pop();
      }
      snakeRef.current = newSnake;
      draw();
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [status, draw, score]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      const current = dirRef.current;
      const opposite: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
      if (dir !== opposite[current]) nextDirRef.current = dir;
      if (status === 'idle' || status === 'over') resetGame();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, resetGame]);

  const setDirTouch = (dir: Dir) => {
    const opposite: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (dir !== opposite[dirRef.current]) nextDirRef.current = dir;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="flex justify-center gap-8 mb-4 text-sm font-semibold text-gray-700">
        <span>Score: <span className="text-amber-700">{score}</span></span>
        <span>Best: <span className="text-amber-700">{best}</span></span>
      </div>

      <div className="relative mx-auto" style={{ width: CANVAS_SIZE, maxWidth: '100%' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-2 border-amber-300 rounded-lg mx-auto block max-w-full"
          style={{ imageRendering: 'pixelated' }}
        />
        {status !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg">
            <p className="text-white font-bold text-lg mb-3">
              {status === 'over' ? `Game over — ${score} points` : 'Use arrow keys or WASD'}
            </p>
            <button
              onClick={resetGame}
              className="inline-flex items-center gap-2 bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
            >
              <RotateCcw size={16} /> {status === 'over' ? 'Play again' : 'Start'}
            </button>
          </div>
        )}
      </div>

      {/* Touch controls */}
      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto mt-6 sm:hidden">
        <div />
        <button onClick={() => setDirTouch('UP')} className="bg-amber-100 text-amber-800 rounded-lg py-3 font-bold">↑</button>
        <div />
        <button onClick={() => setDirTouch('LEFT')} className="bg-amber-100 text-amber-800 rounded-lg py-3 font-bold">←</button>
        <button onClick={() => setDirTouch('DOWN')} className="bg-amber-100 text-amber-800 rounded-lg py-3 font-bold">↓</button>
        <button onClick={() => setDirTouch('RIGHT')} className="bg-amber-100 text-amber-800 rounded-lg py-3 font-bold">→</button>
      </div>
    </div>
  );
};

export default Snake;

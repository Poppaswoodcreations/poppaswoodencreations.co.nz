import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

const WORDS = [
  'KAURI', 'GRAIN', 'KNOTS', 'OILED', 'LATHE', 'WOODS', 'CARVE',
  'DOWEL', 'PLANE', 'RESIN', 'BURLS', 'MITRE', 'TENON', 'BLOCK', 'SANDS',
];
const WORD_LENGTH = 5;
const MAX_ROWS = 6;
const QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

type LetterState = 'correct' | 'present' | 'absent' | 'empty';

const evaluateGuess = (guess: string, solution: string): LetterState[] => {
  const result: LetterState[] = Array(WORD_LENGTH).fill('absent');
  const solChars = solution.split('');
  const used = Array(WORD_LENGTH).fill(false);

  guess.split('').forEach((ch, i) => {
    if (ch === solChars[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  });
  guess.split('').forEach((ch, i) => {
    if (result[i] === 'correct') return;
    const idx = solChars.findIndex((c, j) => c === ch && !used[j]);
    if (idx !== -1) {
      result[i] = 'present';
      used[idx] = true;
    }
  });
  return result;
};

const WordGuess: React.FC = () => {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({});
  const [error, setError] = useState('');

  const newGame = useCallback(() => {
    setSolution(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]);
    setCurrent('');
    setStatus('playing');
    setLetterStates({});
    setError('');
  }, []);

  useEffect(() => { newGame(); }, [newGame]);

  const submitGuess = useCallback(() => {
    if (status !== 'playing') return;
    if (current.length !== WORD_LENGTH) {
      setError(`Word must be ${WORD_LENGTH} letters`);
      return;
    }
    setError('');
    const evalResult = evaluateGuess(current, solution);
    setLetterStates((prev) => {
      const next = { ...prev };
      current.split('').forEach((ch, i) => {
        const state = evalResult[i];
        const rank = { correct: 3, present: 2, absent: 1, empty: 0 };
        if (!next[ch] || rank[state] > rank[next[ch]]) next[ch] = state;
      });
      return next;
    });

    const nextGuesses = [...guesses, current];
    setGuesses(nextGuesses);
    setCurrent('');

    if (current === solution) {
      setStatus('won');
    } else if (nextGuesses.length >= MAX_ROWS) {
      setStatus('lost');
    }
  }, [current, solution, status, guesses]);

  const pressKey = useCallback((key: string) => {
    if (status !== 'playing') return;
    if (key === 'ENTER') { submitGuess(); return; }
    if (key === 'BACK') { setCurrent((c) => c.slice(0, -1)); setError(''); return; }
    if (/^[A-Z]$/.test(key) && current.length < WORD_LENGTH) {
      setCurrent((c) => c + key);
      setError('');
    }
  }, [status, current, submitGuess]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') return pressKey('ENTER');
      if (e.key === 'Backspace') return pressKey('BACK');
      if (/^[a-zA-Z]$/.test(e.key)) return pressKey(e.key.toUpperCase());
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pressKey]);

  const rows = Array.from({ length: MAX_ROWS }, (_, i) => {
    if (i < guesses.length) return { letters: guesses[i].split(''), states: evaluateGuess(guesses[i], solution), submitted: true };
    if (i === guesses.length) return { letters: current.split(''), states: [], submitted: false };
    return { letters: [], states: [], submitted: false };
  });

  const cellClass = (state?: LetterState) => {
    if (state === 'correct') return 'bg-green-600 border-green-700 text-white';
    if (state === 'present') return 'bg-amber-400 border-amber-500 text-white';
    if (state === 'absent') return 'bg-gray-400 border-gray-500 text-white';
    return 'bg-white border-gray-300 text-gray-900';
  };

  const keyClass = (key: string) => {
    const state = letterStates[key];
    if (state === 'correct') return 'bg-green-600 text-white';
    if (state === 'present') return 'bg-amber-400 text-white';
    if (state === 'absent') return 'bg-gray-300 text-gray-500';
    return 'bg-amber-50 text-amber-800 hover:bg-amber-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <p className="text-center text-xs text-gray-500 mb-4">Timber & workshop words — {WORD_LENGTH} letters, {MAX_ROWS} guesses</p>

      <div className="flex flex-col gap-2 items-center mb-4">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-2">
            {Array.from({ length: WORD_LENGTH }).map((_, ci) => (
              <div
                key={ci}
                className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center border-2 rounded font-bold text-lg uppercase ${
                  row.submitted ? cellClass(row.states[ci]) : cellClass()
                }`}
              >
                {row.letters[ci] || ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className={`text-center font-semibold min-h-[1.5rem] mb-4 ${status === 'won' ? 'text-green-700' : status === 'lost' ? 'text-red-700' : 'text-red-600'}`}>
        {status === 'won' && `Got it in ${guesses.length}! 🎉`}
        {status === 'lost' && `Out of guesses — it was ${solution}`}
        {status === 'playing' && error}
      </p>

      <div className="flex flex-col gap-1.5 max-w-md mx-auto mb-4">
        {QWERTY.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {i === 2 && (
              <button onClick={() => pressKey('ENTER')} className="px-2 py-2 rounded text-xs font-bold bg-amber-700 text-white">
                ENTER
              </button>
            )}
            {row.split('').map((key) => (
              <button
                key={key}
                onClick={() => pressKey(key)}
                className={`w-7 sm:w-9 py-2 rounded text-sm font-semibold transition-colors ${keyClass(key)}`}
              >
                {key}
              </button>
            ))}
            {i === 2 && (
              <button onClick={() => pressKey('BACK')} className="px-2 py-2 rounded text-xs font-bold bg-amber-700 text-white">
                ⌫
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={newGame}
          className="inline-flex items-center gap-2 bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
        >
          <RotateCcw size={16} /> New word
        </button>
      </div>
    </div>
  );
};

export default WordGuess;

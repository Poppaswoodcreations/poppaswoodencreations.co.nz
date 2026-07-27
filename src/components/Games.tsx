import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import Snake from './games/Snake';
import MemoryMatch from './games/MemoryMatch';
import WordGuess from './games/WordGuess';
import WhackAMole from './games/WhackAMole';

/* ---------------------------------------------
   Hangman data — drawn from Poppa's own world
--------------------------------------------- */
const WORDS: [string, string][] = [
  ['KAURI', 'One of the native timbers Poppa carves with'],
  ['RIMU', 'A reddish native timber used in the workshop'],
  ['MACROCARPA', 'A pale, fragrant timber grown across Northland'],
  ['REWAREWA', 'A native timber with striking grain'],
  ['TOTARA', 'A durable native timber, prized by carvers'],
  ['WHANGAREI', "The town where Poppa's workshop is based"],
  ['TIKIPUNGA', 'The suburb where the workshop sits'],
  ['MONTESSORI', "A teaching method many of Poppa's toys are made for"],
  ['WORKSHOP', 'Where every toy begins as a block of timber'],
  ['SANDPAPER', 'Used to smooth every edge before oiling'],
  ['ROCKING HORSE', 'A classic wooden toy, built to last generations'],
  ['PUZZLE', 'A wooden toy that teaches patience'],
  ['CHOPPING BOARD', 'A kitchenware item Poppa turns from native timber'],
  ['SPOON', 'A simple kitchen tool, carved by hand'],
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_WRONG = 6;

const HangmanFigure: React.FC<{ wrong: number }> = ({ wrong }) => (
  <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
    <line x1="15" y1="130" x2="90" y2="130" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
    <line x1="35" y1="130" x2="35" y2="15" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
    <line x1="35" y1="15" x2="95" y2="15" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
    <line x1="95" y1="15" x2="95" y2="30" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
    {wrong > 0 && <circle cx="95" cy="42" r="12" stroke="#92400e" strokeWidth="4" fill="none" />}
    {wrong > 1 && <line x1="95" y1="54" x2="95" y2="90" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />}
    {wrong > 2 && <line x1="95" y1="65" x2="75" y2="80" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />}
    {wrong > 3 && <line x1="95" y1="65" x2="115" y2="80" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />}
    {wrong > 4 && <line x1="95" y1="90" x2="78" y2="112" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />}
    {wrong > 5 && <line x1="95" y1="90" x2="112" y2="112" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />}
  </svg>
);

const Hangman: React.FC = () => {
  const [solution, setSolution] = useState('');
  const [hint, setHint] = useState('');
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);

  const newWord = useCallback(() => {
    const [word, h] = WORDS[Math.floor(Math.random() * WORDS.length)];
    setSolution(word);
    setHint(h);
    setGuessed(new Set());
    setWrong(0);
  }, []);

  useEffect(() => { newWord(); }, [newWord]);

  const solved = solution.length > 0 && solution.split('').every((ch) => ch === ' ' || guessed.has(ch));
  const lost = wrong >= MAX_WRONG;
  const over = solved || lost;

  const guessLetter = (letter: string) => {
    if (over || guessed.has(letter)) return;
    const next = new Set(guessed);
    next.add(letter);
    setGuessed(next);
    if (!solution.includes(letter)) setWrong((w) => w + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <HangmanFigure wrong={wrong} />

      <p className="text-center text-sm font-medium text-amber-700 mt-2 mb-1">Hint: {hint}</p>

      <p className="text-center font-bold text-2xl sm:text-3xl tracking-widest my-4 text-gray-900 break-all">
        {solution.split('').map((ch, i) => (ch === ' ' ? '  ' : guessed.has(ch) ? ch : '_')).join(' ')}
      </p>

      <p className={`text-center font-semibold min-h-[1.5rem] mb-4 ${solved ? 'text-green-700' : lost ? 'text-red-700' : ''}`}>
        {solved && `Nailed it — the word was ${solution}`}
        {lost && `Out of guesses — it was ${solution}`}
      </p>

      <div className="grid grid-cols-7 sm:grid-cols-9 gap-2 max-w-md mx-auto">
        {ALPHABET.map((letter) => {
          const isGuessed = guessed.has(letter);
          const isCorrect = isGuessed && solution.includes(letter);
          const isWrong = isGuessed && !solution.includes(letter);
          return (
            <button
              key={letter}
              onClick={() => guessLetter(letter)}
              disabled={isGuessed || over}
              className={`text-sm font-semibold py-2 rounded border transition-colors
                ${isCorrect ? 'bg-green-600 border-green-700 text-white' : ''}
                ${isWrong ? 'bg-red-700 border-red-800 text-white' : ''}
                ${!isGuessed ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100' : ''}
                ${over && !isGuessed ? 'opacity-40' : ''}
                disabled:cursor-default`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={newWord}
          className="inline-flex items-center gap-2 bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
        >
          <RotateCcw size={16} /> New word
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------
   Guess the Number
--------------------------------------------- */
const MAX_GUESSES = 10;

const GuessTheNumber: React.FC = () => {
  const [target, setTarget] = useState(0);
  const [guessCount, setGuessCount] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('Make your first guess');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [history, setHistory] = useState<{ value: number; result: 'hi' | 'lo' | 'win' }[]>([]);

  const newGame = useCallback(() => {
    setTarget(Math.floor(Math.random() * 1000) + 1);
    setGuessCount(0);
    setInput('');
    setFeedback('Make your first guess');
    setStatus('playing');
    setHistory([]);
  }, []);

  useEffect(() => { newGame(); }, [newGame]);

  const submitGuess = () => {
    if (status !== 'playing') return;
    const val = parseInt(input, 10);
    if (isNaN(val) || val < 1 || val > 1000) {
      setFeedback('Enter a number between 1 and 1000');
      return;
    }
    const count = guessCount + 1;
    setGuessCount(count);

    if (val === target) {
      setHistory((h) => [...h, { value: val, result: 'win' }]);
      setFeedback(`Got it! ${val} was the number, in ${count} guess${count > 1 ? 'es' : ''}`);
      setStatus('won');
      return;
    }

    const result = val > target ? 'hi' : 'lo';
    setHistory((h) => [...h, { value: val, result }]);

    if (count >= MAX_GUESSES) {
      setFeedback(`Out of guesses — it was ${target}`);
      setStatus('lost');
      return;
    }

    setFeedback(val > target ? 'Too high' : 'Too low');
    setInput('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <p className="text-center text-sm font-medium text-amber-700 mb-1">Pick a number between 1 and 1000</p>
      <p className="text-center text-xs text-gray-500 mb-6">
        Guess {Math.min(guessCount + 1, MAX_GUESSES)} of {MAX_GUESSES}
      </p>

      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        <input
          type="number"
          min={1}
          max={1000}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
          disabled={status !== 'playing'}
          placeholder="?"
          className="w-36 text-xl font-bold text-center border-2 border-amber-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          onClick={submitGuess}
          disabled={status !== 'playing'}
          className="bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-800 transition-colors disabled:opacity-50"
        >
          Guess
        </button>
      </div>

      <p className={`text-center font-bold text-xl min-h-[2rem] mb-4 ${status === 'won' ? 'text-green-700' : 'text-gray-900'}`}>
        {feedback}
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-[2rem]">
        {history.map((g, i) => (
          <span
            key={i}
            className={`text-xs font-semibold px-3 py-1 rounded-full
              ${g.result === 'win' ? 'bg-green-100 text-green-800' : ''}
              ${g.result === 'hi' ? 'bg-red-50 text-red-700' : ''}
              ${g.result === 'lo' ? 'bg-amber-50 text-amber-800' : ''}`}
          >
            {g.value}
          </span>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={newGame}
          className="inline-flex items-center gap-2 border border-amber-300 text-amber-800 px-6 py-2 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
        >
          <RotateCcw size={16} /> New number
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------
   Games page
--------------------------------------------- */
type TabKey = 'hangman' | 'gtn' | 'snake' | 'memory' | 'word' | 'whack';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'hangman', label: 'Hangman' },
  { key: 'gtn', label: 'Guess the Number' },
  { key: 'snake', label: 'Snake' },
  { key: 'memory', label: 'Memory Match' },
  { key: 'word', label: 'Word Guess' },
  { key: 'whack', label: 'Whack-a-Knot' },
];

const Games: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('hangman');

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">The Workshop Games</h1>
            <p className="text-gray-600">A few old favourites, whittled back into shape</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 sm:px-6 py-2 rounded-lg font-semibold border-2 text-sm sm:text-base transition-colors ${
                  tab === t.key
                    ? 'bg-amber-700 border-amber-700 text-white'
                    : 'border-amber-300 text-amber-800 hover:bg-amber-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'hangman' && <Hangman />}
          {tab === 'gtn' && <GuessTheNumber />}
          {tab === 'snake' && <Snake />}
          {tab === 'memory' && <MemoryMatch />}
          {tab === 'word' && <WordGuess />}
          {tab === 'whack' && <WhackAMole />}
        </div>
      </div>
    </>
  );
};

export default Games;

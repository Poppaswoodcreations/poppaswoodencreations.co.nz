import React, { useEffect, useState, useCallback } from 'react';
import { RotateCcw, Loader2 } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';

interface Card {
  key: string;
  productId: string;
  image: string;
  name: string;
  flipped: boolean;
  matched: boolean;
}

const PAIR_COUNT = 8;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const MemoryMatch: React.FC = () => {
  const { products, loading } = useProducts({ limit: 40 });
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedKeys, setFlippedKeys] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const buildDeck = useCallback(() => {
    const withImages = products.filter((p) => p.images && p.images.length > 0);
    if (withImages.length < PAIR_COUNT) return;

    const chosen = shuffle(withImages).slice(0, PAIR_COUNT);
    const deck: Card[] = chosen.flatMap((p, i) => ([
      { key: `${p.id}-a`, productId: p.id, image: p.images[0], name: p.name, flipped: false, matched: false },
      { key: `${p.id}-b`, productId: p.id, image: p.images[0], name: p.name, flipped: false, matched: false },
    ]));
    setCards(shuffle(deck));
    setFlippedKeys([]);
    setMoves(0);
    setLocked(false);
  }, [products]);

  useEffect(() => {
    if (!loading && products.length > 0) buildDeck();
  }, [loading, products, buildDeck]);

  const handleFlip = (key: string) => {
    if (locked) return;
    const card = cards.find((c) => c.key === key);
    if (!card || card.flipped || card.matched) return;

    const nextFlipped = [...flippedKeys, key];
    setCards((cs) => cs.map((c) => (c.key === key ? { ...c, flipped: true } : c)));

    if (nextFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [firstKey, secondKey] = nextFlipped;
      const first = cards.find((c) => c.key === firstKey);
      const second = card;

      if (first && first.productId === second.productId) {
        setTimeout(() => {
          setCards((cs) => cs.map((c) =>
            c.key === firstKey || c.key === secondKey ? { ...c, matched: true } : c
          ));
          setFlippedKeys([]);
          setLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((cs) => cs.map((c) =>
            c.key === firstKey || c.key === secondKey ? { ...c, flipped: false } : c
          ));
          setFlippedKeys([]);
          setLocked(false);
        }, 800);
      }
    } else {
      setFlippedKeys(nextFlipped);
    }
  };

  const won = cards.length > 0 && cards.every((c) => c.matched);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-10 flex flex-col items-center justify-center text-amber-700">
        <Loader2 className="animate-spin mb-3" size={28} />
        <p className="font-medium">Loading the toy shelf…</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-10 text-center text-gray-600">
        Not enough product photos loaded to play right now — try again shortly.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="flex justify-center gap-8 mb-5 text-sm font-semibold text-gray-700">
        <span>Moves: <span className="text-amber-700">{moves}</span></span>
        <span>Pairs: <span className="text-amber-700">{cards.filter((c) => c.matched).length / 2} / {PAIR_COUNT}</span></span>
      </div>

      {won && (
        <p className="text-center font-bold text-green-700 mb-4">
          Matched the whole shelf in {moves} moves! 🎉
        </p>
      )}

      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
        {cards.map((card) => (
          <button
            key={card.key}
            onClick={() => handleFlip(card.key)}
            disabled={card.flipped || card.matched}
            className="aspect-square rounded-lg overflow-hidden border-2 border-amber-300 relative"
            style={{ perspective: '600px' }}
          >
            {card.flipped || card.matched ? (
              <img
                src={card.image}
                alt={card.name}
                className={`w-full h-full object-cover ${card.matched ? 'opacity-60' : ''}`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={buildDeck}
          className="inline-flex items-center gap-2 bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
        >
          <RotateCcw size={16} /> New board
        </button>
      </div>
    </div>
  );
};

export default MemoryMatch;

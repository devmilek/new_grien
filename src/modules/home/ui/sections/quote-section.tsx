"use client";

import { QuoteIcon } from "lucide-react";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const quotes = [
  {
    content: "Gotowanie wymaga inspiracji, a nie tylko przepisów.",
    author: "Anonim",
  },
  {
    content: "Najlepsze dania powstają z serca, nie z książki kucharskiej.",
    author: "Gordon Ramsay",
  },
  {
    content: "Ludzie, którzy kochają jeść, są zawsze najlepszymi ludźmi.",
    author: "Julia Child",
  },
  {
    content: "Gotowanie to sztuka, a jedzenie to przyjemność.",
    author: "Auguste Escoffier",
  },
  {
    content:
      "Sekret wspaniałej kuchni? Dobre składniki, pasja i odrobina miłości.",
    author: "Jamie Oliver",
  },
];

const QUOTE_DURATION = 5000;

const QuoteSection = () => {
  const [currentQuote, setCurrentQuote] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
      setProgress(0);
    }, QUOTE_DURATION);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, QUOTE_DURATION / 50);

    return () => {
      clearInterval(intervalId);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div className="p-6 rounded-xl bg-emerald-50 border">
      <h3 className="font-display text-2xl">Cytat</h3>
      <div className="flex gap-4 mt-4">
        <QuoteIcon className="size-10 shrink-0 text-primary" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <p>{quotes[currentQuote].content}</p>
            <p
              className="
            font-medium"
            >
              - {quotes[currentQuote].author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* indicator */}
      <div className="h-1 bg-emerald-100 rounded-full mt-4">
        <motion.div
          className="bg-primary h-full rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export default QuoteSection;

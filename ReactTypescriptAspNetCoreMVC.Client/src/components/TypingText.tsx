// components/ui/TypingText.tsx
import { useEffect, useState } from "react";

type TypingTextProps = {
  words: string[];
  typingSpeed?: number; // ms per letter
  pauseDuration?: number; // ms after word completes
  className?: string; // optional styling
};

export const TypingText = ({ words, typingSpeed = 75, pauseDuration = 2500, className = "" }: TypingTextProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText.length < currentWord.length) {
      // Typing forward
      timeout = setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayText === currentWord) {
      // Word complete, pause before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && displayText.length > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length - 1));
      }, typingSpeed / 2);
    } else if (isDeleting && displayText.length === 0) {
      // Move to next word
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, words, currentWordIndex, typingSpeed, pauseDuration]);

  return (
    <span className={`whitespace-nowrap ${className}`}>
      {displayText}
      {/* <span className="animate-blink">|</span> */}
    </span>
  );
};

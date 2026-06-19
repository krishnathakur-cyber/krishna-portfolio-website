import { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  active?: boolean;
}

export default function TypingText({ text, speed = 50, delay = 0, active = true }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  // Handle typing sequence
  useEffect(() => {
    if (!active) return;
    
    let isMounted = true;
    let timeoutId: any;
    let intervalId: any;

    const startTyping = () => {
      let index = 0;
      setDisplayedText('');
      
      intervalId = setInterval(() => {
        if (!isMounted) return;
        
        setDisplayedText(text.slice(0, index + 1));
        index++;
        
        if (index >= text.length) {
          clearInterval(intervalId);
        }
      }, speed);
    };

    if (delay > 0) {
      timeoutId = setTimeout(startTyping, delay);
    } else {
      startTyping();
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, delay, active]);

  // Handle cursor blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 450);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <span className="inline-flex items-center font-mono">
      <span>{displayedText}</span>
      <span
        style={{ opacity: cursorVisible ? 1 : 0 }}
        className="inline-block w-1.5 h-[1.1em] ml-1 bg-emerald-400 align-middle shrink-0"
      />
    </span>
  );
}

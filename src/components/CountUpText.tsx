// components/CountUpText.tsx
'use client';

import { useEffect, useState } from 'react';

type CountUpTextProps = {
  target: number;
  duration?: number; // in ms
};

const CountUpText = ({ target, duration = 2000 }: CountUpTextProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`countup-${target}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [target, hasAnimated]);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
      let start: number | null = null;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const progressRatio = Math.min(progress / duration, 1);
        setCount(Math.floor(progressRatio * target));
        if (progress < duration) {
          requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };
      requestAnimationFrame(step);
    }
  }, [isVisible, target, duration, hasAnimated]);

  return (
    <span id={`countup-${target}`} className="text-4xl font-bold text-blue-600">
      {count.toLocaleString()}
    </span>
  );
};

export default CountUpText;
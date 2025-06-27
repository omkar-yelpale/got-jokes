import { useEffect, useState, useCallback } from 'react';
import { useSpring, animated, config } from 'react-spring';

interface CrowdTextProps {
  reaction: 'laughs' | 'roses' | 'tomatoes' | 'crickets';
  score: number;
  isActive: boolean;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  delay: number;
  color: string;
}

export default function CrowdText({ reaction, score, isActive }: CrowdTextProps) {
  const [texts, setTexts] = useState<FloatingText[]>([]);

  // Text options based on reaction type and score
  const getTexts = useCallback((reactionType: typeof reaction, scoreValue: typeof score) => {
    if (reactionType === 'laughs' && scoreValue > 80) {
      return [
        { text: 'LMFAO!', color: 'text-yellow-400' },
        { text: 'DYING!', color: 'text-yellow-300' },
        { text: 'HA HA HA!', color: 'text-yellow-500' },
        { text: '😂😂😂', color: 'text-yellow-400' },
        { text: 'GENIUS!', color: 'text-pink-400' },
      ];
    } else if (reactionType === 'laughs') {
      return [
        { text: 'LOL!', color: 'text-yellow-400' },
        { text: 'HAHA!', color: 'text-yellow-300' },
        { text: 'Good one!', color: 'text-green-400' },
        { text: '😄', color: 'text-yellow-400' },
      ];
    } else if (reactionType === 'roses') {
      return [
        { text: 'Nice!', color: 'text-pink-400' },
        { text: 'Not bad!', color: 'text-pink-300' },
        { text: 'Keep going!', color: 'text-purple-400' },
        { text: '👏', color: 'text-pink-400' },
        { text: 'Decent!', color: 'text-purple-300' },
      ];
    } else if (reactionType === 'tomatoes') {
      return [
        { text: 'BOO!', color: 'text-red-500' },
        { text: 'NEXT!', color: 'text-red-400' },
        { text: 'Yikes...', color: 'text-orange-500' },
        { text: '👎', color: 'text-red-500' },
        { text: 'Try again!', color: 'text-orange-400' },
      ];
    } else {
      return [
        { text: '...', color: 'text-gray-400' },
        { text: '🦗', color: 'text-gray-500' },
        { text: '*silence*', color: 'text-gray-400' },
        { text: 'Um...', color: 'text-gray-500' },
      ];
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      setTexts([]);
      return;
    }

    const textOptions = getTexts(reaction, score);
    
    // Generate 5-8 floating texts
    const textCount = 5 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < textCount; i++) {
      const textOption = textOptions[Math.floor(Math.random() * textOptions.length)];
      const text: FloatingText = {
        id: Date.now() + i,
        text: textOption.text,
        color: textOption.color,
        x: 10 + Math.random() * 80, // Random x position (10-90%)
        y: 30 + Math.random() * 40, // Random y position (30-70%)
        delay: i * 200, // Stagger appearance
      };
      
      setTimeout(() => {
        setTexts(prev => [...prev, text]);
      }, text.delay);
    }

    // Clear texts after animation
    const clearTimer = setTimeout(() => {
      setTexts([]);
    }, 4000);

    return () => clearTimeout(clearTimer);
  }, [isActive, reaction, score, getTexts]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {texts.map(text => (
        <FloatingTextItem key={text.id} {...text} />
      ))}
    </div>
  );
}

function FloatingTextItem({ text, x, y, color }: FloatingText) {
  const animation = useSpring({
    from: { 
      opacity: 0,
      transform: `translate(${x}vw, ${y}vh) scale(0)`,
    },
    to: async (next) => {
      await next({ 
        opacity: 1, 
        transform: `translate(${x}vw, ${y}vh) scale(1.2)` 
      });
      await next({ 
        opacity: 1, 
        transform: `translate(${x}vw, ${y}vh) scale(1)` 
      });
      await next({ 
        opacity: 0, 
        transform: `translate(${x}vw, ${y - 20}vh) scale(0.8)` 
      });
    },
    config: config.wobbly,
  });

  return (
    <animated.div 
      style={animation}
      className={`absolute text-2xl md:text-3xl font-bold ${color} drop-shadow-lg`}
    >
      {text}
    </animated.div>
  );
}
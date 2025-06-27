import { useEffect, useState } from 'react';
import { useSpring, animated, config } from 'react-spring';

interface ReactionAnimationProps {
  reaction: 'laughs' | 'roses' | 'tomatoes' | 'crickets';
  isActive: boolean;
  onComplete?: () => void;
}

interface FlyingItem {
  id: number;
  x: number;
  y: number;
  rotation: number;
  emoji: string;
}

export default function ReactionAnimation({ reaction, isActive, onComplete }: ReactionAnimationProps) {
  const [items, setItems] = useState<FlyingItem[]>([]);
  const [showMainEmoji, setShowMainEmoji] = useState(false);

  // Main emoji based on reaction
  const mainEmoji = {
    laughs: '😂',
    roses: '🌹',
    tomatoes: '🍅',
    crickets: '🦗'
  }[reaction];

  // Generate flying items when active
  useEffect(() => {
    if (!isActive) {
      setItems([]);
      setShowMainEmoji(false);
      return;
    }

    setShowMainEmoji(true);
    
    // Generate multiple items for roses/tomatoes
    if (reaction === 'roses' || reaction === 'tomatoes') {
      const itemCount = reaction === 'roses' ? 8 : 12; // More tomatoes for negative
      
      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
          const item: FlyingItem = {
            id: Date.now() + i,
            x: Math.random() * 100 - 50, // Random x position
            y: 100, // Start from bottom
            rotation: Math.random() * 720 - 360, // Random rotation
            emoji: reaction === 'roses' ? '🌹' : '🍅'
          };
          setItems(prev => [...prev, item]);
        }, i * 100); // Stagger the throws
      }
    }

    // Complete animation after delay
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isActive, reaction, onComplete]);

  // Main emoji animation (for laughs and crickets)
  const mainEmojiAnimation = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { 
      scale: showMainEmoji ? [0, 1.5, 1] : 0,
      opacity: showMainEmoji ? 1 : 0 
    },
    config: config.wobbly
  });

  // Background flash animation
  const flashAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: isActive ? [0, 0.3, 0] : 0 },
    config: { duration: 500 }
  });

  // Remove items after animation
  useEffect(() => {
    if (items.length > 0) {
      const timer = setTimeout(() => {
        setItems(prev => prev.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [items]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Background flash */}
      <animated.div 
        style={flashAnimation}
        className={`absolute inset-0 ${
          reaction === 'laughs' ? 'bg-green-400' :
          reaction === 'roses' ? 'bg-pink-400' :
          reaction === 'tomatoes' ? 'bg-red-600' :
          'bg-gray-700'
        }`}
      />

      {/* Main emoji for laughs/crickets */}
      {(reaction === 'laughs' || reaction === 'crickets') && (
        <div className="absolute inset-0 flex items-center justify-center">
          <animated.div 
            style={mainEmojiAnimation}
            className="text-8xl"
          >
            {mainEmoji}
          </animated.div>
        </div>
      )}

      {/* Flying items for roses/tomatoes */}
      {items.map(item => (
        <FlyingItem key={item.id} item={item} />
      ))}

      {/* Reaction text */}
      {isActive && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
          <div className={`text-4xl font-bold ${
            reaction === 'laughs' ? 'text-yellow-400 animate-bounce' :
            reaction === 'roses' ? 'text-pink-400 animate-bounce' :
            reaction === 'tomatoes' ? 'text-red-600 animate-shake' :
            'text-gray-500 animate-pulse'
          }`}>
            {reaction === 'laughs' && '🎉 HILARIOUS! 🎉'}
            {reaction === 'roses' && '👏 NICE ONE! 👏'}
            {reaction === 'tomatoes' && '👎 BOO! 👎'}
            {reaction === 'crickets' && '😐 ...crickets... 😐'}
          </div>
        </div>
      )}
    </div>
  );
}

// Individual flying item component
function FlyingItem({ item }: { item: FlyingItem }) {
  const animation = useSpring({
    from: { 
      transform: `translate(${item.x}vw, 100vh) rotate(0deg)`,
      opacity: 1
    },
    to: { 
      transform: `translate(${item.x}vw, -20vh) rotate(${item.rotation}deg)`,
      opacity: 0
    },
    config: { tension: 80, friction: 20 }
  });

  return (
    <animated.div 
      style={animation}
      className="absolute bottom-0 left-1/2 text-5xl"
    >
      {item.emoji}
    </animated.div>
  );
}
import { useSpring, animated, config } from 'react-spring';

interface ScoreDisplayProps {
  score: number;
  isVisible: boolean;
}

export default function ScoreDisplay({ score, isVisible }: ScoreDisplayProps) {
  // Animate score counting up
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: isVisible ? score : 0 },
    config: { tension: 100, friction: 20 },
  });

  // Container animation
  const containerAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0) rotate(-180deg)' },
    to: { 
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)'
    },
    config: config.wobbly,
  });

  // Glow effect based on score
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return 'from-green-400 to-emerald-400 shadow-green-400/50'; // Great - green
    if (scoreValue >= 60) return 'from-blue-400 to-cyan-400 shadow-blue-400/50'; // Good - blue
    if (scoreValue >= 40) return 'from-yellow-400 to-orange-400 shadow-yellow-400/50'; // Mixed - yellow
    return 'from-red-500 to-red-600 shadow-red-500/50'; // Poor - red
  };

  // Score label based on score
  const getScoreLabel = (scoreValue: number) => {
    if (scoreValue >= 90) return 'LEGENDARY!';
    if (scoreValue >= 80) return 'HILARIOUS!';
    if (scoreValue >= 70) return 'GREAT JOB!';
    if (scoreValue >= 60) return 'GOOD ONE!';
    if (scoreValue >= 50) return 'NOT BAD!';
    if (scoreValue >= 40) return 'KEEP TRYING!';
    if (scoreValue >= 30) return 'NEEDS WORK';
    return 'TOUGH CROWD';
  };

  return (
    <animated.div 
      style={containerAnimation}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <div className="relative">
        {/* Background circle with gradient */}
        <div className={`
          w-48 h-48 rounded-full bg-gradient-to-br ${getScoreColor(score)}
          shadow-2xl animate-pulse
        `} />
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <animated.div className="text-6xl font-bold text-white drop-shadow-lg">
            {number.to(n => Math.floor(n))}
          </animated.div>
          <div className="text-sm text-white/90 mt-2 font-medium">
            {getScoreLabel(score)}
          </div>
        </div>

        {/* Animated rings */}
        {isVisible && score >= 60 && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping animation-delay-200" />
          </>
        )}

        {/* Star burst for high scores */}
        {isVisible && score >= 80 && (
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-star-burst"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-100px)`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </animated.div>
  );
}
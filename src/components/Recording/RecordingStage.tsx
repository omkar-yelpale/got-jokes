import { useSpring, animated } from 'react-spring';

interface RecordingStageProps {
  isRecording: boolean;
  children: React.ReactNode;
}

export default function RecordingStage({ isRecording, children }: RecordingStageProps) {
  const curtainAnimation = useSpring({
    from: { transform: 'translateX(0%)' },
    to: { transform: isRecording ? 'translateX(-100%)' : 'translateX(0%)' },
    config: { tension: 120, friction: 30 }
  });

  const spotlightAnimation = useSpring({
    opacity: isRecording ? 1 : 0,
    transform: isRecording ? 'scale(1)' : 'scale(0.8)',
    config: { tension: 180, friction: 25 }
  });

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Stage Background */}
      <div className="relative h-80 bg-gradient-to-b from-zinc-900 to-zinc-800 rounded-t-3xl overflow-hidden">
        {/* Stage Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-900 to-amber-800" />
        
        {/* Spotlight */}
        <animated.div 
          style={spotlightAnimation}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-yellow-200/30 to-transparent rounded-full blur-xl" />
        </animated.div>

        {/* Content Area */}
        <div className="relative z-20 h-full flex items-center justify-center">
          {children}
        </div>

        {/* Curtains */}
        <div className="absolute inset-0 flex pointer-events-none">
          {/* Left Curtain */}
          <animated.div 
            style={{
              ...curtainAnimation,
              transformOrigin: 'left',
            }}
            className="w-1/2 h-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-700 to-red-600">
              {/* Curtain Folds */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent" />
              <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-black/30 to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/20 to-transparent" />
            </div>
          </animated.div>
          
          {/* Right Curtain */}
          <animated.div 
            style={{
              ...curtainAnimation,
              transformOrigin: 'right',
              transform: isRecording ? 'translateX(100%)' : 'translateX(0%)'
            }}
            className="w-1/2 h-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-red-900 via-red-700 to-red-600">
              {/* Curtain Folds */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/30 to-transparent" />
              <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-black/20 to-transparent" />
            </div>
          </animated.div>
        </div>

        {/* Stage Lights */}
        {isRecording && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-around px-8 pb-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-75" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-150" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-200" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-300" />
          </div>
        )}
      </div>

      {/* Stage Frame */}
      <div className="absolute -top-4 -left-4 -right-4 h-8 bg-gradient-to-b from-amber-900 to-amber-800 rounded-t-3xl" />
    </div>
  );
}
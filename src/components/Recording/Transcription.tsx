import { useSpring, animated } from 'react-spring';

interface TranscriptionProps {
  text: string;
  isRecording: boolean;
}

export default function Transcription({ text, isRecording }: TranscriptionProps) {
  const fadeAnimation = useSpring({
    opacity: text || isRecording ? 1 : 0,
    transform: text || isRecording ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 280, friction: 60 }
  });

  return (
    <animated.div 
      style={fadeAnimation}
      className="w-full max-w-md mx-auto mt-8 px-4"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-h-[120px]">
        <h3 className="text-white/70 text-sm font-medium mb-3">
          {isRecording ? 'Recording...' : 'Transcription'}
        </h3>
        <p className="text-white text-lg leading-relaxed">
          {text || (isRecording ? 'Start speaking...' : 'Your joke will appear here')}
        </p>
        
        {/* Recording pulse indicator */}
        {isRecording && !text && (
          <div className="flex gap-1 mt-4">
            <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" />
            <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse delay-75" />
            <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse delay-150" />
          </div>
        )}
      </div>
    </animated.div>
  );
}
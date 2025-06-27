import { IconMicrophone, IconPlayerStop } from '@tabler/icons-react';
import { useSpring, animated } from 'react-spring';

interface RecordButtonProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  disabled?: boolean;
}

export default function RecordButton({ isRecording, onToggleRecording, disabled }: RecordButtonProps) {
  const pulseAnimation = useSpring({
    from: { scale: 1 },
    to: { scale: isRecording ? [1, 1.1, 1] : 1 },
    loop: isRecording,
    config: { duration: 1000 }
  });

  const glowAnimation = useSpring({
    boxShadow: isRecording 
      ? '0 0 0 0 rgba(239, 68, 68, 0.7), 0 0 0 10px rgba(239, 68, 68, 0.3), 0 0 0 20px rgba(239, 68, 68, 0.1)'
      : '0 0 0 0 rgba(239, 68, 68, 0)',
    config: { tension: 300, friction: 30 }
  });

  return (
    <animated.button
      onClick={onToggleRecording}
      disabled={disabled}
      style={glowAnimation}
      className={`
        relative w-24 h-24 rounded-full flex items-center justify-center
        transition-all duration-300 transform hover:scale-105
        ${isRecording ? 'bg-red-600' : 'bg-red-500'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}
      `}
    >
      <animated.div 
        style={pulseAnimation}
        className="w-20 h-20 bg-white rounded-full flex items-center justify-center"
      >
        {isRecording ? (
          <IconPlayerStop size={36} className="text-red-600" />
        ) : (
          <IconMicrophone size={36} className="text-red-500" />
        )}
      </animated.div>
      
      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      )}
    </animated.button>
  );
}
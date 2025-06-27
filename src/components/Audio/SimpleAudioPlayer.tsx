import { useState, useRef, useEffect } from 'react';
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';

interface SimpleAudioPlayerProps {
  audioUrl: string;
  className?: string;
}

export default function SimpleAudioPlayer({ audioUrl, className = '' }: SimpleAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Handle audio ended
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    // Cleanup
    return () => {
      audio.pause();
      audio.remove();
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause any other audio that might be playing
      document.querySelectorAll('audio').forEach(audio => {
        if (audio !== audioRef.current) {
          audio.pause();
        }
      });
      
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={togglePlayPause}
      className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all ${className}`}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        <IconPlayerPause size={20} className="text-white" />
      ) : (
        <IconPlayerPlay size={20} className="text-white" />
      )}
    </button>
  );
}